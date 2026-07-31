<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import WeatherMockup from '@/components/exercise/WeatherMockup.vue'
import WeatherParent from '@/components/exercise/WeatherParent.vue'
import WeatherComposition from '@/components/exercise/WeatherComposition.vue'
</script>

<template>
  <PracticePage
    title="단계별 구현"
    description="같은 날씨 대시보드를 세 단계로 발전시켜 봅니다. 하나의 파일에 몰아넣은 목업에서 출발해, 컴포넌트로 쪼개고, Composition API 로 로직을 정리합니다."
  >
    <h1>1단계 · 단일 파일 목업</h1>
    <hr />
    <WeatherMockup />

    <h1>2단계 · 컴포넌트 분리</h1>
    <hr />
    <WeatherParent />

    <h1>3단계 · Composition API 정리</h1>
    <hr />
    <WeatherComposition />
  </PracticePage>
</template>
