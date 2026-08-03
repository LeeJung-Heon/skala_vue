<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PracticePage from '@/components/layout/PracticePage.vue'

const route = useRoute()
const router = useRouter()

const mockDetails = {
  city_01: { name: '대한민국 서울특별시', temp: 28, status: '맑음', humidity: '55%', wind: '2.5m/s' },
  city_02: { name: '경기도 수원시 영통구', temp: 24, status: '비', humidity: '85%', wind: '4.1m/s' },
  city_03: { name: '부산광역시 해운대구', temp: 26, status: '구름', humidity: '65%', wind: '5.0m/s' },
}

const cityData = ref(null)

onMounted(() => {
  const id = route.params.cityId
  if (mockDetails[id]) {
    cityData.value = mockDetails[id]
  }
})
</script>

<template>
  <PracticePage
    title="도시 상세"
    description="URL 파라미터(:cityId)로 전달된 도시의 상세 관측 정보를 보여줍니다."
  >
    <div class="detail-container">
      <h2>📊 지역별 상세 기상 관측 정보</h2>

      <div v-if="cityData" class="info-card">
        <h4>📍 지정 지역: {{ cityData.name }}</h4>
        <dl class="info-grid">
          <dt>실시간 기온</dt>
          <dd class="accent">{{ cityData.temp }}°C</dd>
          <dt>기상 현황</dt>
          <dd>{{ cityData.status }}</dd>
          <dt>대기 습도</dt>
          <dd>{{ cityData.humidity }}</dd>
          <dt>현재 풍속</dt>
          <dd>{{ cityData.wind }}</dd>
        </dl>
      </div>
      <p v-else class="empty-result">해당 지역의 상세 데이터 장부가 존재하지 않습니다.</p>

      <button @click="router.push({ name: 'WeatherHome' })" class="back-btn">← 메인 대시보드로 돌아가기</button>
    </div>
  </PracticePage>
</template>

<style scoped>
.detail-container {
  padding: 20px 22px 22px;
  background: var(--skala-surface);
  border: 1px solid var(--skala-border);
  border-radius: var(--skala-radius);
  box-shadow: var(--skala-shadow-sm);
}

.info-card {
  margin: 16px 0 20px;
  padding: 16px 18px;
  background: var(--skala-surface-muted);
  border: 1px solid var(--skala-border);
  border-radius: var(--skala-radius-sm);
}

.info-card h4 {
  margin: 0 0 14px;
  font-size: 14.5px;
  font-weight: 700;
  color: var(--skala-slate-ink);
}

.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 9px 20px;
  margin: 0;
}

.info-grid dt {
  font-size: 12.5px;
  color: var(--skala-text-muted);
}

.info-grid dd {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--skala-slate-ink);
}

.info-grid dd.accent {
  color: var(--skala-green-dark);
}

.back-btn {
  padding: 8px 14px;
  font-weight: 600;
  color: #ffffff;
  background: var(--skala-slate);
  border: 1px solid var(--skala-slate);
  border-radius: var(--skala-radius-sm);
  cursor: pointer;
}

.back-btn:not(:disabled):hover {
  background: var(--skala-slate-deep);
  border-color: var(--skala-slate-deep);
  color: #ffffff;
}
</style>
