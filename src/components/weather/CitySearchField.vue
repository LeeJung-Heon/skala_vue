<script setup>
/**
 * — 날씨 (컴포넌트) / SearchBar 역할
 * - 검색어·결과 관련 값을 props 로 수신
 * - update-query · add-suggestion · select-existing 를 emits
 * - 스타일은 <style scoped>
 *
 * — 날씨 Mockup / 양방향 바인딩·한글 처리
 * - 한글 IME 조합 중에는 input value 를 덮어쓰지 않음 (composition* 이벤트)
 * - @input 으로 부모에 검색어 전달
 */
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  currentQuery: { type: String, default: '' },
  resultCount: { type: Number, default: 0 },
  suggestions: { type: Array, default: () => [] },
  searching: { type: Boolean, default: false },
  adding: { type: Boolean, default: false },
  addError: { type: String, default: '' },
})

const emit = defineEmits(['update-query', 'add-suggestion', 'select-existing'])

const inputEl = ref(null)
const composing = ref(false)

const setInputValue = (value) => {
  if (inputEl.value && inputEl.value.value !== value) {
    inputEl.value.value = value
  }
}

onMounted(() => {
  setInputValue(props.currentQuery)
})

// 부모에서 지움/외부 동기화할 때만 DOM 값을 맞춤
// 조합(IME) 중에는 절대 value 를 덮어쓰지 않음
watch(
  () => props.currentQuery,
  (value) => {
    if (composing.value) return
    setInputValue(value)
  },
)

const emitQuery = (value) => {
  emit('update-query', value)
}

const onCompositionStart = () => {
  composing.value = true
}

const onCompositionUpdate = (event) => {
  // 목록 필터용으로만 올리고, input value 바인딩은 건드리지 않음
  emitQuery(event.target.value)
}

const onCompositionEnd = (event) => {
  composing.value = false
  emitQuery(event.target.value)
}

const onInput = (event) => {
  // 조합 중 input 이벤트도 필터 갱신만 수행 (value 재지정 없음)
  emitQuery(event.target.value)
}

const clearQuery = () => {
  composing.value = false
  setInputValue('')
  emitQuery('')
}

const onSelectSuggestion = (item) => {
  if (item.kind === 'local') {
    emit('select-existing', item.cityId)
    return
  }
  emit('add-suggestion', item.location)
}
</script>

<template>
  <div class="search">
    <div class="field">
      <span class="field-icon" aria-hidden="true">⌕</span>
      <!--
        한글 IME: :value 제어 컴포넌트는 조합 중 리렌더 시 글자를 지움 
        DOM value 는 비제어로 두고, 외부 동기화만 watch 로 처리함
      -->
      <input
        ref="inputEl"
        class="field-input"
        type="search"
        placeholder="도시 검색 (예: 서울, 도쿄, Paris)"
        autocomplete="off"
        @compositionstart="onCompositionStart"
        @compositionupdate="onCompositionUpdate"
        @compositionend="onCompositionEnd"
        @input="onInput"
      />
      <span class="field-count">{{ resultCount }}곳</span>
      <button
        v-if="currentQuery"
        type="button"
        class="field-clear"
        aria-label="검색어 지우기"
        @click="clearQuery"
      >
        ✕
      </button>
    </div>

    <div
      v-if="currentQuery.trim().length >= 1"
      class="suggest"
      role="listbox"
      aria-label="도시 검색 결과"
    >
      <p v-if="searching && !suggestions.length" class="suggest-status">위치 검색 중…</p>

      <template v-else-if="suggestions.length">
        <p v-if="searching" class="suggest-status subtle">추가 후보 갱신 중…</p>
        <ul class="suggest-list">
          <li v-for="item in suggestions" :key="item.id">
            <button
              type="button"
              class="suggest-item"
              :disabled="adding || (item.kind === 'remote' && item.alreadyAdded)"
              @click="onSelectSuggestion(item)"
            >
              <span class="suggest-main">
                <strong>{{ item.label }}</strong>
                <small>{{ item.region }}</small>
              </span>
              <span class="suggest-action" :class="item.kind">
                <template v-if="item.kind === 'local'">선택</template>
                <template v-else>
                  {{ item.alreadyAdded ? '추가됨' : adding ? '추가 중…' : '추가' }}
                </template>
              </span>
            </button>
          </li>
        </ul>
      </template>

      <p v-else class="suggest-status">
        {{ addError || '일치하는 도시를 찾지 못했습니다. 철자나 영문명을 확인해 보세요.' }}
      </p>

      <p v-if="addError && suggestions.length" class="suggest-error">{{ addError }}</p>
    </div>
  </div>
</template>

<style scoped>
.search {
  position: relative;
  flex: 1;
  max-width: 420px;
  margin-left: auto;
}

.field {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 50px;
  padding: 0 14px;
  border: 1px solid var(--w-border);
  border-radius: 999px;
  background: var(--w-panel);
}

.field:focus-within {
  border-color: var(--w-accent);
}

.field-icon {
  font-size: 16px;
  color: var(--w-text);
}

.field-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  /* iOS는 16px 미만 input 포커스 시 자동 확대하므로 이 값을 유지 */
  font-size: 16px;
  font-family: inherit;
  color: var(--w-text);
  background: transparent;
  border: 0;
  outline: none;
  box-shadow: none;
}

.field-input::placeholder {
  color: var(--w-muted);
}

.field-input:focus {
  border: 0;
  box-shadow: none;
}

.field-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--w-faint);
}

.field-clear {
  padding: 4px 8px;
  font-size: 11px;
  color: var(--w-muted);
  background: transparent;
  border: 1px solid var(--w-border);
  border-radius: 999px;
  cursor: pointer;
}

.field-clear:not(:disabled):hover {
  color: var(--w-text);
  background: var(--w-panel-strong);
  border-color: var(--w-border-strong);
}

.suggest {
  position: absolute;
  z-index: 40;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: min(320px, 50vh);
  overflow-y: auto;
  padding: 8px;
  border: 1px solid var(--w-border);
  border-radius: 18px;
  background: #141820;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
}

.suggest-status {
  margin: 0;
  padding: 12px 10px;
  font-size: 12.5px;
  color: var(--w-muted);
}

.suggest-status.subtle {
  padding: 4px 10px 8px;
  font-size: 11.5px;
  color: var(--w-faint);
}

.suggest-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.suggest-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  color: var(--w-text);
  background: transparent;
  border: 0;
  border-radius: 12px;
  cursor: pointer;
}

.suggest-item:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.06);
}

.suggest-item:disabled {
  opacity: 0.55;
  cursor: default;
}

.suggest-main {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.suggest-main strong {
  font-size: 13.5px;
  font-weight: 700;
}

.suggest-main small {
  font-size: 11.5px;
  color: var(--w-faint);
}

.suggest-action {
  flex: none;
  padding: 5px 10px;
  font-size: 11.5px;
  font-weight: 700;
  color: #0d1017;
  background: var(--w-accent);
  border-radius: 999px;
}

.suggest-action.local {
  color: var(--w-text);
  background: rgba(255, 255, 255, 0.12);
}

.suggest-item:disabled .suggest-action {
  color: var(--w-muted);
  background: rgba(255, 255, 255, 0.08);
}

.suggest-error {
  margin: 6px 8px 2px;
  font-size: 12px;
  color: #f0a8a8;
}
</style>
