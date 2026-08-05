<script setup>
/**
 * [실습] 과제 — Router 활용 / WeatherHomeView
 * - WeatherParent 역할을 뷰가 담당
 * - 상세보기: alert 대신 router.push(`/weather/${id}`)
 *
 * [실습] 과제 — 날씨 (컴포지션)
 * - 반응형 상태: searchQuery · cities(스토어) · selectedCityId
 * - computed: listedCities — 검색어로 도시 목록 필터
 * - watch: searchQuery — 타이핑 시 쿼리 동기화 · 원격 검색
 * - 검색 결과 표시: 일치 목록 / 빈 검색어면 전체 / 없으면 안내 문구
 *
 * [실습] 과제 — 날씨 (컴포넌트)
 * - CitySearchField · CityTile · WeatherAppShell 로 분리 (props / emits)
 */
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import WeatherAppShell from '@/components/weather/WeatherAppShell.vue'
import CitySearchField from '@/components/weather/CitySearchField.vue'
import CityTile from '@/components/weather/CityTile.vue'
import CityInsightCard from '@/components/weather/CityInsightCard.vue'
import WeatherIcon from '@/components/weather/WeatherIcon.vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import {
  displayCityName,
  displayRegion,
  makeCityId,
  samePlace,
} from '@/utils/cityMeta'

const router = useRouter()
const route = useRoute()
const config = useConfigStore()
const weatherStore = useWeatherStore()
const { cities, status, error, isLoading, adding, addError, selectedCityId, selectedCity } =
  storeToRefs(weatherStore)

// [실습] 과제 — 날씨 (컴포지션) / 반응형 상태 · searchQuery
const searchQuery = ref('')
const remoteLocations = ref([])
const searchingRemote = ref(false)
const searchError = ref('')
let searchTimer = null
let searchSeq = 0

onMounted(async () => {
  if (route.query.search) {
    searchQuery.value = String(route.query.search)
  }
  await weatherStore.fetchAll()
})

onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer)
})

// [실습] 과제 — 날씨 (컴포지션) / watch 로 searchQuery 감시 (쿼리 동기화 · API 검색)
watch(searchQuery, (newQuery) => {
  const nextQuery = newQuery || undefined
  const currentQuery = Array.isArray(route.query.search)
    ? route.query.search[0]
    : route.query.search
  if ((currentQuery || undefined) !== nextQuery) {
    router.replace({
      path: route.path,
      query: { search: nextQuery },
    })
  }

  if (searchTimer) clearTimeout(searchTimer)
  const trimmed = newQuery.trim()

  // 1글자(한글 조합 중간값 포함)부터 원격 후보를 갱신합니다.
  if (!trimmed) {
    remoteLocations.value = []
    searchingRemote.value = false
    searchError.value = ''
    return
  }

  searchingRemote.value = true
  searchError.value = ''
  const seq = ++searchSeq
  searchTimer = setTimeout(async () => {
    try {
      const results = await weatherStore.searchLocations(trimmed, { limit: 6 })
      if (seq !== searchSeq) return
      remoteLocations.value = results
      if (!results.length) {
        searchError.value = '검색 결과가 없습니다. 영문명(예: Tokyo)으로도 시도해 보세요.'
      }
    } catch (err) {
      if (seq !== searchSeq) return
      console.error('도시 검색 실패:', err)
      remoteLocations.value = []
      searchError.value =
        err?.response?.data?.message || err?.message || '도시 검색에 실패했습니다.'
    } finally {
      if (seq === searchSeq) searchingRemote.value = false
    }
  }, 220)
})

const matchesQuery = (city, query) => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    city.name.toLowerCase().includes(q) ||
    city.region.toLowerCase().includes(q) ||
    String(city.status || '')
      .toLowerCase()
      .includes(q)
  )
}

// [실습] 과제 — 날씨 (컴포지션) / computed — 검색어가 포함된 도시만 필터 (listedCities)
const listedCities = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return cities.value
  return cities.value.filter((city) => matchesQuery(city, query))
})

const suggestions = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return []

  const local = cities.value
    .filter((city) => matchesQuery(city, query))
    .slice(0, 6)
    .map((city) => ({
      id: `local_${city.id}`,
      kind: 'local',
      cityId: city.id,
      label: city.name,
      region: city.region,
      alreadyAdded: true,
    }))

  const remote = remoteLocations.value
    .filter((location) => !cities.value.some((city) => samePlace(city, location)))
    .map((location, index) => ({
      id: `remote_${makeCityId(location.lat, location.lon)}_${index}`,
      kind: 'remote',
      label: displayCityName(location),
      region: displayRegion(location),
      alreadyAdded: false,
      location,
    }))

  return [...local, ...remote]
})

const handleDetailJump = (id) => {
  // [실습] 과제 — Router 활용 / 상세보기: alert 대신 router.push
  weatherStore.selectCity(id)
  router.push(`/weather/${id}`)
}

const handleMapJump = (id) => {
  // [실습] 과제 — Router 활용 / 지도 보기: /weather/:cityId/map
  weatherStore.selectCity(id)
  router.push({ name: 'CityMap', params: { cityId: id } })
}

const handleRetry = () => {
  weatherStore.fetchAll({ force: true })
}

const handleAddSuggestion = async (location) => {
  try {
    const city = await weatherStore.addCityFromLocation(location)
    if (city) {
      weatherStore.selectCity(city.id)
      searchQuery.value = ''
      remoteLocations.value = []
    }
  } catch {
    // addError 는 스토어에 표시
  }
}

const handleSelectExisting = (cityId) => {
  weatherStore.selectCity(cityId)
  searchQuery.value = ''
  remoteLocations.value = []
  searchError.value = ''
}

const handleRemoveCity = (id) => {
  weatherStore.removeCity(id)
}

const scrollHomeToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
  document.body.scrollTo?.({ top: 0, behavior: 'smooth' })
}

watch(selectedCityId, (id, prevId) => {
  if (!id || id === prevId) return
  nextTick(scrollHomeToTop)
})
</script>

<template>
  <WeatherAppShell>
    <p v-if="isLoading" class="state-msg">실시간 기상 데이터를 불러오는 중입니다…</p>

    <div v-else-if="status === 'error'" class="state-msg state-error">
      <p>{{ error }}</p>
      <button type="button" class="retry-btn" @click="handleRetry">다시 시도</button>
    </div>

    <template v-else-if="status === 'ready' && !cities.length">
      <p class="state-msg">
        표시할 도시가 없습니다. 아래에서 도시를 검색해 추가해 보세요.
      </p>
      <section class="list" aria-labelledby="city-list-title-empty">
        <header class="list-head">
          <h2 id="city-list-title-empty" class="list-title">지역별 날씨</h2>
          <CitySearchField
            :current-query="searchQuery"
            :result-count="0"
            :suggestions="suggestions"
            :searching="searchingRemote"
            :adding="adding"
            :add-error="addError || searchError || ''"
            @update-query="(value) => (searchQuery = value)"
            @add-suggestion="handleAddSuggestion"
            @select-existing="handleSelectExisting"
          />
        </header>
      </section>
    </template>

    <template v-else-if="selectedCity">
      <section class="hero">
        <div class="hero-main">
          <div class="hero-top">
            <div class="hero-identity">
              <p class="hero-label">현재 관측</p>
              <h2 class="hero-city">{{ selectedCity.name }}</h2>
              <p class="hero-region">{{ selectedCity.region }}</p>
            </div>

            <!-- [실습] 과제 — Router 활용 / 지도 아이콘 → /weather/:cityId/map 로 이동 -->
            <button
              type="button"
              class="hero-map-btn"
              :title="`${selectedCity.name} 위치 지도에서 보기`"
              :aria-label="`${selectedCity.name} 위치 지도에서 보기`"
              @click="handleMapJump(selectedCity.id)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linejoin="round"
                />
                <circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8" />
              </svg>
            </button>
          </div>

          <div class="hero-temp">
            <WeatherIcon
              class="hero-icon"
              :name="selectedCity.icon"
              :size="50"
              :label="selectedCity.status"
            />
            <strong>{{ config.toDisplayTemp(selectedCity.temp) }}</strong>
            <span class="hero-unit">{{ config.unitSymbol }}</span>
          </div>
          <p class="hero-status">
            {{ selectedCity.status }} · 체감
            {{ config.toDisplayTemp(selectedCity.feels) }}{{ config.unitSymbol }}
          </p>

          <div class="hero-meta">
            <div class="meta-item">
              <span>습도</span>
              <strong>{{ selectedCity.humidity }}%</strong>
            </div>
            <div class="meta-item">
              <span>풍속</span>
              <strong>{{ selectedCity.wind }}m/s</strong>
            </div>
            <div class="meta-item">
              <span>강수확률</span>
              <strong>{{ selectedCity.rain }}%</strong>
            </div>
            <button type="button" class="hero-cta" @click="handleDetailJump(selectedCity.id)">
              상세 관측 정보
            </button>
          </div>
        </div>

        <!--
          [실습] 과제 — 날씨 (컴포넌트) / 히어로 우측 카드 → CityInsightCard
          기온 · 기상 상태 · 일출&일몰 세 패널을 탭으로 스위칭
        -->
        <CityInsightCard :city="selectedCity" />
      </section>

      <section class="list" aria-labelledby="city-list-title">
        <header class="list-head">
          <h2 id="city-list-title" class="list-title">지역별 날씨</h2>
          <CitySearchField
            :current-query="searchQuery"
            :result-count="listedCities.length"
            :suggestions="suggestions"
            :searching="searchingRemote"
            :adding="adding"
            :add-error="addError || searchError || ''"
            @update-query="(value) => (searchQuery = value)"
            @add-suggestion="handleAddSuggestion"
            @select-existing="handleSelectExisting"
          />
          <!--
            [실습] 과제 — 날씨 (컴포넌트) / SearchBar 역할 → CitySearchField
            props 로 검색어·결과 수신, update-query · select-existing emits
          -->
        </header>

        <div v-if="listedCities.length" class="city-grid">
          <!--
            [실습] 과제 — 날씨 Mockup / 배열 렌더링 (v-for) · :key 에 id 바인딩
            [실습] 과제 — 날씨 (컴포넌트) / WeatherCard 역할 → CityTile (props · select · detail emits)
          -->
          <CityTile
            v-for="city in listedCities"
            :key="city.id"
            :city="city"
            :active="city.id === selectedCityId"
            @select="(picked) => weatherStore.selectCity(picked.id)"
            @detail="handleDetailJump"
            @remove="handleRemoveCity"
          />
        </div>
        <!-- [실습] 과제 — 날씨 (컴포지션) / 검색 결과 없음 안내 -->
        <p v-else class="list-empty">
          <template v-if="searchQuery.trim()">
            “{{ searchQuery }}” 와 일치하는 도시가 없습니다. 위 검색 결과에서 추가해 보세요.
          </template>
          <template v-else>표시할 도시가 없습니다. 검색으로 도시를 추가해 보세요.</template>
        </p>
      </section>
    </template>
  </WeatherAppShell>
</template>

<style scoped>
.state-msg {
  margin: 0 0 24px;
  padding: 28px 20px;
  text-align: center;
  font-size: 13.5px;
  color: var(--w-muted);
  border: 1px dashed var(--w-border);
  border-radius: var(--w-radius);
  background: var(--w-panel);
}

.state-error {
  color: #f0a8a8;
}

.retry-btn {
  margin-top: 14px;
  padding: 8px 16px;
  font-size: 12.5px;
  font-weight: 700;
  color: #0d1017;
  background: var(--w-text);
  border: 0;
  border-radius: 999px;
  cursor: pointer;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 18px;
  margin-bottom: 34px;
}

.hero-main {
  padding: 24px 26px;
  border: 1px solid var(--w-border);
  border-radius: var(--w-radius);
  background: var(--w-panel);
  box-sizing: border-box;
}

.hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.hero-identity {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.hero-map-btn {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  color: var(--w-muted);
  background: var(--w-panel);
  border: 1px solid var(--w-border);
  border-radius: 12px;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.hero-map-btn svg {
  width: 20px;
  height: 20px;
}

.hero-map-btn:not(:disabled):hover {
  color: #0d1017;
  background: var(--w-accent);
  border-color: var(--w-accent);
}

.hero-label {
  margin: 0;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--w-accent);
}

.hero-city {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.035em;
  color: #ffffff;
}

.hero-region {
  margin: 0;
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.45;
  color: rgba(244, 246, 251, 0.68);
}

.hero-temp {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 18px;
}

.hero-icon {
  margin-top: 4px;
}

.hero-temp strong {
  font-size: 50px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  color: var(--w-text);
}

.hero-unit {
  margin-top: 6px;
  font-size: 20px;
  font-weight: 600;
  color: var(--w-muted);
}

.hero-status {
  margin: 12px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(244, 246, 251, 0.72);
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 20px 26px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid var(--w-border);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.meta-item span {
  font-size: 11.5px;
  color: var(--w-faint);
}

.meta-item strong {
  font-size: 15px;
  font-weight: 700;
  color: var(--w-text);
}

.hero-cta {
  margin-left: auto;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  color: #0d1017;
  background: var(--w-text);
  border: 1px solid var(--w-text);
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}

.hero-cta:not(:disabled):hover {
  color: #0d1017;
  background: var(--w-accent);
  border-color: var(--w-accent);
}

.list-head {
  position: relative;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.list-title {
  flex: none;
  margin: 0;
  padding: 0;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--w-text);
  border: 0;
}

.list-head :deep(.search) {
  flex: 1;
  max-width: 420px;
  margin-left: auto;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(215px, 1fr));
  gap: 14px;
  overflow-anchor: none;
}

.list-empty {
  padding: 40px 0;
  margin: 0;
  text-align: center;
  font-size: 13.5px;
  color: var(--w-muted);
  border: 1px dashed var(--w-border);
  border-radius: var(--w-radius);
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .list-head {
    flex-direction: column;
    align-items: stretch;
  }

  .list-head :deep(.search) {
    max-width: none;
    margin-left: 0;
  }
}

/* 좁은 화면: 구성은 유지하고 메인 카드·차트 크기만 비율 축소 */
@media (max-width: 720px) {
  .hero {
    gap: 14px;
    margin-bottom: 26px;
  }

  .hero-main {
    padding: 18px 16px;
  }

  .hero-city {
    font-size: 20px;
  }

  .hero-map-btn {
    width: 32px;
    height: 32px;
    border-radius: 10px;
  }

  .hero-map-btn svg {
    width: 17px;
    height: 17px;
  }

  .hero-region {
    font-size: 12px;
  }

  .hero-temp {
    margin-top: 14px;
    gap: 8px;
  }

  .hero-temp strong {
    font-size: 40px;
  }

  .hero-unit {
    font-size: 16px;
  }

  .hero-status {
    font-size: 12.5px;
  }

  .hero-meta {
    gap: 14px 18px;
    margin-top: 16px;
    padding-top: 14px;
  }

  .meta-item span {
    font-size: 10.5px;
  }

  .meta-item strong {
    font-size: 13.5px;
  }

  .hero-cta {
    padding: 8px 12px;
    font-size: 11.5px;
  }

  .city-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
