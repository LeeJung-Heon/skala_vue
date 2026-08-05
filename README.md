# Skyline Weather

OpenWeatherMap API를 연동한 Vue 3 날씨 대시보드
검색·필터·상세 이동·단위 전환·도시 추가/삭제를 하나의 제품 UI로 구성

## 기능

- 도시 목록 대시보드 (현재 기온, 습도·풍속·강수, 시간대별 기온)
- 검색어로 목록 필터 + Geocoding으로 원격 도시 추가
- 상세 관측 화면 (`/weather/:cityId`) 및 소개 화면
- ℃ / ℉ 전역 단위 전환 (Pinia)
- 로딩·에러·재시도 UI
- GitHub Pages 배포 (`base` + Hash History)

## 기술 스택

| 구분 | 사용 |
|------|------|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Build | Vite 8 |
| Routing | Vue Router 5 (Hash History) |
| State | Pinia 3 |
| HTTP | Axios |
| API | OpenWeatherMap (Geocoding · Current · 5-day Forecast) |
| Deploy | GitHub Pages Actions |

> UI는 Element Plus 등 라이브러리 대신 커스텀 CSS로 구성

## 과제 역할 ↔ 실제 파일 매핑

| 과제에서 요구한 역할 | 실제 구현 |
|----------------------|-----------|
| WeatherParent | `src/views/WeatherHomeView.vue` |
| BaseDashboardCard (셸·레이아웃) | `src/components/weather/WeatherAppShell.vue` |
| SearchBar | `src/components/weather/CitySearchField.vue` |
| WeatherCard | `src/components/weather/CityTile.vue` |
| 전역 상태 | `src/stores/weatherStore.js`, `src/stores/configStore.js` |
| API 모듈 | `src/api/openWeather.js` |

## 폴더 구조

```text
src/
  api/              # Axios OpenWeather 호출
  components/weather/
  data/             # 기본 도시·아이콘 카탈로그
  router/
  stores/           # weather · config
  utils/            # API 매핑 · 기온 구간 · 도시 메타
  views/            # Home · Detail · About · Map · NotFound
```

## 시작하기

```sh
cp .env.example .env
# .env 에 VITE_OPENWEATHER_API_KEY 입력
# (지도 페이지를 쓸 경우 VITE_GOOGLE_MAPS_API_KEY 도 입력)

npm install
npm run dev
```

로컬 개발 서버는 `http://localhost:PORT_NUM` 에서 실행됩니다.

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 (`dist/`) |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint · Oxlint |
| `npm run format` | Prettier |

## 환경 변수

| 변수 | 용도 |
|------|------|
| `VITE_OPENWEATHER_API_KEY` | OpenWeatherMap API 키 (필수) |
| `VITE_GOOGLE_MAPS_API_KEY` | 3D 지도 페이지용 (선택) |

`.env`는 커밋하지 않습니다. GitHub Actions에서는 Secrets로 빌드 시 주입

## 라우트

| 경로 | 화면 |
|------|------|
| `/` | `/weather` 로 리다이렉트 |
| `/weather` | 대시보드 |
| `/weather/about` | 소개 |
| `/weather/:cityId` | 도시 상세 |
| `/weather/:cityId/map` | 지도 |
| 그 외 | Not Found |

정적 호스팅에서도 경로가 깨지지 않도록 `createWebHashHistory()` 를 사용
실제 URL 예: `https://<user>.github.io/skala_vue/#/weather`

## 배포 (GitHub Pages)

1. 저장소 Settings → Pages → Source를 **GitHub Actions** 로 설정
2. Settings → Secrets and variables → Actions 에 아래 Secret 등록
   - `VITE_OPENWEATHER_API_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY` (지도 사용 시)
3. `main` 브랜치에 푸시하면 `.github/workflows/deploy-pages.yml` 이 빌드·배포

빌드 시 `GITHUB_ACTIONS=true` 이면 Vite `base` 가 `/skala_vue/` 로 설정
저장소/Pages 경로 이름과 `vite.config.js` 의 `base` 가 다르면 **흰 화면**이 나올 수 있음

## 코드 리뷰(self)

- **단일 책임:** 검색은 `CitySearchField`, 카드는 `CityTile`, 레이아웃·단위 전환은 `WeatherAppShell`, 데이터·API는 스토어와 뷰가 담당.
- **반응형 남용:** 검색어·도시 목록·선택 ID처럼 실제로 바뀌는 값만 `ref`/`computed`로 두고, 기온 구간 판별 같은 순수 로직은 일반 함수로 구성.
- **로딩·에러 처리:** 홈에서 초기 로딩 문구와 에러+재시도를 보여 주고, 검색·도시 추가 실패는 `searchError`/`addError`로 사용자에게 알림.
- **네이밍:** `listedCities`, `handleDetailJump`, `fetchAll`, `toDisplayTemp`처럼 이름만 보고 역할을 알 수 있도록 함.
