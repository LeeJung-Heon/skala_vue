/**
 * 날씨 데이터 연동 / Mock → OpenWeather 응답으로 교체한 도시 목록 스토어
 * 도시 검색·추가·삭제 등 API·상태 확장
 */
import { defineStore } from 'pinia'
import { fetchCityWeatherBundle, getCoordinates, getReverseGeocoding } from '@/api/openWeather'
import { weatherCityDirectory, findCityMeta } from '@/data/weatherCities'
import { mapCityFromOpenWeather } from '@/utils/mapOpenWeather'
import {
  displayCityName,
  displayRegion,
  expandSearchQueries,
  metaFromLocation,
  rankAndDedupeLocations,
  samePlace,
} from '@/utils/cityMeta'

const CUSTOM_STORAGE_KEY = 'skyline-weather-custom-cities'
const REMOVED_STORAGE_KEY = 'skyline-weather-removed-cities'
const MY_LOCATION_STORAGE_KEY = 'skyline-weather-my-location'

/** 내 위치 도시는 고정 id 를 씁니다 (상세·지도 라우트에서 그대로 사용) */
export const MY_LOCATION_ID = 'my_location'

const loadJsonObject = (key) => {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

const loadJsonArray = (key) => {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const persistJsonArray = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const SELECTED_STORAGE_KEY = 'skyline-weather-selected-city'

const loadSelectedCityId = () => {
  try {
    return localStorage.getItem(SELECTED_STORAGE_KEY) || 'city_01'
  } catch {
    return 'city_01'
  }
}

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    cities: [],
    customMetas: loadJsonArray(CUSTOM_STORAGE_KEY),
    removedIds: loadJsonArray(REMOVED_STORAGE_KEY),
    selectedCityId: loadSelectedCityId(),
    status: 'idle', // idle | loading | ready | error
    error: null,
    lastFetchedAt: null,
    adding: false,
    addError: null,
    // 과제 확장 / 내 위치 — Geolocation + Reverse Geocoding
    myLocationMeta: loadJsonObject(MY_LOCATION_STORAGE_KEY),
    locating: false,
    locateError: null,
  }),

  getters: {
    isLoading: (state) => state.status === 'loading',
    isReady: (state) => state.status === 'ready' && state.cities.length > 0,
    findCity: (state) => (id) => state.cities.find((city) => city.id === id) ?? null,
    selectedCity: (state) =>
      state.cities.find((city) => city.id === state.selectedCityId) ?? state.cities[0] ?? null,
    activeDirectory: (state) =>
      weatherCityDirectory.filter((meta) => !state.removedIds.includes(meta.id)),
    allMetas() {
      // 내 위치는 항상 목록 맨 앞
      return [
        ...(this.myLocationMeta ? [this.myLocationMeta] : []),
        ...this.activeDirectory,
        ...this.customMetas,
      ]
    },
    resolveMeta: (state) => (id) => {
      if (id === MY_LOCATION_ID) return state.myLocationMeta
      return findCityMeta(id) ?? state.customMetas.find((meta) => meta.id === id) ?? null
    },
    /** 내 위치 날씨가 이미 로드됐는지 */
    myLocationCity: (state) => state.cities.find((city) => city.id === MY_LOCATION_ID) ?? null,
  },

  actions: {
    selectCity(id) {
      if (!id) return
      this.selectedCityId = id
      try {
        localStorage.setItem(SELECTED_STORAGE_KEY, id)
      } catch {
        // ignore
      }
    },

    async fetchBundleForMeta(meta) {
      const bundle = await fetchCityWeatherBundle({
        lat: meta.lat,
        lon: meta.lon,
        queryName: meta.queryName,
        countryCode: meta.countryCode,
      })
      return mapCityFromOpenWeather(meta, bundle)
    },

    async fetchAll({ force = false } = {}) {
      if (this.status === 'loading') return
      if (!force && this.isReady) return

      this.status = 'loading'
      this.error = null
      this.customMetas = loadJsonArray(CUSTOM_STORAGE_KEY)
      this.removedIds = loadJsonArray(REMOVED_STORAGE_KEY)

      try {
        const results = await Promise.all(
          this.allMetas.map((meta) => this.fetchBundleForMeta(meta)),
        )
        this.cities = results
        this.status = 'ready'
        this.lastFetchedAt = Date.now()
        if (!this.cities.some((city) => city.id === this.selectedCityId)) {
          this.selectCity(this.cities[0]?.id ?? '')
        }
      } catch (error) {
        console.error('OpenWeather 일괄 조회 실패:', error)
        this.error =
          error?.response?.data?.message ||
          error?.message ||
          '날씨 데이터를 불러오지 못했습니다.'
        this.status = 'error'
      }
    },

    async ensureCity(id, { force = false } = {}) {
      const existing = this.findCity(id)
      if (existing && !force) return existing

      if (this.removedIds.includes(id)) return null

      const meta = this.resolveMeta(id)
      if (!meta) return null

      try {
        const mapped = await this.fetchBundleForMeta(meta)
        const index = this.cities.findIndex((city) => city.id === id)
        if (index >= 0) this.cities[index] = mapped
        else this.cities.push(mapped)
        if (this.status === 'idle' || this.status === 'error') this.status = 'ready'
        return mapped
      } catch (error) {
        console.error(`OpenWeather 단건 조회 실패 (${id}):`, error)
        throw error
      }
    },

    /** Geocoding API로 도시 후보 검색 (한글 별칭·중복 제거 포함) */
    async searchLocations(query, { limit = 6 } = {}) {
      const queries = expandSearchQueries(query)
      if (!queries.length) return []

      const batches = await Promise.all(
        queries.map((q) => getCoordinates(q, { limit })),
      )
      return rankAndDedupeLocations(batches.flat()).slice(0, limit)
    },

    hasPlace(location) {
      return this.cities.some((city) => samePlace(city, location))
    },

    /** 검색 결과 위치를 목록에 추가하고 날씨를 불러옴*/
    async addCityFromLocation(location) {
      if (this.hasPlace(location)) {
        const existing = this.cities.find((city) => samePlace(city, location))
        this.addError = null
        return existing
      }

      this.adding = true
      this.addError = null

      try {
        // 기본 디렉터리에서 지웠던 도시를 다시 추가하면 복구함
        const directoryHit = weatherCityDirectory.find((meta) => samePlace(meta, location))
        let meta = directoryHit
          ? { ...directoryHit, custom: false }
          : metaFromLocation(location)

        if (directoryHit && this.removedIds.includes(directoryHit.id)) {
          this.removedIds = this.removedIds.filter((id) => id !== directoryHit.id)
          persistJsonArray(REMOVED_STORAGE_KEY, this.removedIds)
        }

        const mapped = await this.fetchBundleForMeta(meta)

        if (!directoryHit) {
          this.customMetas = [...this.customMetas, meta]
          persistJsonArray(CUSTOM_STORAGE_KEY, this.customMetas)
        }

        this.cities = [...this.cities, mapped]

        if (this.status === 'idle' || this.status === 'error') this.status = 'ready'
        return mapped
      } catch (error) {
        console.error('도시 추가 실패:', error)
        this.addError =
          error?.response?.data?.message ||
          error?.message ||
          '도시를 추가하지 못했습니다.'
        throw error
      } finally {
        this.adding = false
      }
    },

    /** 브라우저 Geolocation 좌표를 Promise 로 감쌉니다. */
    getBrowserPosition() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('이 브라우저는 위치 확인을 지원하지 않습니다.'))
          return
        }
        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            }),
          (error) =>
            reject(
              new Error(
                error.code === error.PERMISSION_DENIED
                  ? '위치 권한이 거부되었습니다. 브라우저 설정에서 허용해 주세요.'
                  : '현재 위치를 확인하지 못했습니다.',
              ),
            ),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
        )
      })
    },

    /**
     * 과제 확장 / 내 위치 날씨
     * Geolocation → Reverse Geocoding 으로 지역명을 붙이고 날씨를 불러옵니다.
     */
    async detectMyLocation({ select = true } = {}) {
      if (this.locating) return null

      this.locating = true
      this.locateError = null

      try {
        const { lat, lon } = await this.getBrowserPosition()
        const place = await getReverseGeocoding(lat, lon)

        const meta = {
          id: MY_LOCATION_ID,
          // 역지오코딩이 실패해도 좌표만으로 날씨는 볼 수 있게 합니다.
          name: place ? displayCityName(place) : '내 위치',
          region: place ? displayRegion(place) : '현재 위치',
          queryName: place?.name ?? '',
          countryCode: place?.country ?? '',
          lat,
          lon,
          myLocation: true,
        }

        const mapped = await this.fetchBundleForMeta(meta)

        this.myLocationMeta = meta
        try {
          localStorage.setItem(MY_LOCATION_STORAGE_KEY, JSON.stringify(meta))
        } catch {
          // 저장 실패해도 이번 세션에서는 동작합니다
        }

        const index = this.cities.findIndex((city) => city.id === MY_LOCATION_ID)
        if (index >= 0) this.cities[index] = mapped
        else this.cities = [mapped, ...this.cities]

        if (this.status === 'idle' || this.status === 'error') this.status = 'ready'
        if (select) this.selectCity(MY_LOCATION_ID)

        return mapped
      } catch (error) {
        console.error('내 위치 날씨 조회 실패:', error)
        this.locateError =
          error?.response?.data?.message || error?.message || '내 위치 날씨를 불러오지 못했습니다.'
        return null
      } finally {
        this.locating = false
      }
    },

    /** 저장해 둔 내 위치를 지웁니다. */
    clearMyLocation() {
      this.myLocationMeta = null
      this.locateError = null
      try {
        localStorage.removeItem(MY_LOCATION_STORAGE_KEY)
      } catch {
        // ignore
      }
    },

    /** 기본 도시·추가 도시 모두 삭제 (삭제 목록은 localStorage 에 유지) */
    removeCity(id) {
      const existed = this.cities.some((city) => city.id === id)
      if (!existed && !this.resolveMeta(id) && !this.removedIds.includes(id)) {
        return false
      }

      this.cities = this.cities.filter((city) => city.id !== id)

      if (id === MY_LOCATION_ID) {
        this.clearMyLocation()
      }

      if (this.customMetas.some((meta) => meta.id === id)) {
        this.customMetas = this.customMetas.filter((meta) => meta.id !== id)
        persistJsonArray(CUSTOM_STORAGE_KEY, this.customMetas)
      }

      if (findCityMeta(id) && !this.removedIds.includes(id)) {
        this.removedIds = [...this.removedIds, id]
        persistJsonArray(REMOVED_STORAGE_KEY, this.removedIds)
      }

      if (this.selectedCityId === id) {
        this.selectCity(this.cities[0]?.id ?? '')
      }

      return true
    },
  },
})
