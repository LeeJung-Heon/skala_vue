<template>
  <div class="base-card">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.base-card {
  border: 1px solid var(--skala-border);
  border-radius: var(--skala-radius);
  padding: 16px 18px;
  margin-bottom: 12px;
  background: var(--skala-surface);
  box-shadow: var(--skala-shadow-sm);
}
</style>
