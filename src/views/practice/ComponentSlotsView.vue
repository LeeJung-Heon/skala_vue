<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import SlotDefaultParent from '@/components/practices/component/SlotDefaultParent.vue'
import SlotNamedParent from '@/components/practices/component/SlotNamedParent.vue'
import SlotScopedParent from '@/components/practices/component/SlotScopedParent.vue'
</script>

<template>
  <PracticePage
    title="슬롯"
    description="자식 컴포넌트의 빈 자리에 부모가 마크업을 끼워 넣는 방법입니다. 기본 슬롯, 이름있는 슬롯, 자식의 데이터를 받아 쓰는 스코프 슬롯 순서로 실습합니다."
  >
    <h1>1. 기본 슬롯</h1>
    <hr />
    <SlotDefaultParent />

    <h1>2. 이름있는 슬롯</h1>
    <hr />
    <SlotNamedParent />

    <h1>3. 스코프 슬롯</h1>
    <hr />
    <SlotScopedParent />
  </PracticePage>
</template>
