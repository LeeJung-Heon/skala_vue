<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import VueText from '@/components/practices/basic/VueText.vue'
import VueHtml from '@/components/practices/basic/VueHtml.vue'
import VueHtmlXss from '@/components/practices/basic/VueHtmlXss.vue'
import VueBind from '@/components/practices/basic/VueBind.vue'
import VueBindShorthand from '@/components/practices/basic/VueBindShorthand.vue'
import VueBindClass from '@/components/practices/basic/VueBindClass.vue'
import VueBindStyle from '@/components/practices/basic/VueBindStyle.vue'
import VueIf from '@/components/practices/basic/VueIf.vue'
import VueShow from '@/components/practices/basic/VueShow.vue'
import VueFor from '@/components/practices/basic/VueFor.vue'
</script>

<template>
  <PracticePage
    title="디렉티브"
    description="템플릿에 데이터를 출력하고(v-text · v-html), 속성을 묶고(v-bind), 조건과 반복으로 화면을 그리는(v-if · v-show · v-for) 핵심 디렉티브를 실습합니다."
  >
    <h1>1. 텍스트와 HTML 출력</h1>
    <hr />
    <VueText />
    <VueHtml />
    <VueHtmlXss />

    <h1>2. 속성 바인딩 (v-bind)</h1>
    <hr />
    <VueBind />
    <VueBindShorthand />
    <VueBindClass />
    <VueBindStyle />

    <h1>3. 조건부 렌더링</h1>
    <hr />
    <VueIf />
    <VueShow />

    <h1>4. 리스트 렌더링</h1>
    <hr />
    <VueFor />
  </PracticePage>
</template>
