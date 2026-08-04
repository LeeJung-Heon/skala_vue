<script setup>
import { computed } from 'vue'
import '@/assets/weather-icons.css'

const props = defineProps({
  /** Icon Lab 코드: s2 | s3 | c1 | c2 | c3 | r1 | r2 | r3 | t1 | n1 | w1 | f1 */
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 28,
  },
  label: {
    type: String,
    default: '',
  },
})

const sizePx = computed(() => {
  const n = Number(props.size)
  return Number.isFinite(n) ? `${n}px` : String(props.size)
})
</script>

<template>
  <span
    class="weather-icon"
    :class="`icon-${name}`"
    :style="{ width: sizePx, height: sizePx }"
    role="img"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : true"
  >
    <!-- S2 · 은은한 발광 -->
    <svg v-if="name === 's2'" class="part-sun" viewBox="0 0 48 48">
      <circle class="s2-halo-a" cx="24" cy="24" r="16" fill="currentColor" />
      <circle class="s2-halo-b" cx="24" cy="24" r="12" fill="currentColor" />
      <circle cx="24" cy="24" r="8.5" fill="currentColor" />
    </svg>

    <!-- S3 · 맥동 광선 -->
    <svg v-else-if="name === 's3'" class="part-sun" viewBox="0 0 48 48">
      <g class="s3-rays" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
        <line x1="24" y1="3" x2="24" y2="9" />
        <line x1="24" y1="39" x2="24" y2="45" />
        <line x1="3" y1="24" x2="9" y2="24" />
        <line x1="39" y1="24" x2="45" y2="24" />
        <line x1="9.5" y1="9.5" x2="13.7" y2="13.7" />
        <line x1="34.3" y1="34.3" x2="38.5" y2="38.5" />
        <line x1="9.5" y1="38.5" x2="13.7" y2="34.3" />
        <line x1="34.3" y1="13.7" x2="38.5" y2="9.5" />
      </g>
      <circle class="s3-core" cx="24" cy="24" r="8" fill="currentColor" />
    </svg>

    <!-- C1 · 흘러가는 구름 -->
    <svg v-else-if="name === 'c1'" class="part-cloud" viewBox="0 0 48 48">
      <g class="c1-ghost" fill="currentColor" opacity="0.5">
        <circle cx="17" cy="17" r="4.5" />
        <circle cx="24" cy="15.5" r="6" />
        <rect x="12" y="18" width="17" height="5.5" rx="2.75" />
      </g>
      <g fill="currentColor">
        <circle cx="19" cy="26" r="7" />
        <circle cx="29" cy="24" r="9" />
        <rect x="12" y="27" width="24" height="8" rx="4" />
      </g>
    </svg>

    <!-- C2 · 둥실 떠오르기 -->
    <svg v-else-if="name === 'c2'" class="part-cloud" viewBox="0 0 48 48">
      <g class="c2-cloud" fill="currentColor">
        <circle cx="19" cy="25" r="7" />
        <circle cx="29" cy="23" r="9" />
        <rect x="12" y="26" width="24" height="8" rx="4" />
      </g>
    </svg>

    <!-- C3 · 해 뒤 구름 (발광) -->
    <svg v-else-if="name === 'c3'" viewBox="0 0 48 48">
      <g class="part-sun">
        <circle class="c3-halo-a" cx="30" cy="16" r="12" fill="currentColor" />
        <circle class="c3-halo-b" cx="30" cy="16" r="9" fill="currentColor" />
        <circle cx="30" cy="16" r="6.5" fill="currentColor" />
      </g>
      <g class="c3-cloud part-cloud" fill="currentColor">
        <circle cx="18" cy="28" r="6.5" />
        <circle cx="27" cy="26" r="8.5" />
        <rect x="11.5" y="29" width="24" height="7.5" rx="3.75" />
      </g>
    </svg>

    <!-- R1 · 우산 + 물방울 -->
    <svg v-else-if="name === 'r1'" class="part-rain" viewBox="0 0 48 48">
      <path
        d="M8 26a16 16 0 0 1 32 0q-4-4-8 0-4-4-8 0-4-4-8 0-4-4-8 0z"
        fill="currentColor"
      />
      <path
        d="M24 26v11a5 5 0 0 0 9.5 2"
        fill="none"
        stroke="currentColor"
        stroke-width="2.6"
        stroke-linecap="round"
      />
      <g transform="translate(13 32)">
        <ellipse class="r1-drop-a" rx="1.7" ry="2.4" fill="currentColor" />
      </g>
      <g transform="translate(37 34)">
        <ellipse class="r1-drop-b" rx="1.7" ry="2.4" fill="currentColor" />
      </g>
    </svg>

    <!-- R2 · 비구름 -->
    <svg v-else-if="name === 'r2'" viewBox="0 0 48 48">
      <g class="part-cloud" fill="currentColor">
        <circle cx="19" cy="21" r="6.5" />
        <circle cx="28" cy="19" r="8.5" />
        <rect x="12.5" y="22" width="23" height="7.5" rx="3.75" />
      </g>
      <g class="part-rain" fill="currentColor">
        <g transform="translate(17 33)">
          <ellipse class="r2-drop-a" rx="1.7" ry="2.5" />
        </g>
        <g transform="translate(24 34)">
          <ellipse class="r2-drop-b" rx="1.7" ry="2.5" />
        </g>
        <g transform="translate(31 33)">
          <ellipse class="r2-drop-c" rx="1.7" ry="2.5" />
        </g>
      </g>
    </svg>

    <!-- R3 · 사선 소나기 -->
    <svg v-else-if="name === 'r3'" viewBox="0 0 48 48">
      <g class="part-cloud" fill="currentColor">
        <circle cx="19" cy="19" r="6.5" />
        <circle cx="28" cy="17" r="8.5" />
        <rect x="12.5" y="20" width="23" height="7.5" rx="3.75" />
      </g>
      <g class="part-rain" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
        <g transform="translate(17 28.6)">
          <line class="r3-streak-a" x1="0" y1="0" x2="-1.3" y2="4.2" />
        </g>
        <g transform="translate(24 28.6)">
          <line class="r3-streak-b" x1="0" y1="0" x2="-1.3" y2="4.2" />
        </g>
        <g transform="translate(31 28.6)">
          <line class="r3-streak-c" x1="0" y1="0" x2="-1.3" y2="4.2" />
        </g>
      </g>
      <g transform="translate(24 43)">
        <ellipse
          class="r3-ripple part-rain"
          rx="5"
          ry="1.6"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
        />
      </g>
    </svg>

    <!-- T1 · 번개 -->
    <svg v-else-if="name === 't1'" viewBox="0 0 48 48">
      <g class="part-cloud" fill="currentColor">
        <circle cx="19" cy="20" r="6.5" />
        <circle cx="28" cy="18" r="8.5" />
        <rect x="12.5" y="21" width="23" height="7.5" rx="3.75" />
      </g>
      <path
        class="t1-bolt part-bolt"
        d="M25 30l-5.5 9.5h4.5l-2 6.5 8.5-10.5h-4.5l3-5.5z"
        fill="currentColor"
      />
    </svg>

    <!-- N1 · 눈 -->
    <svg v-else-if="name === 'n1'" viewBox="0 0 48 48">
      <g class="part-cloud" fill="currentColor">
        <circle cx="19" cy="20" r="6.5" />
        <circle cx="28" cy="18" r="8.5" />
        <rect x="12.5" y="21" width="23" height="7.5" rx="3.75" />
      </g>
      <g class="part-snow" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
        <g transform="translate(17 34)">
          <g class="n1-flake-a">
            <line x1="-2.5" y1="0" x2="2.5" y2="0" />
            <line x1="0" y1="-2.5" x2="0" y2="2.5" />
          </g>
        </g>
        <g transform="translate(24 35)">
          <g class="n1-flake-b">
            <line x1="-2.5" y1="0" x2="2.5" y2="0" />
            <line x1="0" y1="-2.5" x2="0" y2="2.5" />
          </g>
        </g>
        <g transform="translate(31 34)">
          <g class="n1-flake-c">
            <line x1="-2.5" y1="0" x2="2.5" y2="0" />
            <line x1="0" y1="-2.5" x2="0" y2="2.5" />
          </g>
        </g>
      </g>
    </svg>

    <!-- W1 · 바람자루 -->
    <svg v-else-if="name === 'w1'" class="part-cloud" viewBox="0 0 48 48">
      <g stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.35">
        <g transform="translate(38 14)">
          <line class="w1-gust-a" x1="-4" y1="0" x2="5" y2="0" />
        </g>
        <g transform="translate(40 30)">
          <line class="w1-gust-b" x1="-3" y1="0" x2="4" y2="0" />
        </g>
      </g>
      <g stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
        <line x1="12" y1="8" x2="12" y2="40" />
        <line x1="7" y1="41.5" x2="17" y2="41.5" />
      </g>
      <circle cx="14" cy="18" r="2.4" fill="none" stroke="currentColor" stroke-width="1.8" />
      <g class="w1-sock">
        <g class="w1-sock-body">
          <path d="M15 12.5 40 16.5 40 19.5 15 23.5z" fill="currentColor" opacity="0.95" />
          <path class="part-cutout" d="M21 13.6 26 14.4 26 21.6 21 22.4z" opacity="0.55" />
          <path class="part-cutout" d="M31 15.2 36 16 36 20 31 20.8z" opacity="0.55" />
          <ellipse cx="15" cy="18" rx="1.4" ry="5.2" fill="currentColor" />
        </g>
      </g>
    </svg>

    <!-- F1 · 안개 -->
    <svg v-else-if="name === 'f1'" class="part-cloud" viewBox="0 0 48 48">
      <g fill="currentColor">
        <circle cx="19" cy="18" r="6" />
        <circle cx="28" cy="16" r="8" />
        <rect x="13" y="19" width="22" height="7" rx="3.5" />
      </g>
      <g stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
        <g transform="translate(24 32)">
          <line class="f1-bar-a" x1="-10" y1="0" x2="10" y2="0" />
        </g>
        <g transform="translate(24 38)">
          <line class="f1-bar-b" x1="-7" y1="0" x2="12" y2="0" />
        </g>
        <g transform="translate(24 44)">
          <line class="f1-bar-c" x1="-11" y1="0" x2="6" y2="0" />
        </g>
      </g>
    </svg>
  </span>
</template>
