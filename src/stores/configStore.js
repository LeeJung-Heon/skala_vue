import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // 1. state: 단위를 저장하는 변수 (초기값은 'celsius')
  // 값은 오직 'celsius' 또는 'fahrenheit' 두 가지만 가집니다.
  const unit = ref('celsius')

  // 2. getters: 현재 단위 상태에 맞춰 화면에 뿌릴 기호(℃ / ℉)를 실시간 리턴
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // 3. actions: 버튼 클릭 시 'celsius'와 'fahrenheit'를 토글(스위칭)하는 함수
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // 완성 앱의 단위 스위치는 토글이 아니라 두 값 중 하나를 직접 고릅니다.
  function setUnit(next) {
    unit.value = next === 'fahrenheit' ? 'fahrenheit' : 'celsius'
  }

  // 저장된 원본 값은 항상 섭씨이므로, 화면에 뿌릴 때만 현재 단위로 환산합니다.
  function toDisplayTemp(celsius) {
    if (unit.value === 'fahrenheit') return Math.round(celsius * (9 / 5) + 32)
    return Math.round(celsius)
  }

  return {
    unit,
    unitSymbol,
    toggleUnit,
    setUnit,
    toDisplayTemp,
  }
})
