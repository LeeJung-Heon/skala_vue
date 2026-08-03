<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { allNavItems } from '@/router/navigation'

defineProps({
  /** 페이지 대제목 */
  title: { type: String, required: true },
  /** 제목 아래 한 줄 설명 */
  description: { type: String, default: '' },
})

const route = useRoute()

const currentIndex = computed(() => allNavItems.findIndex((item) => item.path === route.path))
const current = computed(() => allNavItems[currentIndex.value] ?? null)

/**
 * 카탈로그에 없는 경로(예: /weather/:cityId 상세)도 빵부스러기를 그릴 수 있도록
 * 같은 섹션의 다른 항목에서 섹션 이름을 빌려옵니다.
 */
const crumbSection = computed(() => {
  if (current.value) return current.value.sectionLabel
  const sibling = allNavItems.find(
    (item) => item.path !== '/' && route.path.startsWith(item.path + '/'),
  )
  return sibling ? sibling.sectionLabel : null
})
const prev = computed(() => (currentIndex.value > 0 ? allNavItems[currentIndex.value - 1] : null))
const next = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < allNavItems.length - 1
    ? allNavItems[currentIndex.value + 1]
    : null,
)
</script>

<template>
  <div class="page">
    <header class="page-head">
      <nav class="crumbs" aria-label="위치">
        <RouterLink to="/">홈</RouterLink>
        <template v-if="crumbSection">
          <span aria-hidden="true">/</span>
          <span>{{ crumbSection }}</span>
        </template>
        <span aria-hidden="true">/</span>
        <strong>{{ current ? current.label : title }}</strong>
      </nav>
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="description" class="page-desc">{{ description }}</p>
    </header>

    <div class="page-body practice-container">
      <slot />
    </div>

    <nav v-if="prev || next" class="page-pager" aria-label="이전/다음 학습">
      <RouterLink v-if="prev" :to="prev.path" class="pager-link prev">
        <span class="pager-dir">← 이전</span>
        <span class="pager-label">{{ prev.label }}</span>
      </RouterLink>
      <span v-else></span>
      <RouterLink v-if="next" :to="next.path" class="pager-link next">
        <span class="pager-dir">다음 →</span>
        <span class="pager-label">{{ next.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
/* 사이드바 셸 안에서 랜딩(.hero / .catalog)과 같은 좌우 여백을 쓰도록 맞춥니다.
   읽기 폭은 max-width 로 제한하되 좌측 정렬을 유지해 사이드바와 흐름을 잇습니다. */
.page {
  max-width: 1040px;
  padding: 48px var(--skala-gutter) 72px;
}

/* ---------- 페이지 헤더 ---------- */
.page-head {
  padding: 0 0 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--skala-border);
}

.crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: var(--skala-text-muted);
}

.crumbs a {
  color: var(--skala-text-muted);
  text-decoration: none;
}

.crumbs a:hover {
  color: var(--skala-green-dark);
}

.crumbs strong {
  color: var(--skala-slate);
  font-weight: 600;
}

.page-title {
  margin: 10px 0 0;
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--skala-slate-ink);
}

.page-desc {
  margin: 8px 0 0;
  max-width: 68ch;
  font-size: 14.5px;
  line-height: 1.65;
  color: var(--skala-text-muted);
}

/* ---------- 본문 ---------- */
.page-body {
  display: block;
}

/* 실습 컴포넌트가 공통으로 쓰는 .practice-section 을 카드 톤으로 다듬습니다 */
.page-body :deep(.practice-section) {
  background: var(--skala-surface);
  border: 1px solid var(--skala-border);
  border-radius: var(--skala-radius);
  box-shadow: var(--skala-shadow-sm);
}

.page-body :deep(h1) {
  margin-top: 44px;
}

.page-body :deep(h1:first-child) {
  margin-top: 0;
}

/* ---------- 이전/다음 ---------- */
.page-pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--skala-border);
}

.pager-link {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 16px;
  background: var(--skala-surface);
  border: 1px solid var(--skala-border);
  border-radius: var(--skala-radius);
  text-decoration: none;
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    transform 0.16s ease;
}

.pager-link:hover {
  border-color: var(--skala-green);
  box-shadow: var(--skala-shadow-md);
  transform: translateY(-1px);
}

.pager-link.next {
  text-align: right;
  align-items: flex-end;
}

.pager-dir {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--skala-green-dark);
}

.pager-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--skala-slate-ink);
}

@media (max-width: 640px) {
  .page {
    padding: 28px var(--skala-gutter) 48px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-pager {
    grid-template-columns: 1fr;
  }
}
</style>
