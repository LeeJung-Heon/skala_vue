<script setup>
/**
 * [실습] 과제 — 날씨 (컴포넌트) / 히어로 우측 카드
 * - 하나의 카드 안에서 세 패널을 스위칭합니다
 *   1) 시간대별 기온 (막대 차트)
 *   2) 시간대별 기상 상태 (HourlySkyStrip)
 *   3) 일출 & 일몰 (SunArcPanel)
 *
 * [실습] 과제 — 날씨 (컴포지션)
 * - 반응형 상태: activeTab
 * - computed: hourlyBars (도시가 바뀌면 자동 재계산)
 */
import { ref, computed } from 'vue'

import HourlySkyStrip from '@/components/weather/HourlySkyStrip.vue'
import SunArcPanel from '@/components/weather/SunArcPanel.vue'
import { useConfigStore } from '@/stores/configStore'
import { barFillStyle } from '@/utils/tempBands'

const props = defineProps({
  city: { type: Object, required: true },
})

const config = useConfigStore()

const TABS = [
  { key: 'temp', label: '기온', title: '시간대별 기온' },
  { key: 'sky', label: '기상', title: '시간대별 기상 상태' },
  { key: 'sun', label: '일출·일몰', title: '일출 & 일몰' },
]

const activeTab = ref('temp')

const activeTitle = computed(() => TABS.find((tab) => tab.key === activeTab.value).title)

const hourly = computed(() => props.city?.hourly ?? [])

const hourlyBars = computed(() => {
  if (!hourly.value.length) return []
  const max = Math.max(...hourly.value.map((point) => point.temp))
  return hourly.value.map((point) => ({
    ...point,
    style: barFillStyle(point.temp, 'vertical'),
    peak: point.temp >= max,
  }))
})
</script>

<template>
  <section class="insight" aria-label="도시 상세 패널">
    <header class="insight-head">
      <h3 class="insight-title">{{ activeTitle }}</h3>

      <!-- [실습] 과제 — 날씨 Mockup / 조건부 렌더링 · 탭 스위칭 -->
      <div class="tab-switch" role="tablist" aria-label="패널 선택">
        <button
          v-for="tab in TABS"
          :key="tab.key"
          type="button"
          role="tab"
          class="tab-btn"
          :class="{ on: activeTab === tab.key }"
          :aria-selected="activeTab === tab.key"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </header>

    <!-- 1) 시간대별 기온 -->
    <div v-if="activeTab === 'temp'" class="panel chart-bars">
      <div v-for="point in hourlyBars" :key="point.label" class="chart-col">
        <span class="chart-value" :class="{ peak: point.peak }">
          {{ config.toDisplayTemp(point.temp) }}°
        </span>
        <div class="chart-bar" :class="{ peak: point.peak }" :style="point.style"></div>
        <span class="chart-label">{{ point.label }}</span>
      </div>
    </div>

    <!-- 2) 시간대별 기상 상태 -->
    <div v-else-if="activeTab === 'sky'" class="panel panel-center">
      <HourlySkyStrip :hourly="hourly" />
    </div>

    <!-- 3) 일출 & 일몰 -->
    <div v-else class="panel panel-center">
      <SunArcPanel :city="city" />
    </div>
  </section>
</template>

<style scoped>
.insight {
  display: flex;
  flex-direction: column;
  padding: 24px 26px;
  border: 1px solid var(--w-border);
  border-radius: var(--w-radius);
  background: var(--w-panel);
  box-sizing: border-box;
}

.insight-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.insight-title {
  margin: 0;
  padding: 0;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--w-muted);
  border: 0;
  white-space: nowrap;
}

.tab-switch {
  display: inline-flex;
  flex: 0 0 auto;
  padding: 3px;
  border: 1px solid var(--w-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
}

.tab-btn {
  padding: 5px 11px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--w-muted);
  background: transparent;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
}

.tab-btn:not(:disabled):hover {
  color: var(--w-text);
  background: var(--w-panel-strong);
}

.tab-btn.on {
  color: #0d1017;
  background: var(--w-accent);
}

/* 세 패널이 같은 높이를 써서 탭을 바꿔도 카드 크기가 변하지 않습니다 */
.panel {
  flex: 1;
  min-height: clamp(160px, 20vh, 200px);
}

.panel-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 1) 기온 차트 */
.chart-bars {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: end;
  gap: 12px;
}

.chart-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  gap: 8px;
}

.chart-value {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--w-muted);
}

.chart-value.peak {
  color: var(--w-text);
}

.chart-bar {
  width: 100%;
  min-height: 8px;
  border-radius: 10px 10px 4px 4px;
  transition:
    height 0.28s ease,
    background 0.28s ease;
}

.chart-bar.peak {
  outline: 1px solid rgba(255, 255, 255, 0.22);
  outline-offset: 0;
}

.chart-label {
  font-size: 11px;
  color: var(--w-faint);
}

@media (prefers-reduced-motion: reduce) {
  .chart-bar {
    transition: none;
  }
}

/* 좁은 화면: 구성은 유지하고 크기만 비율 축소 */
@media (max-width: 720px) {
  .insight {
    padding: 18px 16px;
  }

  .insight-head {
    margin-bottom: 14px;
  }

  .insight-title {
    font-size: 11px;
  }

  .tab-btn {
    padding: 4px 9px;
    font-size: 10.5px;
  }

  .panel {
    min-height: clamp(200px, 26vh, 260px);
  }

  .chart-bars {
    gap: 8px;
  }

  .chart-col {
    gap: 6px;
  }

  .chart-value {
    font-size: 10.5px;
  }

  .chart-label {
    font-size: 10px;
  }
}

@media (max-width: 380px) {
  .insight-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .tab-switch {
    width: 100%;
  }

  .tab-btn {
    flex: 1;
  }
}
</style>
