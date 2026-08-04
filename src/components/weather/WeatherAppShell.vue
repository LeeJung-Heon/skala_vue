<script setup>
import { useConfigStore } from '@/stores/configStore'

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})

const config = useConfigStore()
</script>

<template>
  <div class="weather-app">
    <header class="app-bar">
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

  /* 날씨 아이콘 색 — WeatherIcon / weather-icons.css 가 참조합니다 */
  --w-icon-sun: #ffc27a;
  --w-icon-cloud: #ffffff;
  --w-icon-rain: #5fb0ff;
  --w-icon-bolt: #ffd76a;
  --w-icon-snow: #dff1ff;
  --w-icon-cutout: #0d1017;

  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: var(--w-text);
  background:
    radial-gradient(1000px 520px at 12% -12%, rgba(96, 165, 250, 0.24), transparent 62%),
    radial-gradient(760px 460px at 96% 4%, rgba(255, 176, 102, 0.16), transparent 58%),
    var(--w-bg);
  font-family: 'Plus Jakarta Sans', 'Noto Sans KR', system-ui, sans-serif;
}

.app-bar {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px 28px;
  border-bottom: 1px solid var(--w-border);
  backdrop-filter: blur(6px);
}

.wordmark {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  text-decoration: none;
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
  padding: 34px 28px 48px;
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
  font-size: 30px;
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

@media (max-width: 900px) {
  .weather-app {
    min-height: 100vh;
  }

  .app-bar {
    flex-wrap: wrap;
    gap: 12px;
    padding: 14px 18px;
  }

  .app-nav {
    margin-left: 0;
  }

  .app-body {
    padding: 24px 18px 40px;
  }

  .app-title {
    font-size: 25px;
  }
}
</style>
