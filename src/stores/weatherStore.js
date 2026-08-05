/**
 * 날씨 데이터 연동 / Mock → OpenWeather 응답으로 교체한 도시 목록 스토어
 * 도시 검색·추가·삭제 등 API·상태 확장
 */
import { defineStore } from 'pinia'
import { fetchCityWeatherBundle, getCoordinates } from '@/api/openWeather'
import { weatherCityDirectory, findCityMeta } from '@/data/weatherCities'
import { mapCityFromOpenWeather } from '@/utils/mapOpenWeather'
import {
  expandSearchQueries,
  metaFromLocation,
  rankAndDedupeLocations,
  samePlace,
} from '@/utils/cityMeta'

const CUSTOM_STORAGE_KEY = 'skyline-weather-custom-cities'
const REMOVED_STORAGE_KEY = 'skyline-weather-removed-cities'

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
      return [...this.activeDirectory, ...this.customMetas]
    },
    resolveMeta: (state) => (id) =>
      findCityMeta(id) ?? state.customMetas.find((meta) => meta.id === id) ?? null,
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

    /** 기본 도시·추가 도시 모두 삭제 (삭제 목록은 localStorage 에 유지) */
    removeCity(id) {
      const existed = this.cities.some((city) => city.id === id)
      if (!existed && !this.resolveMeta(id) && !this.removedIds.includes(id)) {
        return false
      }

      this.cities = this.cities.filter((city) => city.id !== id)

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
