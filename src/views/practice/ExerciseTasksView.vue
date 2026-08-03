<script setup>
import { ref, computed, watch } from 'vue'
import PracticePage from '@/components/layout/PracticePage.vue'
import { exerciseGroups, totalExerciseItems } from '@/router/exercises'

const STORAGE_KEY = 'skala-vue:exercise-progress'

/** 체크된 항목의 키 집합 (group.id + task index + item index) */
const checked = ref(loadProgress())

function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    // 스토리지를 못 쓰는 환경(시크릿 모드 등)에서도 페이지는 정상 동작해야 합니다.
    return new Set()
  }
}

watch(
  checked,
  (set) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
    } catch {
      /* 저장 실패는 무시 — 화면 동작에는 영향이 없습니다. */
    }
  },
  { deep: true },
)

const keyOf = (groupId, taskIndex, itemIndex) => `${groupId}:${taskIndex}:${itemIndex}`

const toggle = (key) => {
  const next = new Set(checked.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  checked.value = next
}

const doneCount = computed(() => checked.value.size)
const percent = computed(() => Math.round((doneCount.value / totalExerciseItems) * 100))

/** 그룹별 진행률 — 헤더 우측의 n/m 표기용 */
const groupProgress = (group) => {
  let total = 0
  let done = 0
  group.tasks.forEach((task, taskIndex) => {
    task.items.forEach((_, itemIndex) => {
      total += 1
      if (checked.value.has(keyOf(group.id, taskIndex, itemIndex))) done += 1
    })
  })
  return { total, done }
}

const resetAll = () => {
  checked.value = new Set()
}
</script>

<template>
  <PracticePage
    title="실습 과제 목록"
    description="강의 자료의 [실습] 슬라이드에서 과제 요구사항만 추려 정리했습니다. 항목을 눌러 진행 상황을 체크할 수 있고, 체크 결과는 이 브라우저에 저장됩니다."
  >
    <!-- ---------- 전체 진행률 ---------- -->
    <section class="progress-card">
      <div class="progress-head">
        <div>
          <p class="progress-label">전체 진행률</p>
          <p class="progress-count">
            <strong>{{ doneCount }}</strong> / {{ totalExerciseItems }} 항목
          </p>
        </div>
        <button type="button" class="reset-btn" @click="resetAll" :disabled="doneCount === 0">체크 초기화</button>
      </div>
      <div class="progress-track" role="progressbar" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar" :style="{ width: percent + '%' }"></div>
      </div>
    </section>

    <!-- ---------- 장별 과제 ---------- -->
    <section v-for="group in exerciseGroups" :key="group.id" class="group">
      <header class="group-head">
        <div class="group-title">
          <span class="group-chapter">{{ group.chapter }}</span>
          <h2>{{ group.title }}</h2>
          <p class="group-summary">{{ group.summary }}</p>
        </div>
        <span class="group-count">{{ groupProgress(group).done }} / {{ groupProgress(group).total }}</span>
      </header>

      <div v-for="(task, taskIndex) in group.tasks" :key="taskIndex" class="task">
        <p class="task-label">
          {{ task.label }}
          <span class="task-page">p.{{ task.page }}</span>
        </p>
        <ul class="task-list">
          <li v-for="(item, itemIndex) in task.items" :key="itemIndex">
            <label class="check">
              <input
                type="checkbox"
                :checked="checked.has(keyOf(group.id, taskIndex, itemIndex))"
                @change="toggle(keyOf(group.id, taskIndex, itemIndex))"
              />
              <span>{{ item }}</span>
            </label>
          </li>
        </ul>
      </div>

      <nav v-if="group.links.length" class="group-links" aria-label="관련 학습 페이지">
        <RouterLink v-for="link in group.links" :key="link.path" :to="link.path" class="group-link">
          {{ link.label }}
          <span aria-hidden="true">→</span>
        </RouterLink>
      </nav>
      <p v-else class="group-note">이 단계는 화면이 아니라 환경·배포 작업이라 연결되는 학습 페이지가 없습니다.</p>
    </section>
  </PracticePage>
</template>

<style scoped>
/* ---------- 진행률 ---------- */
.progress-card {
  padding: 18px 20px;
  margin-bottom: 32px;
  background: var(--skala-surface);
  border: 1px solid var(--skala-border);
  border-radius: var(--skala-radius);
  box-shadow: var(--skala-shadow-sm);
}

.progress-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.progress-label {
  margin: 0;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--skala-accent);
}

.progress-count {
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--skala-ink-muted);
}

.progress-count strong {
  font-size: 22px;
  color: var(--skala-ink);
}

.reset-btn {
  margin-left: auto;
  font-size: 12.5px;
}

.progress-track {
  height: 6px;
  border-radius: 999px;
  background: var(--skala-accent-soft);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 999px;
  background: var(--skala-accent);
  transition: width 0.24s ease;
}

/* ---------- 장별 블록 ---------- */
.group {
  padding-top: 28px;
  margin-top: 28px;
  border-top: 1px solid var(--skala-border);
}

.group:first-of-type {
  padding-top: 0;
  margin-top: 0;
  border-top: none;
}

.group-head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.group-chapter {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--skala-accent);
}

.group-title h2 {
  margin: 6px 0 0;
  padding: 0;
  border: none;
  font-size: 20px;
  font-weight: 700;
  color: var(--skala-ink);
}

.group-summary {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.65;
  color: var(--skala-ink-muted);
}

.group-count {
  flex-shrink: 0;
  margin-left: auto;
  padding: 4px 10px;
  border: 1px solid var(--skala-border);
  border-radius: 999px;
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
  color: var(--skala-ink-muted);
}

/* ---------- 과제 항목 ---------- */
.task {
  margin-bottom: 16px;
}

.task-label {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--skala-ink);
}

.task-page {
  font-size: 11px;
  font-weight: 400;
  color: var(--skala-ink-faint);
}

.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--skala-radius-sm);
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--skala-text);
  cursor: pointer;
  transition: background-color 0.14s ease;
}

.check:hover {
  background: var(--skala-surface-muted);
}

.check input {
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  margin: 3px 0 0;
  padding: 0;
  accent-color: var(--skala-accent);
  cursor: pointer;
}

.check input:checked + span {
  color: var(--skala-ink-faint);
  text-decoration: line-through;
}

/* ---------- 관련 페이지 ---------- */
.group-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.group-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 14px;
  border: 1px solid var(--skala-border-strong);
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--skala-ink);
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.group-link:hover {
  background: var(--skala-accent);
  border-color: var(--skala-accent);
  color: #f4f5f8;
}

.group-note {
  margin: 14px 0 0;
  font-size: 12.5px;
  color: var(--skala-ink-faint);
}

@media (max-width: 640px) {
  .group-head {
    flex-wrap: wrap;
  }

  .group-count {
    margin-left: 0;
  }
}
</style>
