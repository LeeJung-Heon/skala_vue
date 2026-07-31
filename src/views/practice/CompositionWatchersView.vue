<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import WatchersBasic from '@/components/practices/composition/WatchersBasic.vue'
import WatchersDeep from '@/components/practices/composition/WatchersDeep.vue'
import WatchersMulti from '@/components/practices/composition/WatchersMulti.vue'
import WatchersReactive from '@/components/practices/composition/WatchersReactive.vue'
import WatchersRefArray from '@/components/practices/composition/WatchersRefArray.vue'
import WatchersReactiveArray from '@/components/practices/composition/WatchersReactiveArray.vue'
import WatchersWatchEffect from '@/components/practices/composition/WatchersWatchEffect.vue'
</script>

<template>
  <PracticePage
    title="감시자"
    description="상태 변화에 반응해 부수효과를 실행하는 watch 와 watchEffect 를 다룹니다. 깊은 감시(deep), 다중 소스, 배열 감시까지 단계적으로 살펴봅니다."
  >
    <h1>1. 기본 감시</h1>
    <hr />
    <WatchersBasic />

    <h1>2. 깊은 감시와 다중 소스</h1>
    <hr />
    <WatchersDeep />
    <WatchersMulti />

    <h1>3. reactive 와 배열 감시</h1>
    <hr />
    <WatchersReactive />
    <WatchersRefArray />
    <WatchersReactiveArray />

    <h1>4. watchEffect</h1>
    <hr />
    <WatchersWatchEffect />
  </PracticePage>
</template>
