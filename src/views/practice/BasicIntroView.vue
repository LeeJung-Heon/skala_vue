<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import SampleOne from '@/components/practices/basic/SampleOne.vue'
import SampleTwo from '@/components/practices/basic/SampleTwo.vue'
</script>

<template>
  <PracticePage
    title="시작하기"
    description="일반 변수와 ref() 의 차이를 눈으로 확인하고, 템플릿 표현식(머스태시 문법) 안에서 자바스크립트를 어떻게 쓰는지 살펴봅니다."
  >
    <SampleOne />
    <SampleTwo />
  </PracticePage>
</template>
