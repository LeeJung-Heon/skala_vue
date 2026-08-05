<script setup>
/**
 * — Router 활용 / CityMapView
 * - 동적 경로 `/weather/:cityId/map` 으로 진입해 해당 도시를 3D 지도에 표시
 * - Google Maps JS API `maps3d` 라이브러리의 Map3DElement · Marker3DElement 사용
 *
 * Map3DElement 는 커스텀 엘리먼트라 템플릿에 직접 쓰지 않고,
 * 컨테이너 ref 에 스크립트로 생성·append
 */
import { ref, shallowRef, computed, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import WeatherAppShell from '@/components/weather/WeatherAppShell.vue'
import { useWeatherStore } from '@/stores/weatherStore'
import { loadMaps3d, hasMapsApiKey } from '@/utils/googleMaps'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()

const mapHost = ref(null)
const place = ref(null)
const isLoading = ref(true)
const loadError = ref(null)

// 내 위치 (Geolocation API)
const myLocation = ref(null)
const locating = ref(false)
const locateError = ref('')

// 지도 인스턴스는 반응형으로 감쌀 필요가 없음(무거운 DOM 객체).
const mapEl = shallowRef(null)

/** 도시 좌표는 스토어의 로드된 도시 → 메타 순으로 찾음*/
const resolvePlace = async (cityId) => {
  const loaded = weatherStore.findCity(cityId)
  if (loaded) return loaded

  const meta = weatherStore.resolveMeta(cityId)
  if (meta) return meta

  // 새로고침으로 바로 들어온 경우 목록을 한 번 채운 뒤 다시 찾음
  if (!weatherStore.isReady) await weatherStore.fetchAll()
  return weatherStore.findCity(cityId) ?? weatherStore.resolveMeta(cityId)
}

const destroyMap = () => {
  mapEl.value?.remove()
  mapEl.value = null
}

/** 마커 위에 항상 떠 있는 말풍선 내용(제목 + 부제)을 만듬 */
const buildLabelContent = ({ title, subtitle, accent }) => {
  const wrap = document.createElement('div')
  wrap.style.cssText = 'padding:2px 4px;text-align:center;white-space:nowrap;color:#f4f6fb'

  const name = document.createElement('strong')
  name.textContent = title
  name.style.cssText = `display:block;font-size:14px;font-weight:700${accent ? `;color:${accent}` : ''}`

  const region = document.createElement('span')
  region.textContent = subtitle ?? ''
  region.style.cssText = 'display:block;margin-top:2px;font-size:11px;opacity:0.66'

  wrap.append(name, region)
  return wrap
}

/**
 * 라벨(Popover)이 붙은 3D 마커를 지도에 추가
 * Marker3DElement 의 label 속성은 3D 지도에서 텍스트로 그려지지 않아
 * 마커에 고정한 Popover 로 이름을 표시
 */
const appendLabeledMarker = (map, lib, { position, title, subtitle, accent }) => {
  const { Marker3DInteractiveElement, PopoverElement } = lib

  const marker = new Marker3DInteractiveElement({
    position: { ...position, altitude: 300 },
    altitudeMode: 'ABSOLUTE',
    extruded: true,
    label: title,
  })

  const popover = new PopoverElement({
    open: true,
    positionAnchor: marker,
    lightDismissDisabled: true,
  })
  popover.append(buildLabelContent({ title, subtitle, accent }))

  map.append(marker, popover)
  return marker
}

const MY_LOCATION_ACCENT = '#8fd0ff'

/** 지도에 내 위치 마커를 올림(지도 재생성 시에도 다시 호출) */
const appendMyLocationMarker = (map, lib) => {
  if (!myLocation.value) return
  appendLabeledMarker(map, lib, {
    position: { lat: myLocation.value.lat, lng: myLocation.value.lng },
    title: '내 위치',
    subtitle: `±${Math.round(myLocation.value.accuracy)}m`,
    accent: MY_LOCATION_ACCENT,
  })
}

const renderMap = async (target) => {
  const lib = await loadMaps3d()
  const { Map3DElement } = lib

  // 로딩 중에 다른 도시로 이동했다면 렌더링을 버림
  if (place.value?.id !== target.id || !mapHost.value) return

  destroyMap()

  const position = { lat: Number(target.lat), lng: Number(target.lon) }

  const map = new Map3DElement({
    center: { ...position, altitude: 120 },
    range: 1800,
    tilt: 67.5,
    mode: 'HYBRID',
  })
  map.style.width = '100%'
  map.style.height = '100%'

  appendLabeledMarker(map, lib, {
    position,
    title: target.name,
    subtitle: target.region,
  })
  appendMyLocationMarker(map, lib)

  mapHost.value.append(map)
  mapEl.value = map
}

/** 두 좌표 사이 거리(km) — Haversine */
const distanceKm = (a, b) => {
  const R = 6371
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

const distanceLabel = computed(() => {
  if (!myLocation.value || !place.value) return ''
  const km = distanceKm(myLocation.value, {
    lat: Number(place.value.lat),
    lng: Number(place.value.lon),
  })
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
})

/** 카메라를 특정 좌표로 부드럽게 이동 */
const flyTo = (position, range = 1800) => {
  mapEl.value?.flyCameraTo({
    endCamera: {
      center: { ...position, altitude: 120 },
      range,
      tilt: 67.5,
      heading: 0,
    },
    durationMillis: 2000,
  })
}

/** — Geolocation API 로 현재 위치를 지도에 표시 */
const locateMe = () => {
  if (myLocation.value) {
    // 이미 찾았다면 카메라만 내 위치로 이동
    flyTo(myLocation.value)
    return
  }

  if (!navigator.geolocation) {
    locateError.value = '이 브라우저는 위치 확인을 지원하지 않습니다.'
    return
  }

  locating.value = true
  locateError.value = ''

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      myLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      }
      locating.value = false

      if (mapEl.value) {
        appendMyLocationMarker(mapEl.value, await loadMaps3d())
        flyTo(myLocation.value)
      }
    },
    (error) => {
      locating.value = false
      locateError.value =
        error.code === error.PERMISSION_DENIED
          ? '위치 권한이 거부되었습니다. 브라우저 설정에서 허용해 주세요.'
          : '현재 위치를 확인하지 못했습니다.'
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
  )
}

/** 카메라를 다시 도시 위치로 되돌림 */
const focusCity = () => {
  if (!place.value) return
  flyTo({ lat: Number(place.value.lat), lng: Number(place.value.lon) })
}

const load = async (cityId) => {
  isLoading.value = true
  loadError.value = null
  destroyMap()

  try {
    const found = await resolvePlace(cityId)

    if (!found || found.lat == null || found.lon == null) {
      place.value = null
      loadError.value = '해당 도시의 위치 정보를 찾을 수 없습니다.'
      return
    }

    place.value = found

    if (!hasMapsApiKey()) {
      loadError.value =
        'Google Maps API 키가 설정되지 않았습니다. .env 에 VITE_GOOGLE_MAPS_API_KEY 를 추가하세요.'
      return
    }

    await renderMap(found)
  } catch (error) {
    console.error('3D 지도 로드 실패:', error)
    loadError.value = error?.message || '지도를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

// cityId 변경 시(마운트 포함) 지도 갱신
watch(
  () => route.params.cityId,
  (cityId) => {
    load(cityId)
  },
  { immediate: true },
)

onBeforeUnmount(destroyMap)

const goBack = () => {
  router.push({ name: 'WeatherHome' })
}

const goDetail = () => {
  router.push(`/weather/${route.params.cityId}`)
}
</script>

<template>
  <WeatherAppShell>
    <button type="button" class="back" @click="goBack">← 대시보드</button>

    <section class="map-head">
      <div class="map-identity">
        <p class="map-label">위치 보기</p>
        <h1 class="map-city">{{ place?.name ?? '도시' }}</h1>
        <p class="map-region">{{ place?.region ?? '위치 정보를 확인하는 중입니다…' }}</p>
      </div>

      <div class="map-actions">
        <p v-if="place" class="map-coords">
          {{ Number(place.lat).toFixed(4) }}, {{ Number(place.lon).toFixed(4) }}
        </p>
        <button v-if="place" type="button" class="map-detail" @click="goDetail">
          상세 관측 정보
        </button>
      </div>
    </section>

    <!-- [실습] 과제 확장 — Geolocation: 내 위치 확인 · 도시로 되돌리기 -->
    <section v-if="place && !loadError" class="locate-bar">
      <button type="button" class="locate-btn" :disabled="locating" @click="locateMe">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.8" />
          <circle cx="12" cy="12" r="2.4" fill="currentColor" />
          <path
            d="M12 2v3M12 19v3M2 12h3M19 12h3"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
        {{ locating ? '위치 확인 중…' : myLocation ? '내 위치로 이동' : '내 위치 확인' }}
      </button>

      <button v-if="myLocation" type="button" class="locate-back" @click="focusCity">
        {{ place.name }}(으)로 이동
      </button>

      <p v-if="myLocation" class="locate-info">
        {{ place.name }}까지 약 <strong>{{ distanceLabel }}</strong>
        <span class="locate-coords">
          · {{ myLocation.lat.toFixed(4) }}, {{ myLocation.lng.toFixed(4) }}
        </span>
      </p>
      <p v-else-if="locateError" class="locate-info locate-error">{{ locateError }}</p>
    </section>

    <section class="map-frame">
      <div ref="mapHost" class="map-host"></div>

      <p v-if="isLoading" class="map-state">3D 지도를 불러오는 중입니다…</p>
      <p v-else-if="loadError" class="map-state map-state-error">{{ loadError }}</p>
    </section>
  </WeatherAppShell>
</template>

<style scoped>
.back {
  margin-bottom: 20px;
  padding: 8px 14px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--w-muted);
  background: var(--w-panel);
  border: 1px solid var(--w-border);
  border-radius: 999px;
  cursor: pointer;
}

.back:not(:disabled):hover {
  color: var(--w-text);
  background: var(--w-panel-strong);
  border-color: var(--w-border-strong);
}

.map-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
  padding: 22px 24px;
  border: 1px solid var(--w-border);
  border-radius: var(--w-radius);
  background: var(--w-panel);
}

.map-identity {
  min-width: 0;
}

.map-label {
  margin: 0 0 6px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--w-accent);
}

.map-city {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: var(--w-text);
}

.map-region {
  margin: 6px 0 0;
  font-size: 13.5px;
  color: var(--w-muted);
}

.map-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 0 0 auto;
}

.map-coords {
  margin: 0;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--w-faint);
}

.map-detail {
  padding: 9px 15px;
  font-size: 12.5px;
  font-weight: 700;
  color: #0d1017;
  background: var(--w-text);
  border: 1px solid var(--w-text);
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}

.map-detail:not(:disabled):hover {
  background: var(--w-accent);
  border-color: var(--w-accent);
}

.locate-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 12px;
  margin-bottom: 18px;
}

.locate-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 15px;
  font-size: 12.5px;
  font-weight: 700;
  color: #0d1017;
  background: var(--w-accent);
  border: 1px solid var(--w-accent);
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}

.locate-btn svg {
  width: 16px;
  height: 16px;
}

.locate-btn:disabled {
  opacity: 0.6;
  cursor: progress;
}

.locate-back {
  padding: 9px 15px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--w-muted);
  background: var(--w-panel);
  border: 1px solid var(--w-border);
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}

.locate-back:not(:disabled):hover {
  color: var(--w-text);
  background: var(--w-panel-strong);
  border-color: var(--w-border-strong);
}

.locate-info {
  margin: 0;
  font-size: 12.5px;
  color: var(--w-muted);
}

.locate-info strong {
  color: var(--w-text);
}

.locate-coords {
  font-variant-numeric: tabular-nums;
  color: var(--w-faint);
}

.locate-error {
  color: #f0a8a8;
}

.map-frame {
  position: relative;
  overflow: hidden;
  height: clamp(360px, 62vh, 620px);
  border: 1px solid var(--w-border);
  border-radius: var(--w-radius);
  background: rgba(255, 255, 255, 0.03);
}

.map-host {
  width: 100%;
  height: 100%;
}

.map-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 24px;
  text-align: center;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--w-muted);
  background: rgba(13, 16, 23, 0.72);
}

.map-state-error {
  color: #f0a8a8;
}

@media (max-width: 720px) {
  .map-head {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    padding: 18px 16px;
  }

  .map-city {
    font-size: 21px;
  }

  .map-region {
    font-size: 12px;
  }

  .map-actions {
    justify-content: space-between;
  }

  .locate-bar {
    gap: 8px 10px;
  }

  .locate-btn,
  .locate-back {
    flex: 1 1 auto;
    justify-content: center;
    padding: 8px 12px;
    font-size: 11.5px;
  }

  .locate-info {
    flex: 1 0 100%;
    font-size: 11.5px;
  }

  .map-frame {
    height: clamp(320px, 56vh, 480px);
  }
}
</style>
