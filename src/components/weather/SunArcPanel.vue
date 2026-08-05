<script setup>
/**
 * [실습] 과제 — 날씨 (컴포넌트) / 일출·일몰 패널
 * - 완만한 원호 궤적 위에 해의 현재 위치를 표시합니다
 * - 메인의 CityInsightCard(일출·일몰 탭)와 상세 페이지가 함께 씁니다
 *
 * 해는 CSS motion path(offset-path)로 궤적 위만 따라 움직입니다.
 * cx/cy 를 각각 보간하면 두 점 사이를 직선으로 가로질러 궤적을 벗어납니다.
 */
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'

import { localTimeLabel } from '@/utils/mapOpenWeather'

const props = defineProps({
  city: { type: Object, required: true },
})

/**
 * 원호 기하 — 지평선 위로 살짝 솟은 완만한 곡선.
 * 현(chord) 폭 W, 중앙 높이(sagitta) H 로부터 반지름 R 을 구합니다.
 *   R = (W²/4 + H²) / 2H
 * 반원(H = W/2)보다 훨씬 낮아 카드 높이를 다른 탭과 맞출 수 있습니다.
 */
const VIEW = { w: 280, h: 122 }
const ARC = { cx: 140, base: 114, width: 250, rise: 100 }
const RADIUS = (ARC.width ** 2 / 4 + ARC.rise ** 2) / (2 * ARC.rise)
/** 현 양 끝의 중심각 절반 */
const HALF_ANGLE = Math.asin(ARC.width / 2 / RADIUS)
/** 원의 중심 (지평선 아래에 위치) */
const CENTER_Y = ARC.base - ARC.rise + RADIUS

const ARC_PATH = `M ${ARC.cx - ARC.width / 2} ${ARC.base} A ${RADIUS.toFixed(2)} ${RADIUS.toFixed(2)} 0 0 1 ${ARC.cx + ARC.width / 2} ${ARC.base}`

// 진행 바를 1분마다 갱신합니다.
const nowSec = ref(Math.floor(Date.now() / 1000))
let ticker = null

onMounted(() => {
  ticker = setInterval(() => {
    nowSec.value = Math.floor(Date.now() / 1000)
  }, 60_000)
})

onBeforeUnmount(() => {
  if (ticker) clearInterval(ticker)
})

/** 분 단위를 "N시간 M분" / "M분" 으로 표기 */
const durationLabel = (minutes) => {
  const m = Math.max(1, Math.round(minutes))
  return m >= 60 ? `${Math.floor(m / 60)}시간 ${m % 60}분` : `${m}분`
}

const sun = computed(() => {
  const { sunrise, sunset, timezoneOffsetSec = 0 } = props.city ?? {}
  if (sunrise == null || sunset == null) return null

  const span = sunset - sunrise
  const progress = Math.max(0, Math.min(1, span > 0 ? (nowSec.value - sunrise) / span : 0))
  const dayMinutes = Math.max(0, Math.round(span / 60))

  return {
    riseAt: localTimeLabel(sunrise, timezoneOffsetSec),
    setAt: localTimeLabel(sunset, timezoneOffsetSec),
    nowAt: localTimeLabel(nowSec.value, timezoneOffsetSec),
    dayLength: `${Math.floor(dayMinutes / 60)}시간 ${dayMinutes % 60}분`,
    progress,
    isDaytime: nowSec.value >= sunrise && nowSec.value <= sunset,
    remaining:
      nowSec.value < sunrise
        ? `일출까지 ${durationLabel((sunrise - nowSec.value) / 60)}`
        : nowSec.value <= sunset
          ? `일몰까지 ${durationLabel((sunset - nowSec.value) / 60)}`
          : '오늘 해가 졌습니다',
  }
})

/**
 * 궤적 위 해의 좌표 — offset-path 를 지원하지 않는 브라우저를 위한 값이자,
 * 계산이 궤적을 벗어나지 않는지 확인하는 기준입니다.
 * φ 는 -HALF_ANGLE(일출) ~ +HALF_ANGLE(일몰).
 */
const sunPoint = computed(() => {
  const phi = -HALF_ANGLE + 2 * HALF_ANGLE * (sun.value?.progress ?? 0)
  return {
    x: ARC.cx + RADIUS * Math.sin(phi),
    y: CENTER_Y - RADIUS * Math.cos(phi),
  }
})

/** 해를 궤적 위에서만 이동시키는 motion path 스타일 */
const sunMotionStyle = computed(() => ({
  offsetPath: `path("${ARC_PATH}")`,
  offsetDistance: `${(sun.value?.progress ?? 0) * 100}%`,
}))

const ariaLabel = computed(() =>
  sun.value
    ? `일출 ${sun.value.riseAt}, 일몰 ${sun.value.setAt}, 현지 시각 ${sun.value.nowAt}`
    : '일출·일몰 정보 없음',
)
</script>

<template>
  <div v-if="sun" class="sun-panel" :class="{ night: !sun.isDaytime }">
    <div class="arc-wrap">
      <svg class="arc" :viewBox="`0 0 ${VIEW.w} ${VIEW.h}`" role="img" :aria-label="ariaLabel">
        <defs>
          <linearGradient id="sunArcGradient" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stop-color="#ffb570" />
            <stop offset="55%" stop-color="#ffd98a" />
            <stop offset="100%" stop-color="#ffe9a8" />
          </linearGradient>
        </defs>

        <!-- 지평선 -->
        <line
          class="arc-horizon"
          :x1="ARC.cx - ARC.width / 2 - 8"
          :y1="ARC.base"
          :x2="ARC.cx + ARC.width / 2 + 8"
          :y2="ARC.base"
        />

        <!-- 전체 궤적 / 지나온 궤적 -->
        <path class="arc-track" :d="ARC_PATH" pathLength="100" />
        <path
          class="arc-progress"
          :d="ARC_PATH"
          pathLength="100"
          :stroke-dasharray="`${sun.progress * 100} 100`"
        />

        <!-- 현재 해 위치 (offset-path 로 궤적 위만 이동) -->
        <g class="arc-marker" :style="sunMotionStyle">
          <circle class="arc-glow" cx="0" cy="0" r="12" />
          <circle class="arc-sun" cx="0" cy="0" r="6" />
        </g>
      </svg>

      <div class="arc-center">
        <strong class="arc-now">{{ sun.nowAt }}</strong>
        <span class="arc-remaining">{{ sun.remaining }}</span>
      </div>
    </div>

    <div class="sun-ends">
      <div class="sun-item">
        <span class="sun-cap">일출</span>
        <strong>{{ sun.riseAt }}</strong>
      </div>
      <div class="sun-item sun-item-mid">
        <span class="sun-cap">낮 길이</span>
        <strong>{{ sun.dayLength }}</strong>
      </div>
      <div class="sun-item sun-item-end">
        <span class="sun-cap">일몰</span>
        <strong>{{ sun.setAt }}</strong>
      </div>
    </div>
  </div>

  <p v-else class="sun-empty">일출·일몰 정보를 불러오지 못했습니다.</p>
</template>

<style scoped>
.sun-panel {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  max-width: 330px;
  margin: 0 auto;
}

.arc-wrap {
  position: relative;
}

.arc {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.arc-horizon {
  stroke: var(--w-border);
  stroke-width: 1;
  stroke-dasharray: 3 5;
}

.arc-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.09);
  stroke-width: 3;
  stroke-linecap: round;
}

.arc-progress {
  fill: none;
  stroke: url(#sunArcGradient);
  stroke-width: 3.5;
  stroke-linecap: round;
  transition: stroke-dasharray 0.4s ease;
}

/* offset-path 로 이동하므로 좌표 보간이 궤적을 벗어나지 않습니다 */
.arc-marker {
  offset-rotate: 0deg;
  transition: offset-distance 0.4s ease;
}

.arc-glow {
  fill: rgba(255, 194, 122, 0.2);
}

.arc-sun {
  fill: var(--w-warm);
}

/* 해가 진 뒤/뜨기 전에는 야간 톤 */
.sun-panel.night .arc-progress {
  stroke: rgba(143, 208, 255, 0.4);
}

.sun-panel.night .arc-sun {
  fill: rgba(143, 208, 255, 0.85);
}

.sun-panel.night .arc-glow {
  fill: rgba(143, 208, 255, 0.16);
}

/* 원호 안쪽 중앙에 현재 시각을 겹쳐 둡니다 */
.arc-center {
  position: absolute;
  left: 50%;
  bottom: 12%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
}

.arc-now {
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--w-text);
  font-variant-numeric: tabular-nums;
}

.arc-remaining {
  font-size: 11.5px;
  color: var(--w-muted);
  white-space: nowrap;
}

.sun-ends {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.sun-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.sun-item-mid {
  align-items: center;
  text-align: center;
}

.sun-item-end {
  align-items: flex-end;
  text-align: right;
}

.sun-cap {
  font-size: 11px;
  color: var(--w-faint);
}

.sun-item strong {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--w-text);
  font-variant-numeric: tabular-nums;
}

.sun-item-mid strong {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--w-muted);
}

.sun-empty {
  margin: 0;
  text-align: center;
  font-size: 12.5px;
  color: var(--w-muted);
}

@media (prefers-reduced-motion: reduce) {
  .arc-progress,
  .arc-marker {
    transition: none;
  }
}

@media (max-width: 720px) {
  .arc-now {
    font-size: 22px;
  }

  .arc-remaining {
    font-size: 10.5px;
  }

  .sun-item strong {
    font-size: 15.5px;
  }

  .sun-item-mid strong {
    font-size: 12.5px;
  }

  .sun-cap {
    font-size: 10.5px;
  }
}
</style>
