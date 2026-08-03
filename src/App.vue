<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <div class="app-shell">
    <AppSidebar />

    <div class="app-body">
      <main class="app-main">
        <RouterView v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </RouterView>
      </main>

      <footer class="app-footer">
        <span class="footer-brand">SKALA-VUE</span>
        <span class="footer-note">모던 웹 애플리케이션 개발 실습실 · Vue 3 + Vite</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--skala-page-bg);
  color: var(--skala-ink);
}

.app-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
}

.app-footer {
  margin-top: auto;
  padding: 24px 72px;
  border-top: 1px solid var(--skala-border);
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12px;
}

.footer-brand {
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--skala-ink);
}

.footer-note {
  font-size: 12px;
  color: var(--skala-ink-muted);
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

@media (max-width: 900px) {
  .app-shell {
    flex-direction: column;
  }

  .app-footer {
    padding: 20px 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
