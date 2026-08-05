# Skyline Weather

OpenWeatherMap 기반 Vue 3 날씨 앱입니다.

## 시작하기

```sh
cp .env.example .env
# .env 에 VITE_OPENWEATHER_API_KEY 입력

npm install
npm run dev
```

## 스크립트

- `npm run dev` — 로컬 개발 서버
- `npm run build` — 프로덕션 빌드
- `npm run preview` — 빌드 결과 미리보기
- `npm run lint` — [실습] 과제 — 완성 / ESLint·Oxlint 점검

## 배포

GitHub Pages 워크플로(`.github/workflows/deploy-pages.yml`)가 `main` 푸시 시 빌드합니다.  
Actions Secret에 `VITE_OPENWEATHER_API_KEY` , `VITE_GOOGLE_MAPS_API_KEY`를 등록해 주세요.
