<script setup>
import PracticePage from '@/components/layout/PracticePage.vue'
import ModelBasic from '@/components/practices/basic/ModelBasic.vue'
import ModelForm from '@/components/practices/basic/ModelForm.vue'
import ModelModifier from '@/components/practices/basic/ModelModifier.vue'
</script>

<template>
  <PracticePage
    title="폼 바인딩"
    description="v-model 로 입력값과 상태를 양방향으로 묶고, 체크박스·라디오·셀렉트 등 폼 요소와 .lazy · .number · .trim 수식어를 실습합니다."
  >
    <ModelBasic />
    <ModelForm />
    <ModelModifier />
  </PracticePage>
</template>
