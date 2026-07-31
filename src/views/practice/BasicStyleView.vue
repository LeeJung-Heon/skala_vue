<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import StyleScoped from '@/components/practices/basic/StyleScoped.vue'
</script>

<template>
  <PracticePage
    title="스타일링"
    description="scoped 속성으로 스타일을 컴포넌트 안에 가두는 방법과, 외부 CSS 파일의 공통 클래스를 함께 쓰는 방법을 비교합니다."
  >
    <StyleScoped />
  </PracticePage>
</template>
