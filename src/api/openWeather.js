/**
 * 날씨 데이터 연동 (Axios)
 * - Axios 로 OpenWeatherMap API 호출
 * - API Key 는 환경 변수 VITE_OPENWEATHER_API_KEY 로만 주입 (코드·Git 에 하드코딩 금지)
 *
 * 과제 확장
 * - Geocoding / Current Weather / 5 Day Forecast 등 활용 API 를 조합
 *
 * 과제 — 완성
 * - API 키는 환경 변수로 조정하고 Git 에 업로드되지 않도록 함 (.env + .gitignore)
 */
import axios from 'axios'

const BASE = 'https://api.openweathermap.org'
const GEO_URL = `${BASE}/geo/1.0/direct`
const WEATHER_URL = `${BASE}/data/2.5/weather`
const FORECAST_URL = `${BASE}/data/2.5/forecast`

const getApiKey = () => {
  // 과제 — 완성 / API 키 환경 변수
  const key = import.meta.env.VITE_OPENWEATHER_API_KEY
  if (!key) {
    throw new Error(
      'VITE_OPENWEATHER_API_KEY 가 없습니다. 프로젝트 루트에 .env 파일을 만들고 키를 넣어 주세요.',
    )
  }
  return key
}

/**
 * 과제 — 과제 확장 / Geocoding API — 도시명 → 위도·경도
 * @see https://ds31x.tistory.com/509
 */
export async function getCoordinates(cityName, { countryCode = '', limit = 1 } = {}) {
  const queryParts = [cityName]
  if (countryCode) queryParts.push(countryCode)
  const q = queryParts.join(',')

  const { data } = await axios.get(GEO_URL, {
    params: {
      q,
      limit,
      appid: getApiKey(),
    },
  })

  return (data ?? []).map((location, index) => ({
    index,
    name: location.name,
    lat: location.lat,
    lon: location.lon,
    country: location.country,
    state: location.state ?? '',
    localNames: location.local_names ?? {},
  }))
}

/** 과제 — 날씨 데이터 연동 / Current Weather Data API */
export async function getCurrentWeather(lat, lon) {
  const { data } = await axios.get(WEATHER_URL, {
    params: {
      lat,
      lon,
      appid: getApiKey(),
      units: 'metric',
      lang: 'kr',
    },
  })
  return data
}

/** 과제 — 과제 확장 / 5 Day · 3 Hour Forecast API */
export async function getWeatherForecast(lat, lon) {
  const { data } = await axios.get(FORECAST_URL, {
    params: {
      lat,
      lon,
      appid: getApiKey(),
      units: 'metric',
      lang: 'kr',
    },
  })
  return data
}

/**
  * 좌표가 없으면 Geocoding으로 보완한 뒤 현재 날씨 + 예보를 함께 가져옴
 */
export async function fetchCityWeatherBundle({ lat, lon, queryName, countryCode = 'KR' }) {
  let resolvedLat = lat
  let resolvedLon = lon

  if (resolvedLat == null || resolvedLon == null) {
    const locations = await getCoordinates(queryName, { countryCode, limit: 1 })
    if (!locations.length) {
      throw new Error(`'${queryName}' 좌표를 찾을 수 없습니다.`)
    }
    resolvedLat = locations[0].lat
    resolvedLon = locations[0].lon
  }

  const [current, forecast] = await Promise.all([
    getCurrentWeather(resolvedLat, resolvedLon),
    getWeatherForecast(resolvedLat, resolvedLon),
  ])

  return {
    lat: resolvedLat,
    lon: resolvedLon,
    current,
    forecast,
  }
}
