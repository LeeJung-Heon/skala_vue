/**
 * [실습] 과제 — Router 활용
 * - Vue Router 설정: 라우트 지연 로딩(Lazy Loading) 적용
 * - Catch-all Route (`/:pathMatch(.*)*`) → NotFoundView
 * - 동적 세그먼트 `/weather/:cityId` 로 상세 페이지 연결
 * - 정적 경로(`/weather/about`)를 동적 경로보다 먼저 선언
 */
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/weather',
  },
  {
    path: '/weather',
    name: 'WeatherHome',
    // [실습] 과제 — Router 활용 / 라우터 지연 로딩
    component: () => import('@/views/WeatherHomeView.vue'),
    meta: { title: '대시보드' },
  },
  {
    path: '/weather/about',
    name: 'WeatherAbout',
    component: () => import('@/views/WeatherAboutView.vue'),
    meta: { title: '소개' },
  },
  {
    // [실습] 과제 — Router 활용 / CityMapView — 도시 위치를 3D 지도 마커로 표시
    path: '/weather/:cityId/map',
    name: 'CityMap',
    component: () => import('@/views/CityMapView.vue'),
    meta: { title: '위치 보기' },
  },
  {
    // [실습] 과제 — Router 활용 / WeatherDetailView — 동적 경로 cityId
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('@/views/WeatherDetailView.vue'),
    meta: { title: '도시 상세' },
  },
  {
    // [실습] 과제 — Router 활용 / Catch-all Route
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '페이지를 찾을 수 없습니다' },
  },
]

const router = createRouter({
  // GitHub Pages 등 정적 호스팅에서도 경로가 깨지지 않도록 Hash History 사용
  // [실습] 과제 — 완성 / Build 후 정적 파일(dist) GitHub Pages 호스팅
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // 검색어 쿼리만 바뀌는 경우 스크롤을 유지합니다 (모바일 입력 중 튐 방지)
    if (to.path === from.path) return false
    return { top: 0 }
  },
})

const BASE_TITLE = 'Skyline Weather'

router.afterEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} · Skyline Weather` : BASE_TITLE
})

export default router
