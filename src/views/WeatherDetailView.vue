<script setup>
/**
 * — Router 활용 / WeatherDetailView
 * - 동적 경로의 cityId 로 Mount(immediate watch) 시점에 도시 데이터 선택
 *
 * — Store 활용
 * - configStore 단위 환산이 상세 지표에도 동일 적용
 *
 * — 날씨 데이터 연동
 * - Mock 대신 weatherStore(OpenWeather 응답)에서 도시 객체 조회
 */
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import WeatherAppShell from '@/components/weather/WeatherAppShell.vue'
import WeatherIcon from '@/components/weather/WeatherIcon.vue'
import HourlySkyStrip from '@/components/weather/HourlySkyStrip.vue'
import SunArcPanel from '@/components/weather/SunArcPanel.vue'
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

// cityId 변경 시(마운트 포함) 해당 도시 데이터 로드
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

/** 가시거리(m) → 사람이 읽는 문구. OpenWeather 는 10km 에서 값이 잘림*/
const visibilityLabel = (meters) => {
  if (meters == null) return '정보 없음'
  if (meters >= 10000) return '10km 이상'
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)}km`
  return `${meters}m`
}

/** 현재 강수량 — 비/눈 중 값이 있는 쪽을 보여줌 */
const precipLabel = (target) => {
  if (target.snowAmount > 0) return `눈 ${target.snowAmount}mm`
  if (target.rainAmount > 0) return `비 ${target.rainAmount}mm`
  return '없음'
}

// 상세 관측 지표 — 기온·바람 계열 (시간대별 기상 상태 위)
const climateMetrics = computed(() => {
  if (!city.value) return []
  const target = city.value
  const unit = config.unitSymbol

  return [
    { label: '체감 기온', value: `${config.toDisplayTemp(target.feels)}${unit}` },
    {
      label: '최고 / 최저',
      value: `${config.toDisplayTemp(target.high)}° / ${config.toDisplayTemp(target.low)}°`,
    },
    {
      label: '일교차',
      value: `${config.toDisplayTempDelta(target.tempRange)}${unit}`,
      hint: '앞으로 24시간',
    },
    { label: '대기 습도', value: `${target.humidity}%` },
    {
      label: '바람',
      value: target.windDirection
        ? `${target.windDirection} ${target.wind}m/s`
        : `${target.wind}m/s`,
      hint: target.windDeg != null ? `풍향 ${Math.round(target.windDeg)}°` : '',
    },
    {
      label: '돌풍',
      value: target.windGust != null ? `${target.windGust}m/s` : '없음',
    },
  ]
})

// 강수·대기 계열 (시간대별 기상 상태 아래)
const skyMetrics = computed(() => {
  if (!city.value) return []
  const target = city.value

  return [
    { label: '강수 확률', value: `${target.rain}%` },
    { label: '강수량', value: precipLabel(target), hint: '최근 1시간' },
    { label: '구름량', value: target.clouds != null ? `${target.clouds}%` : '정보 없음' },
    { label: '가시거리', value: visibilityLabel(target.visibility) },
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
      <!-- 첫 카드에 지역·도시·기상 현황·기온을 한 번에 -->
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

      <!-- 기온 · 바람 계열 -->
      <section class="metric-grid" aria-label="상세 관측 지표">
        <div v-for="metric in climateMetrics" :key="metric.label" class="metric">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
          <em v-if="metric.hint">{{ metric.hint }}</em>
        </div>
      </section>

      <!-- 시간대별 기상 상태 -->
      <section class="panel-section">
        
        <HourlySkyStrip :hourly="city.hourly" :icon-size="48" />
      </section>

      <!-- 강수 · 대기 계열 -->
      <section class="metric-grid metric-grid-4" aria-label="강수 · 대기 지표">
        <div v-for="metric in skyMetrics" :key="metric.label" class="metric">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
          <em v-if="metric.hint">{{ metric.hint }}</em>
        </div>
      </section>

      <!-- 일출 & 일몰 -->
      <section class="panel-section">
        <SunArcPanel :city="city" />
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

/* 강수·대기 4개는 한 줄에 나란히 */
.metric-grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
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

.metric em {
  margin-top: -2px;
  font-size: 11px;
  font-style: normal;
  color: var(--w-faint);
}

/* 기상 상태 · 일출 일몰 섹션 */
.panel-section {
  margin-top: 18px;
  padding: 22px 24px;
  border: 1px solid var(--w-border);
  border-radius: var(--w-radius);
  background: var(--w-panel);
}

.section-title {
  margin: 0 0 16px;
  padding: 0;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--w-muted);
  border: 0;
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
  .metric-grid,
  .metric-grid-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  /* 기온 블록을 옆에 유지한 채 텍스트 줄 높이에 맞춰 카드를 낮춤 */
  .detail-hero {
    gap: 12px;
    padding: 18px 16px;
  }

  .detail-hero > div {
    min-width: 0;
  }

  .detail-region {
    font-size: 11px;
  }

  .detail-name {
    margin-top: 5px;
    font-size: 22px;
  }

  .detail-status {
    margin-top: 5px;
    font-size: 12.5px;
  }

  .detail-temp {
    gap: 8px;
    font-size: 38px;
  }

  .detail-temp em {
    font-size: 15px;
  }

  /* WeatherIcon 은 size prop 을 인라인 스타일로 넣어 !important 로만 덮을 수 있음 */
  .detail-icon {
    width: 30px !important;
    height: 30px !important;
  }

  .metric {
    padding: 13px 14px;
    gap: 6px;
  }

  .metric strong {
    font-size: 15.5px;
  }

  .panel-section {
    padding: 18px 16px;
  }

  .section-title {
    margin-bottom: 12px;
    font-size: 11.5px;
  }
}
</style>
