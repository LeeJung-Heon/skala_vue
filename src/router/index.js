import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/weather',
  },
  {
    path: '/weather',
    name: 'WeatherHome',
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
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('@/views/WeatherDetailView.vue'),
    meta: { title: '도시 상세' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '페이지를 찾을 수 없습니다' },
  },
]

const router = createRouter({
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
