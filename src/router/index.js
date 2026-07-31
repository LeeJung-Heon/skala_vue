import { createRouter, createWebHashHistory } from 'vue-router'
import LandingView from '@/views/LandingView.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingView,
    meta: { title: '홈' },
  },

  /* ---------- 기초 문법 ---------- */
  {
    path: '/basic/intro',
    name: 'BasicIntro',
    component: () => import('@/views/practice/BasicIntroView.vue'),
    meta: { title: '시작하기' },
  },
  {
    path: '/basic/directive',
    name: 'BasicDirective',
    component: () => import('@/views/practice/BasicDirectiveView.vue'),
    meta: { title: '디렉티브' },
  },
  {
    path: '/basic/render',
    name: 'BasicRender',
    component: () => import('@/views/practice/BasicRenderView.vue'),
    meta: { title: '렌더링 최적화' },
  },
  {
    path: '/basic/event',
    name: 'BasicEvent',
    component: () => import('@/views/practice/BasicEventView.vue'),
    meta: { title: '이벤트 처리' },
  },
  {
    path: '/basic/model',
    name: 'BasicModel',
    component: () => import('@/views/practice/BasicModelView.vue'),
    meta: { title: '폼 바인딩' },
  },
  {
    path: '/basic/style',
    name: 'BasicStyle',
    component: () => import('@/views/practice/BasicStyleView.vue'),
    meta: { title: '스타일링' },
  },

  /* ---------- Composition API ---------- */
  {
    path: '/composition/reactivity',
    name: 'CompositionReactivity',
    component: () => import('@/views/practice/CompositionReactivityView.vue'),
    meta: { title: '반응형 상태' },
  },
  {
    path: '/composition/computed',
    name: 'CompositionComputed',
    component: () => import('@/views/practice/CompositionComputedView.vue'),
    meta: { title: '계산된 속성' },
  },
  {
    path: '/composition/watchers',
    name: 'CompositionWatchers',
    component: () => import('@/views/practice/CompositionWatchersView.vue'),
    meta: { title: '감시자' },
  },

  /* ---------- 컴포넌트 ---------- */
  {
    path: '/component/props-emits',
    name: 'ComponentPropsEmits',
    component: () => import('@/views/practice/ComponentPropsEmitsView.vue'),
    meta: { title: 'Props & Emits' },
  },
  {
    path: '/component/slots',
    name: 'ComponentSlots',
    component: () => import('@/views/practice/ComponentSlotsView.vue'),
    meta: { title: '슬롯' },
  },
  {
    path: '/component/lifecycle',
    name: 'ComponentLifecycle',
    component: () => import('@/views/practice/ComponentLifecycleView.vue'),
    meta: { title: '라이프사이클' },
  },

  /* ---------- 라이브러리 ---------- */
  {
    path: '/library/store',
    name: 'LibraryStore',
    component: () => import('@/views/practice/LibraryStoreView.vue'),
    meta: { title: 'Pinia 스토어' },
  },
  {
    path: '/library/axios',
    name: 'LibraryAxios',
    component: () => import('@/views/practice/LibraryAxiosView.vue'),
    meta: { title: 'Axios 통신' },
  },
  {
    path: '/library/element-plus',
    name: 'LibraryElementPlus',
    component: () => import('@/views/practice/LibraryElementPlusView.vue'),
    meta: { title: 'Element Plus' },
  },
  {
    path: '/library/ecmascript',
    name: 'LibraryEcmaScript',
    component: () => import('@/views/practice/LibraryEcmaScriptView.vue'),
    meta: { title: 'Modern JavaScript' },
  },

  /* ---------- 실습 앱 ---------- */
  {
    path: '/exercise/steps',
    name: 'ExerciseSteps',
    component: () => import('@/views/practice/ExerciseStepsView.vue'),
    meta: { title: '단계별 구현' },
  },
  {
    path: '/weather',
    name: 'WeatherHome',
    component: () => import('@/views/WeatherHomeView.vue'),
    meta: { title: 'Weather 대시보드' },
  },
  // 정적 세그먼트(/weather/about)를 동적 세그먼트(/weather/:cityId)보다 먼저 선언
  {
    path: '/weather/about',
    name: 'WeatherAbout',
    component: () => import('@/views/WeatherAboutView.vue'),
    meta: { title: '앱 소개' },
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
  // 페이지를 옮기면 항상 최상단에서 시작 (뒤로가기는 이전 위치 복원)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

const BASE_TITLE = 'SKALA-VUE : 모던 웹 애플리케이션 개발 실습실'

router.afterEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} · SKALA-VUE` : BASE_TITLE
})

export default router
