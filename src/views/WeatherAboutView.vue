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
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  line-height: 1.5;
  font-size: 14px;
}

ul {
  padding-left: 20px;
  margin: 8px 0 0 0;
}

li {
  margin-bottom: 6px;
  color: #555;
}

code {
  background-color: #ffeaa7;
  padding: 2px 4px;
  border-radius: 4px;
  color: #d63031;
}

.home-btn {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
</style>
