<script setup>
import { useConfigStore } from '@/stores/configStore'

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})

const config = useConfigStore()

const scrollPageToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
  document.body.scrollTo?.({ top: 0, behavior: 'smooth' })
}

/** 링크·버튼이 아닌 상단바 영역을 탭하면 맨 위로 이동합니다 */
const onAppBarClick = (event) => {
  if (event.target.closest('a, button, .unit-switch')) return
  scrollPageToTop()
}
</script>

<template>
  <div class="weather-app">
    <header class="app-bar" @click="onAppBarClick">
      <RouterLink to="/weather" class="wordmark">
        <span class="wordmark-name">Skyline</span>
        <span class="wordmark-sub">Weather</span>
      </RouterLink>

      <nav class="app-nav" aria-label="완성 앱 메뉴">
        <RouterLink to="/weather" class="nav-pill">대시보드</RouterLink>
        <RouterLink to="/weather/about" class="nav-pill">소개</RouterLink>
      </nav>

      <div class="app-bar-right">
        <div class="unit-switch" role="group" aria-label="온도 단위">
          <button
            type="button"
            class="unit-btn"
            :class="{ on: config.unit === 'celsius' }"
            :aria-pressed="config.unit === 'celsius'"
            @click="config.setUnit('celsius')"
          >
            ℃
          </button>
          <button
            type="button"
            class="unit-btn"
            :class="{ on: config.unit === 'fahrenheit' }"
            :aria-pressed="config.unit === 'fahrenheit'"
            @click="config.setUnit('fahrenheit')"
          >
            ℉
          </button>
        </div>
      </div>
    </header>

    <div class="app-body">
      <div v-if="title" class="app-heading">
        <p v-if="eyebrow" class="app-eyebrow">{{ eyebrow }}</p>
        <h1 class="app-title">{{ title }}</h1>
        <p v-if="description" class="app-desc">{{ description }}</p>
      </div>

      <slot />
    </div>
  </div>
</template>

<style scoped>
.weather-app {
  /* 완성 앱 전용 팔레트 — 실습 워크스페이스의 그레이스케일과 분리된 톤 */
  --w-bg: #0d1017;
  --w-panel: rgba(255, 255, 255, 0.055);
  --w-panel-strong: rgba(255, 255, 255, 0.09);
  --w-border: rgba(255, 255, 255, 0.1);
  --w-border-strong: rgba(255, 255, 255, 0.2);
  --w-text: #f4f6fb;
  --w-muted: rgba(244, 246, 251, 0.6);
  --w-faint: rgba(244, 246, 251, 0.38);
  --w-accent: #8fd0ff;
  --w-warm: #ffc27a;
  --w-radius: 20px;
  --w-pad-x: clamp(16px, 4vw, 28px);
  --w-pad-y: clamp(20px, 3.5vw, 34px);
  --w-bar-pad-y: clamp(12px, 2vw, 18px);

  /* 날씨 아이콘 색 — WeatherIcon / weather-icons.css 가 참조합니다 */
  --w-icon-sun: #ffc27a;
  --w-icon-cloud: #ffffff;
  --w-icon-rain: #5fb0ff;
  --w-icon-bolt: #ffd76a;
  --w-icon-snow: #dff1ff;
  --w-icon-cutout: #0d1017;

  display: flex;
  flex-direction: column;
  min-height: 100%;
  color: var(--w-text);
  background:
    radial-gradient(1000px 520px at 12% -12%, rgba(96, 165, 250, 0.24), transparent 62%),
    radial-gradient(760px 460px at 96% 4%, rgba(255, 176, 102, 0.16), transparent 58%),
    var(--w-bg);
  font-family: 'Plus Jakarta Sans', 'Noto Sans KR', system-ui, sans-serif;
}

.app-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: var(--w-bar-pad-y) var(--w-pad-x);
  border-bottom: 1px solid var(--w-border);
  background: rgba(13, 16, 23, 0.88);
  backdrop-filter: blur(12px);
  cursor: pointer;
}

.wordmark {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  text-decoration: none;
  min-width: 0;
}

.wordmark-name {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--w-text);
}

.wordmark-sub {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--w-faint);
}

.app-nav {
  display: flex;
  gap: 6px;
  margin-left: 12px;
  min-width: 0;
}

.nav-pill {
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--w-muted);
  text-decoration: none;
  border-radius: 999px;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
}

.nav-pill:hover {
  color: var(--w-text);
  background: var(--w-panel);
}

.nav-pill.router-link-exact-active {
  color: #0d1017;
  background: var(--w-text);
}

.app-bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  flex: 0 0 auto;
}

.unit-switch {
  display: inline-flex;
  padding: 3px;
  border: 1px solid var(--w-border);
  border-radius: 999px;
  background: var(--w-panel);
}

.unit-btn {
  min-width: 38px;
  min-height: 32px;
  padding: 5px 10px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--w-muted);
  background: transparent;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
}

.unit-btn:not(:disabled):hover {
  color: var(--w-text);
  background: var(--w-panel-strong);
}

.unit-btn.on {
  color: #0d1017;
  background: var(--w-accent);
}

.app-body {
  flex: 1;
  width: min(940px, 100%);
  margin: 0 auto;
  padding: var(--w-pad-y) var(--w-pad-x) calc(var(--w-pad-y) + 14px);
  box-sizing: border-box;
}

.app-heading {
  margin-bottom: 26px;
}

.app-eyebrow {
  margin: 0 0 8px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--w-accent);
}

.app-title {
  margin: 0;
  font-size: clamp(24px, 5vw, 30px);
  font-weight: 800;
  letter-spacing: -0.035em;
  color: var(--w-text);
}

.app-desc {
  max-width: 620px;
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--w-muted);
}

/* 태블릿·좁은 데스크톱 */
@media (max-width: 900px) {
  .app-bar {
    gap: 12px;
  }

  .app-nav {
    margin-left: 4px;
  }

  .nav-pill {
    padding: 7px 12px;
  }
}

/* 모바일 */
@media (max-width: 720px) {
  .weather-app {
    --w-radius: 16px;
  }

  .wordmark-name {
    font-size: 16px;
  }

  .wordmark-sub {
    font-size: 11px;
  }

  .app-heading {
    margin-bottom: 20px;
  }

  .app-desc {
    font-size: 13.5px;
  }
}

/* 아주 좁은 화면 */
@media (max-width: 380px) {
  .unit-btn {
    min-width: 34px;
    padding: 5px 8px;
    font-size: 12px;
  }

  .nav-pill {
    padding: 7px 10px;
    font-size: 12.5px;
  }
}
</style>
