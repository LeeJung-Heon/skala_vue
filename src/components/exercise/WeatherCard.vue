<script setup>
// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수 (매크로)
defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록 (매크로)
const emit = defineEmits(['select-card', 'click-detail'])

// 스타일 메모: .weather-card / .badge / .hot / .cool / .btn-detail 의 시각 표현은
// assets/exercise.css 에서 디자인 토큰 기반으로 공통 관리합니다.
// (WeatherMockup · WeatherComposition 의 인라인 카드와 모양을 일치시키기 위함)
</script>

<template>
  <div class="weather-card" @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)">
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ cityItem.temp }}°C</p>

    <span v-if="cityItem.temp >= 25" class="badge hot">🔥 더움</span>
    <span v-else class="badge cool">❄️ 선선함</span>

    <button class="btn-detail" @click.stop="emit('click-detail', cityItem.name, cityItem.status)">상세보기</button>
  </div>
</template>
