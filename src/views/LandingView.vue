<script setup>
import { navSections, allNavItems } from '@/router/navigation'

const totalPages = allNavItems.length
</script>

<template>
  <div class="landing">
    <!-- ---------- Hero ---------- -->
    <section class="hero">
      <div class="hero-inner">
        <p class="hero-eyebrow">SKALA · 모던 웹 애플리케이션 개발</p>
        <h1 class="hero-title">
          Vue 3 실습실에<br />
          오신 것을 <span>환영합니다</span>
        </h1>
        <p class="hero-lead">
          템플릿 문법부터 Composition API, 컴포넌트 설계, 그리고 Pinia · Axios · Element Plus 연동까지.
          상단 네비게이션에서 학습할 주제를 골라 바로 실행되는 예제를 확인하세요.
        </p>
        <div class="hero-actions">
          <RouterLink to="/basic/intro" class="cta primary">학습 시작하기</RouterLink>
          <RouterLink to="/weather" class="cta ghost">완성 앱 둘러보기</RouterLink>
        </div>
        <dl class="hero-stats">
          <div>
            <dt>학습 페이지</dt>
            <dd>{{ totalPages }}</dd>
          </div>
          <div>
            <dt>주제 영역</dt>
            <dd>{{ navSections.length }}</dd>
          </div>
          <div>
            <dt>Vue 버전</dt>
            <dd>3.5</dd>
          </div>
        </dl>
      </div>
    </section>

    <!-- ---------- 주제별 카드 ---------- -->
    <section class="catalog">
      <header class="catalog-head">
        <h2>학습 목차</h2>
        <p>각 항목은 독립 실행되는 실습 컴포넌트로 구성되어 있습니다.</p>
      </header>

      <div class="card-grid">
        <article v-for="section in navSections" :key="section.id" class="card">
          <div class="card-head">
            <span class="card-icon" aria-hidden="true">{{ section.icon }}</span>
            <div>
              <h3>{{ section.label }}</h3>
              <p class="card-summary">{{ section.summary }}</p>
            </div>
          </div>
          <ul class="card-list">
            <li v-for="item in section.items" :key="item.path">
              <RouterLink :to="item.path">
                <span class="item-label">{{ item.label }}</span>
                <span class="item-desc">{{ item.desc }}</span>
                <span class="item-arrow" aria-hidden="true">→</span>
              </RouterLink>
            </li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing {
  padding-bottom: 72px;
}

/* ---------- Hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a252f 0%, #35495e 62%, #2f5d54 100%);
  color: #ffffff;
}

.hero::after {
  content: '';
  position: absolute;
  top: -140px;
  right: -120px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(66, 184, 131, 0.34) 0%, rgba(66, 184, 131, 0) 68%);
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 72px 20px 64px;
}

.hero-eyebrow {
  margin: 0 0 14px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--skala-green);
}

.hero-title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.22;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.hero-title span {
  color: var(--skala-green);
}

.hero-lead {
  margin: 18px 0 0;
  max-width: 60ch;
  font-size: 15px;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.76);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.cta {
  display: inline-flex;
  align-items: center;
  height: 42px;
  padding: 0 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    transform 0.16s ease;
}

.cta.primary {
  background: var(--skala-green);
  color: #10241b;
}

.cta.primary:hover {
  background: #4fcb92;
  transform: translateY(-1px);
}

.cta.ghost {
  background: transparent;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.cta.ghost:hover {
  border-color: var(--skala-green);
  color: var(--skala-green);
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 36px;
  margin: 44px 0 0;
  padding-top: 26px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.hero-stats dt {
  font-size: 11.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.52);
}

.hero-stats dd {
  margin: 4px 0 0;
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
}

/* ---------- 카탈로그 ---------- */
.catalog {
  max-width: 1000px;
  margin: 0 auto;
  padding: 56px 20px 0;
}

.catalog-head h2 {
  margin: 0;
  padding: 0;
  border: none;
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--skala-slate-ink);
}

.catalog-head p {
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--skala-text-muted);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(288px, 1fr));
  align-items: start; /* 카드가 행 높이에 맞춰 늘어나지 않도록 */
  gap: 18px;
  margin-top: 26px;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--skala-surface);
  border: 1px solid var(--skala-border);
  border-radius: 14px;
  box-shadow: var(--skala-shadow-sm);
  transition:
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.card:hover {
  box-shadow: var(--skala-shadow-md);
  transform: translateY(-2px);
}

.card-head {
  display: flex;
  gap: 12px;
  padding-bottom: 14px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--skala-border);
}

.card-icon {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: var(--skala-green-soft);
  font-size: 18px;
}

.card-head h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--skala-slate-ink);
}

.card-summary {
  margin: 4px 0 0;
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--skala-text-muted);
}

.card-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.card-list a {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 2px 10px;
  padding: 9px 10px;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.14s ease;
}

.card-list a:hover {
  background: var(--skala-green-soft);
}

.item-label {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--skala-slate);
}

.item-desc {
  grid-column: 1;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--skala-text-muted);
}

.item-arrow {
  grid-row: 1 / span 2;
  grid-column: 2;
  font-size: 14px;
  color: var(--skala-green);
  opacity: 0;
  transform: translateX(-4px);
  transition:
    opacity 0.14s ease,
    transform 0.14s ease;
}

.card-list a:hover .item-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 640px) {
  .hero-inner {
    padding: 48px 16px 44px;
  }

  .hero-stats {
    gap: 24px;
  }

  .catalog {
    padding: 40px 16px 0;
  }
}
</style>
