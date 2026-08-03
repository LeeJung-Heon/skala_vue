<script setup>
import { useRouter } from 'vue-router'
import PracticePage from '@/components/layout/PracticePage.vue'

const router = useRouter()

const handleGoHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <PracticePage
    title="앱 소개"
    description="날씨 대시보드 실습 앱이 어떤 기술로 구성되어 있는지 정리한 페이지입니다."
  >
    <div class="practice-section">
      <h2>ℹ️ 서비스 소개</h2>

      <div class="description-box">
        <p>본 앱은 <strong>Vue 3</strong> 및 <strong>Vue Router 4</strong> 기반 제작된 실습용 기상 관측 대시보드 시스템입니다.</p>
        <ul>
          <li><code>components/exercise/</code> 폴더 내부의 독립 부품 연동</li>
          <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
          <li>URL 쿼리 스트링 매핑을 활용한 실시간 검색 상태 동기화</li>
        </ul>
      </div>

      <button @click="handleGoHome" class="home-btn">대시보드 홈으로 이동</button>
    </div>
  </PracticePage>
</template>

<style scoped>
.description-box {
  padding: 14px 16px;
  background-color: var(--skala-surface-muted);
  border: 1px solid var(--skala-border);
  border-radius: var(--skala-radius-sm);
  line-height: 1.6;
  font-size: 14px;
  color: var(--skala-text);
}

.description-box p {
  margin: 0;
}

ul {
  padding-left: 20px;
  margin: 10px 0 0 0;
}

li {
  margin-bottom: 6px;
  color: var(--skala-text-muted);
}

code {
  padding: 2px 6px;
  font-size: 12.5px;
  background-color: var(--skala-accent-soft);
  border: 1px solid var(--skala-accent-line);
  border-radius: 4px;
  color: var(--skala-accent-strong);
}

.home-btn {
  width: 100%;
  margin-top: 16px;
  padding: 11px;
  font-weight: 600;
  color: #ffffff;
  background-color: var(--skala-green);
  border: 1px solid var(--skala-green);
  border-radius: var(--skala-radius-sm);
  cursor: pointer;
}

.home-btn:not(:disabled):hover {
  background-color: var(--skala-green-dark);
  border-color: var(--skala-green-dark);
  color: #ffffff;
}
</style>
