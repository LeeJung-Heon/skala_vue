<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import LifecycleParent from '@/components/practices/component/LifecycleParent.vue'
</script>

<template>
  <PracticePage
    title="라이프사이클"
    description="컴포넌트가 생성 · 갱신 · 소멸하는 각 시점에 호출되는 훅을 관찰합니다. 자식을 껐다 켜면서 브라우저 콘솔의 로그 순서를 함께 확인해 보세요."
  >
    <LifecycleParent />
  </PracticePage>
</template>
