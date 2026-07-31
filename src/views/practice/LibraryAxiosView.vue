<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import AxiosWeather from '@/components/practices/library/AxiosWeather.vue'
import AxiosJson from '@/components/practices/library/AxiosJson.vue'
</script>

<template>
  <PracticePage
    title="Axios 통신"
    description="외부 REST API 를 호출해 응답을 화면에 반영합니다. 비동기 요청의 로딩 · 성공 · 실패 상태를 어떻게 다루는지 살펴보세요."
  >
    <AxiosWeather />
    <AxiosJson />
  </PracticePage>
</template>
