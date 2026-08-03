<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'Landing' })
}
</script>

<template>
  <!-- 전체 화면을 중앙 정렬하기 위한 래퍼 -->
  <div class="not-found-container">
    <div class="not-found-content">
      <!-- 시각적 포인트를 위한 아이콘 또는 큰 텍스트 (옵션) -->
      <div class="error-icon">☀️❓</div>

      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나,<br />아직 개발되지 않았습니다.</p>

      <!-- 포인트 컬러가 적용된 버튼 -->
      <button class="home-button" @click="goHome">학습 홈으로 이동</button>
    </div>
  </div>
</template>

<!-- Scoped CSS로 이 컴포넌트에만 스타일 적용 -->
<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /* 부모 요소(예: App.vue)에서 남은 높이를 다 쓰도록 설정 */
  min-height: 70vh;
  padding: 40px var(--skala-gutter);
  background-color: transparent; /* 앱 셸의 배경을 그대로 사용 */
  font-family: var(--skala-font-sans);
}

.not-found-content {
  text-align: center;
  background-color: var(--skala-surface);
  padding: 50px;
  border-radius: var(--skala-radius-lg);
  box-shadow: var(--skala-shadow-md); /* 은은한 그림자 */
  border: 1px solid var(--skala-border);
}

.error-icon {
  font-size: 5rem; /* 아주 크게 */
  margin-bottom: 20px;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--skala-ink);
  margin-bottom: 15px;
  letter-spacing: -0.5px;
  border: none;
  padding: 0;
}

p {
  font-size: 1.1rem;
  color: var(--skala-ink-muted);
  line-height: 1.6;
  margin-bottom: 35px;
}

.home-button {
  background-color: var(--skala-ink); /* 랜딩의 primary CTA 와 동일한 처리 */
  color: #f4f5f8;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 30px; /* 둥근 버튼 */
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
}

/* Hover 및 Active 효과 */
.home-button:not(:disabled):hover {
  background-color: var(--skala-accent);
  color: #f4f5f8;
}

.home-button:active {
  transform: scale(0.98); /* 클릭 시 살짝 눌리는 효과 */
}
</style>
