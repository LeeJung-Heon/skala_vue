<script setup>
/**
 * 과제 확장 / 내 위치 날씨 카드
 * - 아직 위치를 확인하지 않았을 때 도시 목록 맨 앞에 놓이는 안내 카드
 * - 누르면 Geolocation → Reverse Geocoding → 날씨 조회 (weatherStore.detectMyLocation)
 * - 위치를 찾고 나면 일반 CityTile 로 대체되므로 이 카드는 사라집니다
 */
import { storeToRefs } from 'pinia'

import { useWeatherStore } from '@/stores/weatherStore'

const weatherStore = useWeatherStore()
const { locating, locateError } = storeToRefs(weatherStore)

const handleDetect = () => {
  weatherStore.detectMyLocation()
}
</script>

<template>
  <article
    class="locate-tile"
    :class="{ busy: locating }"
    role="button"
    tabindex="0"
    :aria-busy="locating"
    @click="handleDetect"
    @keydown.enter.prevent="handleDetect"
    @keydown.space.prevent="handleDetect"
  >
    <span class="locate-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.8" />
        <circle cx="12" cy="12" r="2.6" fill="currentColor" />
        <path
          d="M12 2v3M12 19v3M2 12h3M19 12h3"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      </svg>
    </span>

    <h3 class="locate-name">내 위치</h3>
    <p class="locate-desc">
      {{ locating ? '현재 위치를 확인하는 중입니다…' : '현재 위치의 날씨를 불러옵니다.' }}
    </p>

    <p v-if="locateError && !locating" class="locate-error">{{ locateError }}</p>

    <span class="locate-cta">
      {{ locating ? '확인 중…' : locateError ? '다시 시도' : '내 위치 날씨 보기 →' }}
    </span>
  </article>
</template>

<style scoped>
.locate-tile {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 18px 18px 16px;
  border: 1px dashed var(--w-border-strong);
  border-radius: 18px;
  background: var(--w-panel);
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    transform 0.16s ease;
}

.locate-tile:hover,
.locate-tile:focus-visible {
  border-color: var(--w-accent);
  background: var(--w-panel-strong);
  transform: translateY(-2px);
  outline: none;
}

.locate-tile.busy {
  cursor: progress;
}

.locate-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: #0d1017;
  background: var(--w-accent);
  border-radius: 12px;
}

.locate-icon svg {
  width: 19px;
  height: 19px;
}

.locate-tile.busy .locate-icon {
  animation: locate-pulse 1.2s ease-in-out infinite;
}

@keyframes locate-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

.locate-name {
  margin: 14px 0 0;
  padding: 0;
  font-size: 15.5px;
  font-weight: 700;
  color: var(--w-text);
  border: 0;
}

.locate-desc {
  margin: 6px 0 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--w-muted);
  word-break: keep-all;
}

.locate-error {
  margin: 8px 0 0;
  font-size: 11.5px;
  line-height: 1.45;
  color: #f0a8a8;
  word-break: keep-all;
}

.locate-cta {
  margin-top: auto;
  padding-top: 16px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--w-accent);
}

@media (prefers-reduced-motion: reduce) {
  .locate-tile,
  .locate-tile.busy .locate-icon {
    transition: none;
    animation: none;
  }
}

/* 좁은 화면: 구성은 유지하고 크기만 비율 축소 */
@media (max-width: 720px) {
  .locate-tile {
    padding: 14px 14px 12px;
    border-radius: 14px;
  }

  .locate-icon {
    width: 30px;
    height: 30px;
    border-radius: 10px;
  }

  .locate-icon svg {
    width: 17px;
    height: 17px;
  }

  .locate-name {
    margin-top: 12px;
    font-size: 13.5px;
  }

  .locate-desc {
    font-size: 11.5px;
  }

  .locate-cta {
    padding-top: 12px;
    font-size: 11.5px;
  }
}
</style>
