<template>
  <div class="base-dashboard-card">
    <slot></slot>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  padding: 16px 18px;
  margin-bottom: 14px;
  background: var(--skala-surface);
  border: 1px solid var(--skala-border);
  border-radius: var(--skala-radius);
  box-shadow: var(--skala-shadow-sm);
}

/* 카드 안 첫 제목의 상단 여백 제거 (practice.css h3 의 margin-top 상쇄) */
.base-dashboard-card :deep(h3:first-child) {
  margin-top: 0;
}
</style>
