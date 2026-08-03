/**
 * 학습 페이지 카탈로그 (Single Source of Truth)
 * - 사이드바(AppSidebar)와 랜딩 페이지(LandingView)가 동일한 데이터를 공유합니다.
 * - 여기에 항목을 추가하면 사이드바 목차와 홈 칩 목록에 자동으로 반영됩니다.
 */
export const navSections = [
  {
    id: 'basic',
    label: '기초 문법',
    icon: '🧱',
    summary: '템플릿 문법과 디렉티브부터 이벤트, 폼 바인딩까지 Vue의 기본기를 다집니다.',
    items: [
      {
        name: 'BasicIntro',
        path: '/basic/intro',
        label: '시작하기',
        desc: '반응성(ref)의 첫걸음과 템플릿 표현식',
      },
      {
        name: 'BasicDirective',
        path: '/basic/directive',
        label: '디렉티브',
        desc: 'v-text · v-html · v-bind · v-if · v-show · v-for',
      },
      {
        name: 'BasicRender',
        path: '/basic/render',
        label: '렌더링 최적화',
        desc: 'v-once · v-memo · v-pre · v-cloak',
      },
      {
        name: 'BasicEvent',
        path: '/basic/event',
        label: '이벤트 처리',
        desc: 'v-on 기본 · 이벤트 객체 · 이벤트 수식어',
      },
      {
        name: 'BasicModel',
        path: '/basic/model',
        label: '폼 바인딩',
        desc: 'v-model 기본 · 폼 요소 · 수식어',
      },
      {
        name: 'BasicStyle',
        path: '/basic/style',
        label: '스타일링',
        desc: 'scoped 스타일과 외부 CSS 연동',
      },
    ],
  },
  {
    id: 'composition',
    label: 'Composition API',
    icon: '⚡',
    summary: 'ref · reactive · computed · watch 로 상태와 부수효과를 다루는 방법을 익힙니다.',
    items: [
      {
        name: 'CompositionReactivity',
        path: '/composition/reactivity',
        label: '반응형 상태',
        desc: 'ref() 와 reactive() 의 차이',
      },
      {
        name: 'CompositionComputed',
        path: '/composition/computed',
        label: '계산된 속성',
        desc: 'computed 캐싱과 일반 함수의 차이',
      },
      {
        name: 'CompositionWatchers',
        path: '/composition/watchers',
        label: '감시자',
        desc: 'watch · deep · 다중 소스 · watchEffect',
      },
    ],
  },
  {
    id: 'component',
    label: '컴포넌트',
    icon: '🧩',
    summary: '부모-자식 통신, 슬롯을 통한 콘텐츠 주입, 라이프사이클 훅을 실습합니다.',
    items: [
      {
        name: 'ComponentPropsEmits',
        path: '/component/props-emits',
        label: 'Props & Emits',
        desc: '아래로 내리는 props, 위로 올리는 emit',
      },
      {
        name: 'ComponentSlots',
        path: '/component/slots',
        label: '슬롯',
        desc: '기본 슬롯 · 이름있는 슬롯 · 스코프 슬롯',
      },
      {
        name: 'ComponentLifecycle',
        path: '/component/lifecycle',
        label: '라이프사이클',
        desc: 'mounted · updated · unmounted 훅 관찰',
      },
    ],
  },
  {
    id: 'library',
    label: '라이브러리',
    icon: '📦',
    summary: 'Pinia, Axios, Element Plus 그리고 모던 자바스크립트 문법을 다룹니다.',
    items: [
      {
        name: 'LibraryStore',
        path: '/library/store',
        label: 'Pinia 스토어',
        desc: '전역 상태 관리와 스토어 카운터',
      },
      {
        name: 'LibraryAxios',
        path: '/library/axios',
        label: 'Axios 통신',
        desc: '외부 API 호출과 JSON 응답 처리',
      },
      {
        name: 'LibraryElementPlus',
        path: '/library/element-plus',
        label: 'Element Plus',
        desc: 'UI 컴포넌트 라이브러리 활용',
      },
      {
        name: 'LibraryEcmaScript',
        path: '/library/ecmascript',
        label: 'Modern JavaScript',
        desc: '구조 분해 · 스프레드 · 옵셔널 체이닝',
      },
    ],
  },
  {
    id: 'app',
    label: '실습 앱',
    icon: '🌤️',
    summary: '배운 내용을 모아 만든 날씨 대시보드 미니 애플리케이션입니다.',
    items: [
      {
        name: 'WeatherHome',
        path: '/weather',
        label: 'Weather 대시보드',
        desc: '라우터 · 스토어 · Axios 종합 실습',
      },
      {
        name: 'ExerciseSteps',
        path: '/exercise/steps',
        label: '단계별 구현',
        desc: 'Mockup → 컴포넌트 분리 → Composition',
      },
      {
        name: 'WeatherAbout',
        path: '/weather/about',
        label: '앱 소개',
        desc: '프로젝트 개요 페이지',
      },
    ],
  },
]

/** 평탄화된 전체 학습 페이지 목록 (검색·카운트용) */
export const allNavItems = navSections.flatMap((section) =>
  section.items.map((item) => ({ ...item, sectionId: section.id, sectionLabel: section.label })),
)
