<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import ComputedBasic from '@/components/practices/composition/ComputedBasic.vue'
</script>

<template>
  <PracticePage
    title="계산된 속성"
    description="computed 는 의존하는 값이 바뀔 때만 다시 계산됩니다. 매번 실행되는 일반 함수와 어떻게 다른지 콘솔 로그로 비교해 보세요."
  >
    <ComputedBasic />
  </PracticePage>
</template>
