<script setup>
/**
 * — 날씨 (컴포넌트) / WeatherCard 역할
 * - 도시 객체를 props(city) 로 수신
 * - select · detail · remove 이벤트를 부모(WeatherHomeView)에 전달
 * - 스타일은 <style scoped> 로 분리
 *
 * — 날씨 Mockup
 * - 카드 클릭 → 선택 (select)
 * - [상세보기] 는 @click.stop 으로 버블링 차단 후 detail emit
 *   (초기 과제의 alert 는 Router 단계에서 router.push 로 대체됨)
 * - 기온 구간 라벨(조건부 표현) — comfortOf 칩
 *
 * — Store 활용
 * - configStore.toDisplayTemp / unitSymbol 로 단위 환산 표시
 */
import { useConfigStore } from '@/stores/configStore'
import WeatherIcon from '@/components/weather/WeatherIcon.vue'

defineProps({
  city: { type: Object, required: true },
  active: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'detail', 'remove'])

const config = useConfigStore()

// — 날씨 Mockup / 조건부 렌더링(기온 구간 라벨) — 완성 앱에서는 4단계로 확장
const comfortOf = (celsius) => {
  if (celsius < 10) return { key: 'cold', label: '추움' }
  if (celsius < 20) return { key: 'cool', label: '선선함' }
  if (celsius < 30) return { key: 'mild', label: '따뜻함' }
  return { key: 'hot', label: '더움' }
}
</script>

<template>
  <!-- [실습] 카드 클릭 → select (초기: 상태바 문구 / 완성: 선택 도시 갱신) -->
  <article class="tile" :class="{ active }" @click="emit('select', city)">
    <header class="tile-head">
      <div>
        <h3 class="tile-name">{{ city.name }}</h3>
        <p class="tile-region">{{ city.region }}</p>
      </div>
      <WeatherIcon class="tile-icon" :name="city.icon" :size="28" :label="city.status" />
    </header>

    <p class="tile-temp">
      {{ config.toDisplayTemp(city.temp) }}<span>{{ config.unitSymbol }}</span>
    </p>

    <p class="tile-range">
      {{ city.status }} · 최고 {{ config.toDisplayTemp(city.high) }}° / 최저
      {{ config.toDisplayTemp(city.low) }}°
    </p>

    <footer class="tile-foot">
      <span class="tile-chip" :class="comfortOf(city.temp).key">
        {{ comfortOf(city.temp).label }}
      </span>
      <div class="tile-actions">
        <button type="button" class="tile-remove" @click.stop="emit('remove', city.id)">
          삭제
        </button>
        <!-- [실습] 이벤트 수식어 .stop — 상세보기 클릭이 카드 select 로 버블링되지 않게 -->
        <button type="button" class="tile-link" @click.stop="emit('detail', city.id)">
          상세보기 →
        </button>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 18px 18px 16px;
  border: 1px solid var(--w-border);
  border-radius: 18px;
  background: var(--w-panel);
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    transform 0.16s ease;
}

.tile:hover {
  border-color: var(--w-border-strong);
  background: var(--w-panel-strong);
  transform: translateY(-2px);
}

.tile.active {
  border-color: var(--w-accent);
  box-shadow: 0 0 0 1px var(--w-accent) inset;
}

.tile-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.tile-name {
  margin: 0;
  font-size: 15.5px;
  font-weight: 700;
  color: var(--w-text);
  border: 0;
  padding: 0;
}

.tile-region {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--w-faint);
}

.tile-icon {
  margin-top: 2px;
  flex: 0 0 auto;
}

.tile-temp {
  margin: 16px 0 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--w-text);
}

.tile-temp span {
  margin-left: 2px;
  font-size: 16px;
  font-weight: 600;
  color: var(--w-muted);
}

.tile-range {
  margin: 8px 0 0;
  font-size: 12.5px;
  color: var(--w-muted);
}

.tile-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  gap: 8px;
  min-width: 0;
}

.tile-chip {
  padding: 4px 10px;
  font-size: 11.5px;
  font-weight: 700;
  border-radius: 999px;
  white-space: nowrap;
}

.tile-chip.cold {
  color: #cfe6ff;
  background: rgba(110, 178, 245, 0.16);
}

.tile-chip.cool {
  color: #ffe9a8;
  background: rgba(255, 224, 130, 0.16);
}

.tile-chip.mild {
  color: #ffd2b0;
  background: rgba(255, 158, 92, 0.16);
}

.tile-chip.hot {
  color: #ffc0c0;
  background: rgba(255, 96, 96, 0.16);
}

.tile-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.tile-remove {
  padding: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--w-faint);
  background: transparent;
  border: 0;
  cursor: pointer;
  white-space: nowrap;
}

.tile-remove:not(:disabled):hover {
  color: #f0a8a8;
  background: transparent;
  border: 0;
}

.tile-link {
  padding: 0;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--w-accent);
  background: transparent;
  border: 0;
  cursor: pointer;
  white-space: nowrap;
}

.tile-link:not(:disabled):hover {
  color: var(--w-text);
  background: transparent;
  border: 0;
}

/* 좁은 화면: 구성은 유지하고 크기만 비율로 축소 */
@media (max-width: 720px) {
  .tile {
    padding: 14px 14px 12px;
    border-radius: 14px;
  }

  .tile-head {
    gap: 8px;
  }

  .tile-name {
    font-size: 13.5px;
  }

  .tile-region {
    font-size: 11px;
  }

  .tile-temp {
    margin-top: 12px;
    font-size: 28px;
  }

  .tile-temp span {
    font-size: 14px;
  }

  .tile-range {
    font-size: 11.5px;
  }

  .tile-foot {
    margin-top: 12px;
  }

  .tile-chip {
    padding: 3px 8px;
    font-size: 10.5px;
  }

  .tile-actions {
    gap: 8px;
  }

  .tile-remove {
    font-size: 11px;
  }

  .tile-link {
    font-size: 11.5px;
  }
}
</style>
