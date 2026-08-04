<script setup>
</script>

<template>
  <div class="app-shell">
    <main class="app-main">
      <RouterView v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  /* 문서(window) 스크롤을 사용해 iOS 상단 상태바 탭 → 맨 위 이동이 동작하게 합니다 */
  min-height: 100vh;
  min-height: 100svh;
  overflow: visible;
  background: #0d1017;
  color: #f4f6fb;
}

.app-main {
  min-height: 100vh;
  min-height: 100svh;
  overflow: visible;
}

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
