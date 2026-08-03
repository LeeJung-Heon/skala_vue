<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label"
      >날씨단위: <strong>{{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</strong></span
    >
    <button @click="configStore.toggleUnit" class="toggle-btn">단위변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.unit-label {
  font-size: 13.5px;
  color: var(--skala-text-muted);
}

.unit-label strong {
  color: var(--skala-slate-ink);
}

.toggle-btn {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  background-color: var(--skala-slate);
  border: 1px solid var(--skala-slate);
  border-radius: var(--skala-radius-sm);
  cursor: pointer;
}

.toggle-btn:not(:disabled):hover {
  background-color: var(--skala-slate-deep);
  border-color: var(--skala-slate-deep);
  color: #ffffff;
}
</style>
