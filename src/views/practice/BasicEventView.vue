<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import EventBasic from '@/components/practices/basic/EventBasic.vue'
import EventObject from '@/components/practices/basic/EventObject.vue'
import EventModifier from '@/components/practices/basic/EventModifier.vue'
</script>

<template>
  <PracticePage
    title="이벤트 처리"
    description="v-on(@) 으로 사용자 입력을 받고, 이벤트 객체를 활용하며, .prevent · .stop 같은 수식어로 기본 동작을 제어합니다."
  >
    <EventBasic />
    <EventObject />
    <EventModifier />
  </PracticePage>
</template>
