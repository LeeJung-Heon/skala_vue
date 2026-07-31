<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import ReactiveRef from '@/components/practices/composition/ReactiveRef.vue'
import ReactiveReactive from '@/components/practices/composition/ReactiveReactive.vue'
</script>

<template>
  <PracticePage
    title="반응형 상태"
    description="원시값을 감싸는 ref() 와 객체를 감싸는 reactive() 의 차이, 그리고 .value 를 언제 붙여야 하는지 확인합니다."
  >
    <ReactiveRef />
    <ReactiveReactive />
  </PracticePage>
</template>
