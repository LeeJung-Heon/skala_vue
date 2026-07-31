<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import VueOnce from '@/components/practices/basic/VueOnce.vue'
import VueMemo from '@/components/practices/basic/VueMemo.vue'
import VuePre from '@/components/practices/basic/VuePre.vue'
import VueCloak from '@/components/practices/basic/VueCloak.vue'
</script>

<template>
  <PracticePage
    title="렌더링 최적화"
    description="불필요한 리렌더링을 줄이거나(v-once · v-memo), 템플릿 컴파일 자체를 건너뛰고(v-pre), 화면 깜빡임을 막는(v-cloak) 디렉티브들을 다룹니다."
  >
    <VueOnce />
    <VueMemo />
    <VuePre />
    <VueCloak />
  </PracticePage>
</template>
