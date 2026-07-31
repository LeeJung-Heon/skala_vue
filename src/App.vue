<script setup>
import AppNavbar from '@/components/layout/AppNavbar.vue'
</script>

<template>
  <div class="app-shell">
    <AppNavbar />

    <main class="app-main">
      <RouterView v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </main>

    <footer class="app-footer">
      <div class="footer-inner">
        <span class="footer-brand">SKALA-VUE</span>
        <span class="footer-note">모던 웹 애플리케이션 개발 실습실 · Vue 3 + Vite</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--skala-page-bg);
}

.app-main {
  flex: 1;
}

.app-footer {
  border-top: 1px solid var(--skala-border);
  background: var(--skala-surface);
}

.footer-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 22px 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
}

.footer-brand {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--skala-slate);
}

.footer-note {
  font-size: 12.5px;
  color: var(--skala-text-muted);
}

/* 페이지 전환 효과 */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
