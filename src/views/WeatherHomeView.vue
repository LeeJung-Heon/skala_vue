<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import PracticePage from '@/components/layout/PracticePage.vue'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const router = useRouter()
const route = useRoute()

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 초기 마운트 시 주소창의 쿼리(?search=) 스트링 읽어서 상태 복원 (KeepAlive를 적용해야만 동작함)
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
})

// 타이핑될 때마다 주소창의 쿼리 스트링 값을 실시간 푸시 개편 (현재 큰 의미없음)
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 자식 카드 컴포넌트의 상세보기 신호를 받으면 해당 ID 주소로 라우터 점프 실행
const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}
</script>

<template>
  <PracticePage
    title="Weather 대시보드"
    description="라우터 · 컴포넌트 분리 · 쿼리 스트링 동기화를 한데 모은 종합 실습 앱입니다. 도시를 검색하거나 카드를 눌러 상세 페이지로 이동해 보세요."
  >
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>
      <WeatherCard v-for="item in filteredWeatherList" :key="item.id" :city-item="item" @select-card="(msg) => (selectedCityInfo = msg)" @click-detail="handleDetailJump(item.id)" />
    </BaseDashboardCard>
    <div class="status-bar">{{ selectedCityInfo }}</div>
  </PracticePage>
</template>

<style scoped>
.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
}
</style>
