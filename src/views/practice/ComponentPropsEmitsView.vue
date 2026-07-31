<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import PropsEmitsParent from '@/components/practices/component/PropsEmitsParent.vue'
</script>

<template>
  <PracticePage
    title="Props & Emits"
    description="데이터는 props 로 부모에서 자식으로 내려가고, 변경 요청은 emit 이벤트로 자식에서 부모로 올라갑니다. 단방향 데이터 흐름을 직접 확인해 보세요."
  >
    <PropsEmitsParent />
  </PracticePage>
</template>
