<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { navSections } from '@/router/navigation'

const route = useRoute()

/** 현재 열려 있는 드롭다운의 섹션 id (null 이면 모두 닫힘) */
const openSection = ref(null)
/** 모바일 햄버거 메뉴 펼침 여부 */
const mobileOpen = ref(false)
/** 외부 클릭 감지를 위한 네비게이션 루트 엘리먼트 */
const navRoot = ref(null)

/** 현재 경로가 속한 섹션 → 상위 메뉴에 활성 표시 */
const activeSectionId = computed(() => {
  const found = navSections.find((section) =>
    section.items.some((item) => route.path === item.path || route.path.startsWith(item.path + '/')),
  )
  return found ? found.id : null
})

const toggleSection = (id) => {
  openSection.value = openSection.value === id ? null : id
}

const closeAll = () => {
  openSection.value = null
  mobileOpen.value = false
}

const onDocumentClick = (event) => {
  if (navRoot.value && !navRoot.value.contains(event.target)) closeAll()
}

const onKeydown = (event) => {
  if (event.key === 'Escape') closeAll()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})

// 페이지 이동이 끝나면 열려 있던 메뉴를 정리
watch(() => route.fullPath, closeAll)
</script>

<template>
  <header class="app-navbar" ref="navRoot">
    <div class="nav-inner">
      <!-- 브랜드 -->
      <RouterLink to="/" class="nav-brand">
        <span class="brand-mark">V</span>
        <span class="brand-text">
          <strong>SKALA</strong><em>VUE</em>
        </span>
      </RouterLink>

      <!-- 모바일 토글 -->
      <button
        class="nav-burger"
        type="button"
        :aria-expanded="mobileOpen"
        aria-label="메뉴 열기"
        @click="mobileOpen = !mobileOpen"
      >
        <span :class="['burger-bar', { open: mobileOpen }]"></span>
      </button>

      <!-- 메뉴 -->
      <nav :class="['nav-menu', { open: mobileOpen }]" aria-label="학습 페이지">
        <RouterLink to="/" class="nav-link" :class="{ active: route.path === '/' }">홈</RouterLink>

        <div v-for="section in navSections" :key="section.id" class="nav-group">
          <button
            type="button"
            class="nav-trigger"
            :class="{ active: activeSectionId === section.id, expanded: openSection === section.id }"
            :aria-expanded="openSection === section.id"
            @click.stop="toggleSection(section.id)"
          >
            <span class="trigger-icon" aria-hidden="true">{{ section.icon }}</span>
            {{ section.label }}
            <svg class="chevron" viewBox="0 0 12 8" aria-hidden="true">
              <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </button>

          <transition name="drop">
            <div v-show="openSection === section.id" class="nav-dropdown">
              <p class="dropdown-summary">{{ section.summary }}</p>
              <RouterLink
                v-for="item in section.items"
                :key="item.path"
                :to="item.path"
                class="dropdown-item"
              >
                <span class="dropdown-label">{{ item.label }}</span>
                <span class="dropdown-desc">{{ item.desc }}</span>
              </RouterLink>
            </div>
          </transition>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(100deg, #1a252f 0%, #35495e 100%);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.06), 0 4px 18px rgba(20, 30, 40, 0.22);
}

.nav-inner {
  /* 히어로 · 페이지 본문 · 푸터와 동일한 1000px 콘텐츠 컬럼에 정렬 */
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  height: var(--skala-nav-height);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ---------- 브랜드 ---------- */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 20px;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-mark {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: var(--skala-green);
  color: #10241b;
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
}

.brand-text {
  display: flex;
  align-items: baseline;
  gap: 5px;
  font-size: 15px;
  letter-spacing: 0.04em;
}

.brand-text strong {
  color: #ffffff;
  font-weight: 700;
}

.brand-text em {
  color: var(--skala-green);
  font-style: normal;
  font-weight: 600;
}

/* ---------- 메뉴 ---------- */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
}

.nav-link,
.nav-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.76);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    color 0.16s ease;
}

.nav-link:hover,
.nav-trigger:hover {
  background: rgba(255, 255, 255, 0.09);
  color: #ffffff;
}

.nav-link.active,
.nav-trigger.active {
  color: #ffffff;
  background: rgba(66, 184, 131, 0.18);
  box-shadow: inset 0 0 0 1px rgba(66, 184, 131, 0.42);
}

.nav-trigger:focus-visible,
.nav-link:focus-visible,
.nav-burger:focus-visible {
  outline: 2px solid var(--skala-green);
  outline-offset: 2px;
}

.trigger-icon {
  font-size: 13px;
}

.chevron {
  width: 9px;
  height: 6px;
  margin-left: 1px;
  transition: transform 0.18s ease;
}

.nav-trigger.expanded .chevron {
  transform: rotate(180deg);
}

/* ---------- 드롭다운 ---------- */
.nav-group {
  position: relative;
}

.nav-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 306px;
  padding: 8px;
  background: var(--skala-surface);
  border: 1px solid var(--skala-border);
  border-radius: 12px;
  box-shadow: var(--skala-shadow-lg);
}

.dropdown-summary {
  margin: 0 0 6px;
  padding: 8px 10px 10px;
  border-bottom: 1px solid var(--skala-border);
  color: var(--skala-text-muted);
  font-size: 12px;
  line-height: 1.5;
}

.dropdown-item {
  display: block;
  padding: 8px 10px;
  border-radius: 8px;
  color: var(--skala-text);
  text-decoration: none;
  transition: background-color 0.14s ease;
}

.dropdown-item:hover {
  background: var(--skala-green-soft);
}

.dropdown-item.router-link-active {
  background: var(--skala-green-soft);
  box-shadow: inset 2px 0 0 var(--skala-green);
}

.dropdown-label {
  display: block;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--skala-slate-ink);
}

.dropdown-desc {
  display: block;
  margin-top: 2px;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--skala-text-muted);
}

.drop-enter-active,
.drop-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ---------- 모바일 ---------- */
.nav-burger {
  display: none;
  width: 38px;
  height: 34px;
  margin-left: auto;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  position: relative;
  transition: background-color 0.16s ease;
}

/* practice.css 의 전역 button:hover(회색) 가 어두운 네비게이션을 덮지 않도록 재정의 */
.nav-burger:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: transparent;
}

.burger-bar,
.burger-bar::before,
.burger-bar::after {
  position: absolute;
  left: 50%;
  width: 17px;
  height: 2px;
  margin-left: -8.5px;
  border-radius: 2px;
  background: #ffffff;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.burger-bar {
  top: 50%;
  margin-top: -1px;
}

.burger-bar::before,
.burger-bar::after {
  content: '';
  left: 0;
  margin-left: 0;
}

.burger-bar::before {
  top: -6px;
}

.burger-bar::after {
  top: 6px;
}

.burger-bar.open {
  background: transparent;
}

.burger-bar.open::before {
  transform: translateY(6px) rotate(45deg);
}

.burger-bar.open::after {
  transform: translateY(-6px) rotate(-45deg);
}

@media (max-width: 900px) {
  .nav-burger {
    display: block;
  }

  .nav-menu {
    display: none;
    position: absolute;
    top: var(--skala-nav-height);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    max-height: calc(100vh - var(--skala-nav-height));
    overflow-y: auto;
    padding: 12px 16px 20px;
    background: #1f2c3a;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: var(--skala-shadow-lg);
  }

  .nav-menu.open {
    display: flex;
  }

  .nav-link,
  .nav-trigger {
    width: 100%;
    height: 40px;
    justify-content: flex-start;
  }

  .nav-trigger .chevron {
    margin-left: auto;
  }

  .nav-dropdown {
    position: static;
    width: 100%;
    margin: 4px 0 8px;
    box-shadow: none;
  }
}
</style>
