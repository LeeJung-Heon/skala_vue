/**
 * [실습] 과제 — Store 활용 / stores/configStore.js
 * - state · unit — 온도 단위 (초기값: celsius)
 * - getters · unitSymbol — 현재 단위 기호 (℃ / ℉)
 * - actions · toggleUnit — celsius ↔ fahrenheit 토글
 *
 * 완성 앱에서는 헤더 스위치가 값을 직접 고르도록 setUnit · toDisplayTemp 를 추가했습니다.
 * (메인/상세 화면이 동일 스토어를 공유해 단위 변경이 전역 반영됩니다.)
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // [실습] state · unit
  const unit = ref('celsius')

  // [실습] getters · unitSymbol
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // [실습] actions · toggleUnit
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // 완성 앱: 단위 버튼이 ℃ / ℉ 중 하나를 직접 선택
  function setUnit(next) {
    unit.value = next === 'fahrenheit' ? 'fahrenheit' : 'celsius'
  }

  // 원본 API 값은 섭씨 고정 → 화면 표시 시에만 환산
  function toDisplayTemp(celsius) {
    if (unit.value === 'fahrenheit') return Math.round(celsius * (9 / 5) + 32)
    return Math.round(celsius)
  }

  // 온도 '차이'(일교차 등)는 오프셋(+32) 없이 배율만 적용합니다
  function toDisplayTempDelta(celsiusDelta) {
    if (unit.value === 'fahrenheit') return Math.round(celsiusDelta * (9 / 5))
    return Math.round(celsiusDelta)
  }

  return {
    unit,
    unitSymbol,
    toggleUnit,
    setUnit,
    toDisplayTemp,
    toDisplayTempDelta,
  }
})
