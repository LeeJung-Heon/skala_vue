<script setup>
/**
 * — Router 활용 / Catch-all → NotFoundView
 */
import WeatherAppShell from '@/components/weather/WeatherAppShell.vue'
</script>

<template>
  <WeatherAppShell>
    <div class="not-found">
      <p class="code">404</p>
      <h1>페이지를 찾을 수 없습니다</h1>
      <p class="desc">요청한 주소가 없거나 이동되었을 수 있습니다.</p>
      <RouterLink to="/weather" class="home-link">대시보드로 돌아가기</RouterLink>
    </div>
  </WeatherAppShell>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 48px 0 24px;
}

.code {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: rgba(244, 246, 251, 0.45);
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.desc {
  margin: 0 0 12px;
  font-size: 14.5px;
  line-height: 1.6;
  color: rgba(244, 246, 251, 0.62);
}

.home-link {
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: #8fd0ff;
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
}

.home-link:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
