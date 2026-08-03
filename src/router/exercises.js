/**
 * 실습 과제 카탈로그
 *
 * 출처: 「Full-stack Engineering - 3.Frontend-framework: Vue.js」 (강병호, 2026.7) 강의 자료의
 * `[실습]` 슬라이드 13장을 그대로 옮긴 것입니다. `page` 는 해당 슬라이드의 PDF 쪽 번호입니다.
 * 요구사항 문구는 원문을 유지하되, 화면에서 읽기 좋도록 줄바꿈만 정리했습니다.
 *
 * links: 이 저장소에서 해당 과제가 실제로 구현된 학습 페이지로 연결합니다.
 *        (구현 페이지가 없는 준비/배포 단계는 빈 배열)
 */
export const exerciseGroups = [
  {
    id: 'setup',
    chapter: '1. Vue.js 시작하기',
    title: '개발 환경 · 프로젝트 준비',
    summary: '코드를 쓰기 전에 실행 환경과 개발 도구를 갖추는 단계입니다.',
    kind: 'setup',
    tasks: [
      {
        page: 36,
        label: '개발환경 구성',
        items: [
          'WSL2 설치 (Windows 사용자 Only)',
          'Ubuntu 설치 (Windows 사용자 Only)',
          'Node.js 설치',
          'VS Code Extension 설치 (Windows 사용자는 WSL도 추가 설치)',
          'Chrome Extension 설치',
        ],
      },
      {
        page: 37,
        label: '프로젝트 생성 및 실행',
        items: [
          'skala-vue 프로젝트 생성',
          'skala-vue 프로젝트 실행',
          'skala-vue 프로젝트 동작 확인 및 Vue Tools 확인',
          'skala-vue 프로젝트 소스 확인',
        ],
      },
      {
        page: 38,
        label: 'HMR 체감 및 Vue Devtools',
        items: [
          'AboutView 의 Template 을 바꿔 HMR 즉시 반영 확인',
          '개발자도구에서 Vue Tab 확인',
          'Components Tab 에서 컴포넌트 부모-자식 관계 확인',
          '단일 컴포넌트를 클릭해 props · routing 확인',
          '브라우저 메모리 상의 변수 값을 즉시 바꿔가며 확인',
        ],
      },
    ],
    links: [],
  },
  {
    id: 'mockup',
    chapter: '2. Vue 문법',
    title: '과제 — 날씨 Mockup',
    summary: '하나의 파일 안에서 템플릿 문법만으로 날씨 대시보드의 뼈대를 만듭니다.',
    kind: 'task',
    tasks: [
      {
        page: 98,
        label: '과제 요구사항',
        items: [
          '배열 렌더링 (v-for) — 날씨 데이터 배열을 반복 출력하고 :key 에 id 바인딩 필수',
          '조건부 렌더링 (v-if) — 25도 이상은 "🔥 더움 (25도 이상)", 미만은 "❄️ 선선함 (25도 미만)" 라벨',
          '양방향 바인딩 및 한글 처리 (:value, @input) — 한글 검색 input 을 만들고 입력한 도시명을 출력',
          '이벤트 및 수식어 — 카드를 누르면 상태바에 "{도시}이 선택되었습니다." 표기',
          '이벤트 및 수식어 — [상세보기] 버튼은 버블링 없이 window.alert 로 날씨 표시',
        ],
      },
    ],
    links: [{ path: '/exercise/steps', label: '단계별 구현 · 1단계 목업' }],
  },
  {
    id: 'composition',
    chapter: '3. Composition API',
    title: '과제 — 날씨 (컴포지션)',
    summary: '같은 화면을 computed · watch · watchEffect 로 다시 정리합니다.',
    kind: 'task',
    tasks: [
      {
        page: 126,
        label: '과제 요구사항',
        items: [
          '반응형 상태 관리 — searchQuery · selectedCityInfo · weatherList 를 반응형 상태로 정의 (1일차 동일)',
          '검색 도시 (computed 활용) — 검색어가 도시 이름에 포함된 항목만 filteredWeatherList 로 필터링',
          'watch 로 selectedCityInfo 감시 — 상태바 문구가 바뀔 때마다 콘솔 로그 작성',
          'watchEffect 로 searchQuery 감시 — 타이핑할 때마다 추적하여 콘솔 로그 작성',
          '검색 결과 표시 — 검색어가 비면 원본, 일치하면 해당 데이터, 없으면 안내 문구 출력',
        ],
      },
    ],
    links: [
      { path: '/exercise/steps', label: '단계별 구현 · 3단계 Composition' },
      { path: '/composition/watchers', label: '감시자' },
    ],
  },
  {
    id: 'component',
    chapter: '4. Vue Component',
    title: '과제 — 날씨 (컴포넌트)',
    summary: '기능 변경 없이 4개의 컴포넌트 파일로 분리합니다.',
    kind: 'task',
    tasks: [
      {
        page: 158,
        label: '과제 요구사항 : 기능 변경없이 4개의 Component 파일로 분리',
        items: [
          'WeatherParent.vue — 모든 반응형 데이터 유지',
          'BaseDashboardCard.vue — 검색박스·리스트박스 디자인을 공통화하고 <slot> 배치',
          'SearchBar.vue — 검색어를 props 로 받아 표시, update-query 이벤트로 부모에 전달 (emits)',
          'WeatherCard.vue — 도시 객체를 props 로 받고, select-card · click-detail 이벤트를 부모에 전달',
          '컴포넌트로 분리하면서 해당 디자인은 <style scoped> 로 각각 분리',
        ],
      },
      {
        page: 158,
        label: '참고',
        items: [
          'Slot 으로 전달되는 자식(SearchBar, WeatherCard)은 시각적으로는 BaseDashboardCard 내부에 있지만 부모 스코프에서 컴파일·평가되므로 WeatherParent 와 직접 바인딩·통신이 가능합니다.',
        ],
      },
    ],
    links: [
      { path: '/exercise/steps', label: '단계별 구현 · 2단계 컴포넌트 분리' },
      { path: '/component/props-emits', label: 'Props & Emits' },
      { path: '/component/slots', label: '슬롯' },
    ],
  },
  {
    id: 'router',
    chapter: '5. Vue Router',
    title: '과제 — Router 활용',
    summary: '한 화면짜리 대시보드를 여러 페이지를 오가는 앱으로 확장합니다.',
    kind: 'task',
    tasks: [
      {
        page: 176,
        label: '과제 요구사항',
        items: [
          'Vue Router 설정 — 라우터 지연 로딩 적용, Catch-all Route 적용',
          'App.vue — Navigation Bar(RouterLink) 추가 및 메인 콘텐츠 영역(RouterView) 배치',
          'WeatherHomeView.vue — WeatherParent 대체, 상세보기에서 alert 대신 router.push("/weather/" + id)',
          'WeatherDetailView.vue — 동적 경로의 cityId 로 Mount 시점에 Mock Data 에서 도시 객체 선택',
          'WeatherAboutView.vue — 소개 내용 작성 및 메인 대시보드로 돌아가기',
        ],
      },
      {
        page: 176,
        label: '프로젝트 폴더 구조',
        items: [
          'router/index.js — 라우트 규칙(routes 배열) 정의 및 Lazy Loading 설정',
          'components/exercise/ — 실습용 부품 컴포넌트 격리 폴더',
          'views/ — WeatherHomeView · WeatherAboutView · WeatherDetailView · NotFoundView',
        ],
      },
    ],
    links: [
      { path: '/weather', label: 'Weather 대시보드' },
      { path: '/weather/about', label: '앱 소개' },
    ],
  },
  {
    id: 'store',
    chapter: '6. Pinia',
    title: '과제 — Store 활용',
    summary: '온도 단위 설정을 전역 스토어로 옮겨 여러 화면이 함께 쓰게 만듭니다.',
    kind: 'task',
    tasks: [
      {
        page: 191,
        label: 'stores/configStore.js 작성',
        items: [
          'state · unit — 단위를 저장하는 변수 (초기값: celsius)',
          'getters · unitSymbol — 현재 단위 상태에 맞는 기호 (℃ / ℉)',
          "actions · toggleUnit — 'celsius' 와 'fahrenheit' 를 토글하는 함수",
        ],
      },
      {
        page: 191,
        label: '과제 요구사항',
        items: [
          'UnitToggler.vue — 대시보드 상단에 배치되어 단위 설정을 변경하는 UI 버튼과 영역',
          'Navigation Bar 옆에 UnitToggler.vue 배치',
          '메인과 상세 날씨에 단위 설정 변경 적용',
          '[참고] 메인/상세의 중복 코드는 Composable 로 해결 가능 (범위 제외)',
        ],
      },
    ],
    links: [{ path: '/library/store', label: 'Pinia 스토어' }],
  },
  {
    id: 'axios',
    chapter: '7. Axios',
    title: '과제 — 날씨 데이터 연동',
    summary: 'Mock 데이터를 실제 OpenWeatherMap API 응답으로 교체합니다.',
    kind: 'task',
    tasks: [
      {
        page: 209,
        label: 'Axios 활용 준비',
        items: ['Axios 라이브러리 설치', 'OpenWeatherMap API 가입 및 Key 발급'],
      },
      {
        page: 209,
        label: '과제 요구사항',
        items: [
          'UnitToggler.vue — 대시보드 상단에 배치되어 단위 설정을 변경하는 UI 버튼과 영역',
          'Navigation Bar 옆에 UnitToggler.vue 배치',
          '메인과 상세 날씨에 단위 설정 변경 적용',
        ],
      },
    ],
    links: [{ path: '/library/axios', label: 'Axios 통신' }],
  },
  {
    id: 'element-plus',
    chapter: '8. UI 라이브러리',
    title: '과제 — Element Plus 활용',
    summary: '직접 만든 UI 를 컴포넌트 라이브러리로 바꿔 봅니다.',
    kind: 'task',
    tasks: [{ page: 228, label: '과제 요구사항', items: ['3일차 과제에 Element Plus 를 자유롭게 적용해 본다.'] }],
    links: [{ path: '/library/element-plus', label: 'Element Plus' }],
  },
  {
    id: 'modern-js',
    chapter: '9. Modern JavaScript',
    title: '과제 — 과제 확장',
    summary: '메뉴와 API 를 덧붙여 앱의 범위를 넓힙니다.',
    kind: 'task',
    tasks: [{ page: 250, label: '과제 요구사항', items: ['메뉴를 추가하고 활용 API 를 추가해서 과제를 확장한다.'] }],
    links: [{ path: '/library/ecmascript', label: 'Modern JavaScript' }],
  },
  {
    id: 'deploy',
    chapter: '10. Vite 빌드 및 실무 배포',
    title: '과제 — 완성',
    summary: '제출 전 점검과 정적 호스팅까지 마무리하는 단계입니다.',
    kind: 'task',
    tasks: [
      {
        page: 274,
        label: '과제 요구사항',
        items: [
          'ESLint 로 점검하여 제출 과제에 Error 가 없도록 한다.',
          'API 키는 환경 변수로 조정하고 Git 에 업로드되지 않도록 한다.',
          'Build 후 정적 파일(dist 폴더)을 GitHub Pages 에 올려 Node.js 없이 호스팅을 제공한다.',
        ],
      },
    ],
    links: [],
  },
]

/** 전체 체크 항목 수 (요약 표시용) */
export const totalExerciseItems = exerciseGroups.reduce(
  (sum, group) => sum + group.tasks.reduce((n, task) => n + task.items.length, 0),
  0,
)
