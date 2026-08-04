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
  /* svh: 키보드가 열려도 뷰포트 높이가 흔들리지 않음 (dvh는 입력 중 스크롤 튐 유발) */
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: #0d1017;
  color: #f4f6fb;
}

.app-main {
  height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.app-main::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
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
