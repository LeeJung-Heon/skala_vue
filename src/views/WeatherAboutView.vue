<script setup>
/**
 * [실습] 과제 — Router 활용 / WeatherAboutView
 * - 앱 소개 내용 작성
 * - 메인 대시보드로 돌아가기 (router.push WeatherHome)
 */
import { useRouter } from 'vue-router'
import WeatherAppShell from '@/components/weather/WeatherAppShell.vue'
import WeatherIcon from '@/components/weather/WeatherIcon.vue'
import { weatherIconCatalog } from '@/data/weatherCities'

const router = useRouter()

const stack = [
  {
    title: '컴포넌트 분리',
    body: 'components/weather/ 의 셸 · 검색 · 카드 · WeatherIcon 부품을 조합해 화면을 구성합니다.',
  },
  {
    title: '클라이언트 라우팅',
    body: 'Vue Router 로 대시보드 · 상세 · 소개 화면을 새로고침 없이 전환하고, :cityId 파라미터로 상세 데이터를 찾습니다.',
  },
  {
    title: '쿼리 스트링 동기화',
    body: '검색어를 ?search= 로 주소창에 반영해, 링크를 공유하면 같은 검색 상태로 열립니다.',
  },
  {
    title: '전역 상태(Pinia)',
    body: '헤더의 ℃ / ℉ 스위치는 configStore 의 단위 상태를 바꾸고, 모든 화면의 기온 표기가 함께 환산됩니다.',
  },
  {
    title: 'OpenWeather API',
    body: 'Geocoding · Current Weather · 5일 예보 API로 실시간 기온·습도·풍속·시간대별 예보를 가져와 weatherStore 에 담습니다.',
  },
]

const handleGoHome = () => {
  // [실습] 메인 대시보드로 돌아가기
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <WeatherAppShell
    eyebrow="About"
    title="Skyline Weather"
    description="Vue 3 실습 과제를 하나의 제품 형태로 마감한 날씨 대시보드입니다. 실습 워크스페이스와는 별개의 디자인 언어를 사용합니다."
  >
    <div class="stack-grid">
      <article v-for="item in stack" :key="item.title" class="stack-card">
        <h2 class="stack-title">{{ item.title }}</h2>
        <p class="stack-body">{{ item.body }}</p>
      </article>
    </div>

    <section class="icon-gallery" aria-labelledby="icon-gallery-title">
      <header class="gallery-head">
        <h2 id="icon-gallery-title" class="stack-title">움직이는 날씨 아이콘</h2>
        <p class="stack-body">
          Icon Lab에서 확정한 13종을 <code>WeatherIcon</code> 으로 저장해 대시보드·상세에 사용합니다.
        </p>
      </header>
      <ul class="gallery-grid">
        <li v-for="item in weatherIconCatalog" :key="item.name">
          <WeatherIcon :name="item.name" :size="36" :label="item.label" />
          <span class="gallery-code">{{ item.name.toUpperCase() }}</span>
          <span class="gallery-label">{{ item.label }}</span>
        </li>
      </ul>
    </section>

    <button type="button" class="home-btn" @click="handleGoHome">대시보드로 이동</button>
  </WeatherAppShell>
</template>

<style scoped>
.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 14px;
}

.stack-card {
  padding: 20px 22px;
  border: 1px solid var(--w-border);
  border-radius: 18px;
  background: var(--w-panel);
}

.stack-title {
  margin: 0 0 10px;
  padding: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--w-text);
  border: 0;
}

.stack-body {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--w-muted);
}

.stack-body code {
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--w-panel-strong);
  color: var(--w-accent);
  font-size: 12px;
}

.icon-gallery {
  margin-top: 22px;
  padding: 22px 24px;
  border: 1px solid var(--w-border);
  border-radius: var(--w-radius);
  background: var(--w-panel);
}

.gallery-head {
  margin-bottom: 18px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.gallery-grid li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 10px;
  border: 1px solid var(--w-border);
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.18);
  text-align: center;
}

.gallery-code {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--w-accent);
}

.gallery-label {
  font-size: 11.5px;
  color: var(--w-muted);
}

.home-btn {
  margin-top: 22px;
  padding: 11px 20px;
  font-size: 13px;
  font-weight: 700;
  color: #0d1017;
  background: var(--w-text);
  border: 1px solid var(--w-text);
  border-radius: 999px;
  cursor: pointer;
}

.home-btn:not(:disabled):hover {
  color: #0d1017;
  background: var(--w-accent);
  border-color: var(--w-accent);
}

@media (max-width: 560px) {
  .stack-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .stack-card {
    padding: 16px 16px;
  }

  .stack-title {
    margin-bottom: 8px;
    font-size: 14px;
  }

  .stack-body {
    font-size: 12.5px;
    line-height: 1.6;
  }

  .icon-gallery {
    padding: 18px 14px;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    gap: 8px;
  }

  .gallery-grid li {
    padding: 12px 8px;
  }

  .gallery-label {
    font-size: 10.5px;
    line-height: 1.3;
  }

  .home-btn {
    width: 100%;
  }
}
</style>
