<script setup>
/**
 * [실습] 과제 — Router 활용 / WeatherDetailView
 * - 동적 경로의 cityId 로 Mount(immediate watch) 시점에 도시 데이터 선택
 *
 * [실습] 과제 — Store 활용
 * - configStore 단위 환산이 상세 지표에도 동일 적용
 *
 * [실습] 과제 — 날씨 데이터 연동
 * - Mock 대신 weatherStore(OpenWeather 응답)에서 도시 객체 조회
 */
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import WeatherAppShell from '@/components/weather/WeatherAppShell.vue'
import WeatherIcon from '@/components/weather/WeatherIcon.vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { bandLegendItems, barFillStyle } from '@/utils/tempBands'

const route = useRoute()
const router = useRouter()
const config = useConfigStore()
const weatherStore = useWeatherStore()

const city = ref(null)
const isLoading = ref(false)
const loadError = ref(null)

const loadCity = async (cityId) => {
  isLoading.value = true
  loadError.value = null
  try {
    if (!weatherStore.isReady) {
      await weatherStore.fetchAll()
    }

    const resolved =
      weatherStore.findCity(cityId) ?? (await weatherStore.ensureCity(cityId))

    if (!resolved && !weatherStore.resolveMeta(cityId)) {
      city.value = null
      return
    }

    city.value = resolved
  } catch (error) {
    city.value = null
    loadError.value =
      error?.response?.data?.message ||
      error?.message ||
      '상세 날씨 데이터를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

// [실습] cityId 변경 시(마운트 포함) 해당 도시 데이터 로드
watch(
  () => route.params.cityId,
  (cityId) => {
    loadCity(cityId)
  },
  { immediate: true },
)

const hourlyBars = computed(() => {
  if (!city.value) return []
  return city.value.hourly.map((point) => ({
    ...point,
    style: barFillStyle(point.temp, 'horizontal'),
  }))
})

const bandLegend = bandLegendItems()

const metrics = computed(() => {
  if (!city.value) return []
  return [
    { label: '체감 기온', value: `${config.toDisplayTemp(city.value.feels)}${config.unitSymbol}` },
    {
      label: '최고 / 최저',
      value: `${config.toDisplayTemp(city.value.high)}° / ${config.toDisplayTemp(city.value.low)}°`,
    },
    { label: '대기 습도', value: `${city.value.humidity}%` },
    { label: '현재 풍속', value: `${city.value.wind}m/s` },
    { label: '강수 확률', value: `${city.value.rain}%` },
    { label: '기상 현황', value: city.value.status },
  ]
})
</script>

<template>
  <WeatherAppShell>
    <button type="button" class="back" @click="router.push({ name: 'WeatherHome' })">
      ← 대시보드
    </button>

    <p v-if="isLoading" class="state-msg">상세 관측 정보를 동기화하는 중입니다…</p>

    <div v-else-if="loadError" class="state-msg state-error">
      <p>{{ loadError }}</p>
    </div>

    <template v-else-if="city">
      <section class="detail-hero">
        <div>
          <p class="detail-region">{{ city.region }}</p>
          <h1 class="detail-name">{{ city.name }}</h1>
          <p class="detail-status">{{ city.status }}</p>
        </div>
        <p class="detail-temp">
          <WeatherIcon class="detail-icon" :name="city.icon" :size="40" :label="city.status" />
          {{ config.toDisplayTemp(city.temp) }}<em>{{ config.unitSymbol }}</em>
        </p>
      </section>

      <section class="metric-grid" aria-label="상세 관측 지표">
        <div v-for="metric in metrics" :key="metric.label" class="metric">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
        </div>
      </section>

      <section class="timeline">
        <header class="timeline-head">
          <h2 class="timeline-title">오늘의 시간대별 예보</h2>
          <ul class="band-legend" aria-label="기온 구간 색상">
            <li v-for="item in bandLegend" :key="item.label">
              <span class="band-swatch" :style="{ background: item.color }" aria-hidden="true"></span>
              {{ item.label }}
            </li>
          </ul>
        </header>
        <ul class="timeline-list">
          <li v-for="point in hourlyBars" :key="point.label">
            <span class="timeline-label">{{ point.label }}</span>
            <span class="timeline-track">
              <span class="timeline-fill" :style="point.style"></span>
            </span>
            <strong class="timeline-temp">
              {{ config.toDisplayTemp(point.temp) }}{{ config.unitSymbol }}
            </strong>
          </li>
        </ul>
      </section>
    </template>

    <p v-else class="not-found">해당 지역의 상세 데이터가 존재하지 않습니다.</p>
  </WeatherAppShell>
</template>

<style scoped>
.back {
  margin-bottom: 20px;
  padding: 7px 14px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--w-muted);
  background: transparent;
  border: 1px solid var(--w-border);
  border-radius: 999px;
  cursor: pointer;
}

.back:not(:disabled):hover {
  color: var(--w-text);
  background: var(--w-panel);
  border-color: var(--w-border-strong);
}

.state-msg {
  margin: 0;
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

.detail-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 26px 28px;
  border: 1px solid var(--w-border);
  border-radius: var(--w-radius);
  background: var(--w-panel);
}

.detail-region {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.05em;
  color: var(--w-faint);
}

.detail-name {
  margin: 8px 0 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: var(--w-text);
}

.detail-status {
  margin: 8px 0 0;
  font-size: 13.5px;
  color: var(--w-muted);
}

.detail-temp {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 54px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  color: var(--w-text);
}

.detail-icon {
  flex: 0 0 auto;
}

.detail-temp em {
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  color: var(--w-muted);
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 16px 18px;
  border: 1px solid var(--w-border);
  border-radius: 16px;
  background: var(--w-panel);
}

.metric span {
  font-size: 11.5px;
  color: var(--w-faint);
}

.metric strong {
  font-size: 17px;
  font-weight: 700;
  color: var(--w-text);
}

.timeline {
  margin-top: 18px;
  padding: 22px 24px;
  border: 1px solid var(--w-border);
  border-radius: var(--w-radius);
  background: var(--w-panel);
}

.timeline-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 16px;
  margin-bottom: 16px;
}

.timeline-title {
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--w-text);
  border: 0;
}

.band-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 11px;
  color: var(--w-faint);
}

.band-legend li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.band-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline-list li {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 56px;
  align-items: center;
  gap: 14px;
}

.timeline-label {
  font-size: 12px;
  color: var(--w-faint);
}

.timeline-track {
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;
}

.timeline-fill {
  display: block;
  height: 100%;
  min-width: 0;
  border-radius: 999px;
  transition:
    width 0.28s ease,
    background 0.28s ease;
}

@media (prefers-reduced-motion: reduce) {
  .timeline-fill {
    transition: none;
  }
}

.timeline-temp {
  font-size: 13px;
  font-weight: 700;
  text-align: right;
  color: var(--w-text);
}

.not-found {
  padding: 48px 0;
  margin: 0;
  text-align: center;
  font-size: 13.5px;
  color: var(--w-muted);
  border: 1px dashed var(--w-border);
  border-radius: var(--w-radius);
}

@media (max-width: 900px) {
  .detail-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
