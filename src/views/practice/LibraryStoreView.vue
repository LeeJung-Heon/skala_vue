<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import StoreCounter from '@/components/practices/library/StoreCounter.vue'
</script>

<template>
  <PracticePage
    title="Pinia 스토어"
    description="컴포넌트 밖에 상태를 두고 어디서든 꺼내 쓰는 전역 상태 관리입니다. 페이지를 옮겨 다녀도 값이 유지되는지 확인해 보세요."
  >
    <StoreCounter />
  </PracticePage>
</template>
