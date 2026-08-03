<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { navSections, allNavItems } from '@/router/navigation'

const route = useRoute()
const router = useRouter()

/** 모바일에서 목차 펼침 여부 */
const mobileOpen = ref(false)

const totalPages = allNavItems.length

const sections = computed(() =>
  navSections.map((section, index) => ({
    ...section,
    num: String(index + 1).padStart(2, '0'),
    count: String(section.items.length).padStart(2, '0'),
  })),
)

/** 현재 경로가 속한 섹션 → 사이드바에 활성 표시 */
const activeSectionId = computed(() => {
  const found = navSections.find((section) =>
    section.items.some((item) => route.path === item.path || route.path.startsWith(item.path + '/')),
  )
  return found ? found.id : null
})

const isHome = computed(() => route.path === '/')

/** 홈에서는 해당 섹션으로 스크롤, 다른 페이지에서는 홈으로 이동 후 스크롤 */
const goToSection = async (id) => {
  mobileOpen.value = false
  if (!isHome.value) await router.push('/')
  await nextTick()
  const el = document.getElementById('sec-' + id)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: 'smooth' })
}

watch(() => route.fullPath, () => (mobileOpen.value = false))
</script>

<template>
  <aside class="app-sidebar">
    <div class="sidebar-inner">
      <div class="sidebar-head">
        <RouterLink to="/" class="brand">SKALA<em>—VUE</em></RouterLink>
        <p class="brand-sub">Vue 3 실습실</p>

        <button
          class="sidebar-toggle"
          type="button"
          :aria-expanded="mobileOpen"
          aria-label="목차 열기"
          @click="mobileOpen = !mobileOpen"
        >
          목차
        </button>
      </div>

      <nav :class="['sidebar-nav', { open: mobileOpen }]" aria-label="학습 목차">
        <RouterLink to="/" class="nav-item" :class="{ current: isHome }">
          <span class="nav-num">00</span>
          <span class="nav-label">홈</span>
        </RouterLink>

        <button
          v-for="section in sections"
          :key="section.id"
          type="button"
          class="nav-item"
          :class="{ active: activeSectionId === section.id }"
          @click="goToSection(section.id)"
        >
          <span class="nav-num">{{ section.num }}</span>
          <span class="nav-label">{{ section.label }}</span>
          <span class="nav-count">{{ section.count }}</span>
        </button>
      </nav>

      <div class="sidebar-foot">
        <p>학습 페이지 {{ totalPages }} · 주제 영역 {{ navSections.length }}<br />Vue 3.5 + Vite</p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  width: var(--skala-sidebar-width);
  flex-shrink: 0;
  border-right: 1px solid var(--skala-border);
  box-sizing: border-box;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 36px 28px 28px;
  box-sizing: border-box;
}

/* ---------- 브랜드 ---------- */
.brand {
  font-family: var(--skala-font-sans);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1.2;
  color: var(--skala-ink);
  text-decoration: none;
}

.brand em {
  font-style: italic;
  color: var(--skala-accent);
}

.brand-sub {
  margin: 6px 0 0;
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(22, 24, 29, 0.45);
}

.sidebar-toggle {
  display: none;
}

/* ---------- 목차 ---------- */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  margin: 44px -10px 0;
  padding: 0 10px;
}

.nav-item {
  display: flex;
  align-items: baseline;
  gap: 12px;
  width: 100%;
  padding: 11px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--skala-ink-soft);
  font-family: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.14s ease,
    color 0.14s ease;
}

.nav-item:hover {
  background: rgba(22, 24, 29, 0.06);
  color: var(--skala-ink);
}

.nav-item:focus-visible {
  outline: 2px solid var(--skala-accent);
  outline-offset: 2px;
}

.nav-item.current {
  background: var(--skala-ink);
  color: #f4f5f8;
}

.nav-item.current .nav-num {
  color: rgba(244, 245, 248, 0.5);
}

.nav-item.active {
  background: var(--skala-accent-soft);
  color: var(--skala-ink);
  box-shadow: inset 2px 0 0 var(--skala-accent);
}

.nav-num {
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--skala-accent);
}

.nav-label {
  font-size: 13.5px;
  font-weight: 600;
}

.nav-count {
  margin-left: auto;
  font-size: 10.5px;
  color: var(--skala-ink-faint);
}

/* ---------- 하단 ---------- */
.sidebar-foot {
  margin-top: auto;
  padding-top: 28px;
  border-top: 1px solid var(--skala-border);
}

.sidebar-foot p {
  margin: 0;
  font-size: 11px;
  line-height: 1.6;
  color: var(--skala-ink-muted);
}

/* ---------- 모바일: 상단 바로 전환 ---------- */
@media (max-width: 900px) {
  .app-sidebar {
    position: sticky;
    top: 0;
    z-index: 100;
    height: auto;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--skala-border);
    background: var(--skala-page-bg);
  }

  .sidebar-inner {
    height: auto;
    padding: 14px 16px;
  }

  .sidebar-head {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .brand-sub {
    display: none;
  }

  .sidebar-toggle {
    display: inline-flex;
    align-items: center;
    height: 34px;
    margin-left: auto;
    padding: 0 14px;
    border: 1px solid var(--skala-border);
    border-radius: 999px;
    background: transparent;
    color: var(--skala-ink);
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
  }

  .sidebar-nav {
    display: none;
    margin: 12px 0 0;
    padding: 0;
  }

  .sidebar-nav.open {
    display: flex;
  }

  .sidebar-foot {
    display: none;
  }
}
</style>
