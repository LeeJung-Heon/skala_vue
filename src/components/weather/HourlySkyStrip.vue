<script setup>
/**
 * — 날씨 (컴포넌트) / 시간대별 기상 상태
 * - 3시간 간격 5구간의 아이콘 · 기상 문구 · 기온
 * - 메인의 CityInsightCard(기상 탭)와 상세 페이지가 함께 씀
 *
 **/ 
import WeatherIcon from '@/components/weather/WeatherIcon.vue'
import { useConfigStore } from '@/stores/configStore'

defineProps({
  hourly: { type: Array, default: () => [] },

  /* 아이콘 크기(px) — 상세 페이지에서는 더 크게 씀 */

  iconSize: { type: Number, default: 44 },
})

const config = useConfigStore()
</script>

<template>
  <div class="sky-grid">
    <div v-for="point in hourly" :key="point.label" class="sky-col" :class="{ now: point.isNow }">
      <span class="sky-label">{{ point.isNow ? '지금' : point.label }}</span>
      <WeatherIcon class="sky-icon" :name="point.icon" :size="iconSize" :label="point.status" />
      <span class="sky-status">{{ point.status }}</span>
      <span class="sky-temp">{{ config.toDisplayTemp(point.temp) }}°</span>
    </div>
  </div>
</template>

<style scoped>
.sky-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  gap: 8px;
  width: 100%;
}

.sky-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-width: 0;
  padding: 14px 4px;
  border: 1px solid transparent;
  border-radius: 16px;
}

.sky-col.now {
  border-color: var(--w-border);
  background: rgba(255, 255, 255, 0.05);
}

.sky-label {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--w-muted);
}

.sky-col.now .sky-label {
  color: var(--w-accent);
}

.sky-status {
  font-size: 12.5px;
  line-height: 1.3;
  text-align: center;
  color: var(--w-muted);
  word-break: keep-all;
}

.sky-temp {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--w-text);
}

@media (max-width: 720px) {
  .sky-grid {
    gap: 4px;
  }

  .sky-col {
    padding: 10px 2px;
    gap: 7px;
  }

  .sky-label,
  .sky-status {
    font-size: 11px;
  }

  .sky-temp {
    font-size: 14.5px;
  }
}
</style>
