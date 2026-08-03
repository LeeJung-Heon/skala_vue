<script setup>
import { computed } from 'vue'
import { navSections } from '@/router/navigation'

const sections = computed(() =>
  navSections.map((section, index) => ({
    ...section,
    num: String(index + 1).padStart(2, '0'),
  })),
)
</script>

<template>
  <div class="landing">
    <!-- ---------- Hero ---------- -->
    <section class="hero">
      <p class="hero-eyebrow">SKALA · 모던 웹 애플리케이션 개발</p>
      <h1 class="hero-title">
        Vue 3 실습실에<br />
        오신 것을 <em>환영합니다</em>
      </h1>
      <p class="hero-lead">
        템플릿 문법부터 Composition API, 컴포넌트 설계, 그리고 Pinia · Axios · Element Plus 연동까지.
        왼쪽 목차에서 학습할 주제를 골라 바로 실행되는 예제를 확인하세요.
      </p>
      <div class="hero-actions">
        <RouterLink to="/basic/intro" class="cta primary">학습 시작하기</RouterLink>
        <RouterLink to="/weather" class="cta ghost">완성 앱 둘러보기</RouterLink>
      </div>
    </section>

    <!-- ---------- 섹션별 목차 ---------- -->
    <section class="catalog">
      <div v-for="section in sections" :key="section.id" :id="'sec-' + section.id" class="section-row">
        <span class="section-num">{{ section.num }}</span>
        <div class="section-meta">
          <h2>{{ section.label }}</h2>
          <p>{{ section.summary }}</p>
        </div>
        <div class="chip-row">
          <RouterLink v-for="item in section.items" :key="item.path" :to="item.path" class="chip">
            {{ item.label }}
            <span class="chip-desc">{{ item.desc }}</span>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ---------- Hero ---------- */
.hero {
  padding: 88px 72px 64px;
}

.hero-eyebrow {
  margin: 0;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--skala-accent);
}

.hero-title {
  margin: 26px 0 0;
  padding: 0;
  border: none;
  font-family: var(--skala-font-sans);
  font-size: 62px;
  font-weight: 600;
  line-height: 1.24;
  letter-spacing: -0.015em;
  color: var(--skala-ink);
  text-wrap: pretty;
}

.hero-title em {
  font-style: italic;
  color: var(--skala-accent);
}

.hero-lead {
  margin: 30px 0 0;
  max-width: 56ch;
  font-size: 15px;
  line-height: 1.85;
  color: rgba(22, 24, 29, 0.66);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 38px;
}

.cta {
  display: inline-flex;
  align-items: center;
  height: 46px;
  padding: 0 26px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease;
}

.cta.primary {
  background: var(--skala-ink);
  color: #f4f5f8;
}

.cta.primary:hover {
  background: var(--skala-accent);
  color: #f4f5f8;
}

.cta.ghost {
  border: 1px solid rgba(22, 24, 29, 0.3);
  color: var(--skala-ink);
}

.cta.ghost:hover {
  border-color: var(--skala-accent);
  color: var(--skala-accent);
}

/* ---------- 섹션 행 ---------- */
.catalog {
  padding: 0 72px 80px;
}

.section-row {
  display: grid;
  grid-template-columns: 72px 264px 1fr;
  gap: 28px;
  padding: 34px 0;
  border-top: 1px solid rgba(22, 24, 29, 0.16);
  align-items: start;
  scroll-margin-top: 24px;
}

.section-num {
  font-family: var(--skala-font-serif);
  font-size: 28px;
  font-style: italic;
  line-height: 1;
  color: rgba(22, 24, 29, 0.35);
}

.section-meta h2 {
  margin: 0;
  padding: 0;
  border: none;
  font-family: var(--skala-font-sans);
  font-size: 22px;
  font-weight: 700;
  color: var(--skala-ink);
}

.section-meta p {
  margin: 8px 0 0;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--skala-ink-muted);
  text-wrap: pretty;
}

/* ---------- 칩 ---------- */
.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-content: flex-start;
}

.chip {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 16px;
  border: 1px solid rgba(22, 24, 29, 0.28);
  border-radius: 999px;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;
  color: var(--skala-ink);
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.chip:hover,
.chip.router-link-active {
  background: var(--skala-accent);
  border-color: var(--skala-accent);
  color: #f4f5f8;
}

.chip-desc {
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid rgba(22, 24, 29, 0.18);
  font-size: 11px;
  font-weight: 400;
  color: var(--skala-ink-muted);
}

.chip:hover .chip-desc,
.chip.router-link-active .chip-desc {
  border-left-color: rgba(244, 245, 248, 0.4);
  color: rgba(244, 245, 248, 0.8);
}

/* ---------- 반응형 ---------- */
@media (max-width: 1100px) {
  .section-row {
    grid-template-columns: 48px 1fr;
  }

  .chip-row {
    grid-column: 2;
  }
}

@media (max-width: 900px) {
  .hero {
    padding: 48px 16px 40px;
  }

  .hero-title {
    font-size: 40px;
  }

  .catalog {
    padding: 0 16px 56px;
  }

  .chip-desc {
    display: none;
  }
}
</style>
