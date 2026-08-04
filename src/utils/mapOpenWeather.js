/**
 * OpenWeather 응답 → Skyline Weather 도시 객체로 변환합니다.
 * icon 키는 WeatherIcon.vue 이름과 1:1 대응합니다.
 *
 * 기상 현황(status)은 API 의 lang=kr description 을 쓰지 않습니다.
 * OpenWeather 한국어 번역이 "튼구름", "온흐림", "구름조금"처럼
 * 잘리거나 어색한 경우가 많아, weather.id 기준으로 앱 표기를 통일합니다.
 * @see https://openweathermap.org/weather-conditions
 */

/** OpenWeather weather id → 앱에서 쓰는 짧은 기상 현황 문구 */
const STATUS_BY_ID = {
  // Thunderstorm
  200: '뇌우',
  201: '뇌우',
  202: '뇌우',
  210: '뇌우',
  211: '뇌우',
  212: '뇌우',
  221: '뇌우',
  230: '뇌우',
  231: '뇌우',
  232: '뇌우',
  // Drizzle
  300: '이슬비',
  301: '이슬비',
  302: '이슬비',
  310: '이슬비',
  311: '이슬비',
  312: '이슬비',
  313: '소나기',
  314: '소나기',
  321: '소나기',
  // Rain
  500: '약한 비',
  501: '비',
  502: '강한 비',
  503: '강한 비',
  504: '강한 비',
  511: '우박',
  520: '소나기',
  521: '소나기',
  522: '소나기',
  531: '소나기',
  // Snow
  600: '약한 눈',
  601: '눈',
  602: '강한 눈',
  611: '진눈깨비',
  612: '진눈깨비',
  613: '진눈깨비',
  615: '비와 눈',
  616: '비와 눈',
  620: '소나기 눈',
  621: '소나기 눈',
  622: '소나기 눈',
  // Atmosphere
  701: '박무',
  711: '연기',
  721: '연무',
  731: '황사',
  741: '안개',
  751: '황사',
  761: '먼지',
  762: '화산재',
  771: '돌풍',
  781: '토네이도',
  // Clear / Clouds — 구름량에 따라 단계만 구분
  800: '맑음',
  801: '구름 조금', // few clouds 11–25%
  802: '구름', // scattered clouds 25–50%
  803: '구름 많음', // broken clouds 51–84%
  804: '흐림', // overcast 85–100%
}

const STATUS_BY_GROUP = [
  { min: 200, max: 299, label: '뇌우' },
  { min: 300, max: 399, label: '이슬비' },
  { min: 500, max: 599, label: '비' },
  { min: 600, max: 699, label: '눈' },
  { min: 700, max: 799, label: '안개' },
]

/** OpenWeather weather id → 통일된 한글 기상 현황 */
export function mapWeatherStatus(weather = {}, windSpeed = 0) {
  const id = Number(weather.id) || 800

  // 아이콘 규칙과 같이, 맑음·구름 적음 상태에서 강한 바람이면 강풍으로 표기
  if (windSpeed >= 8 && id >= 800 && id < 803) return '강풍'

  if (STATUS_BY_ID[id]) return STATUS_BY_ID[id]

  const group = STATUS_BY_GROUP.find((item) => id >= item.min && id <= item.max)
  return group?.label ?? '관측 중'
}

/** OpenWeather weather id / icon 코드 → 앱 아이콘 */
export function mapWeatherIcon(weather = {}, windSpeed = 0) {
  const id = weather.id ?? 800
  const icon = weather.icon ?? '01d'

  if (id >= 200 && id < 300) return 't1'
  if (id >= 600 && id < 700) return 'n1'
  if (id === 511) return 'n1'
  if (id >= 520 && id < 600) return 'r3'
  if (id >= 300 && id < 400) return 'r2'
  if (id >= 500 && id < 510) return 'r1'
  if (id === 701 || id === 741 || id === 711 || id === 721) return 'f1'
  if (id >= 700 && id < 800) return 'f1'

  if (windSpeed >= 8 && id >= 800 && id < 803) return 'w1'

  if (id === 800) return icon.endsWith('n') ? 's2' : 's3'
  if (id === 801) return 'c3'
  if (id === 802) return 'c1'
  if (id === 803) return 'c2'
  if (id === 804) return 'c1'

  return 'c1'
}

/** Unix 시각 + 도시 timezone(초) → 현지 시 라벨 */
const hourLabelFromUnix = (unixSec, timezoneOffsetSec = 0) => {
  const local = new Date((Number(unixSec) + Number(timezoneOffsetSec)) * 1000)
  const hour = local.getUTCHours()
  return `${String(hour).padStart(2, '0')}시`
}

/** targetUnix 에 가장 가까운 예보 항목 */
const nearestForecast = (list, targetUnix) => {
  if (!list.length) return null
  let best = list[0]
  let bestDiff = Math.abs(Number(best.dt) - targetUnix)
  for (let i = 1; i < list.length; i += 1) {
    const diff = Math.abs(Number(list[i].dt) - targetUnix)
    if (diff < bestDiff) {
      best = list[i]
      bestDiff = diff
    }
  }
  return best
}

/**
 * 현지 시각 '지금'부터 3시간 간격으로 5개 구간을 만듭니다.
 *
 * OpenWeather 3시간 예보는 보통 '다음 정각 슬롯'부터라서,
 * 한국 오후 3시에도 첫 항목이 UTC 09:00(=KST 18시)인 경우가 많습니다.
 * 그래서 첫 칸은 현재 관측 기온을 쓰고, 이후는 목표 시각에 가장 가까운 예보를 매칭합니다.
 */
export function mapHourlyFromForecast(
  list = [],
  count = 5,
  timezoneOffsetSec = 0,
  currentTemp = null,
) {
  if (!list.length && currentTemp == null) return []

  const nowSec = Math.floor(Date.now() / 1000)
  const stepSec = 3 * 60 * 60
  const points = []

  for (let i = 0; i < count; i += 1) {
    const targetSec = nowSec + i * stepSec
    const label = hourLabelFromUnix(targetSec, timezoneOffsetSec)

    if (i === 0 && currentTemp != null && !Number.isNaN(Number(currentTemp))) {
      points.push({
        label,
        temp: Math.round(Number(currentTemp)),
        at: nowSec,
        isNow: true,
      })
      continue
    }

    const match = nearestForecast(list, targetSec)
    if (!match) break
    points.push({
      label,
      temp: Math.round(match.main.temp),
      at: match.dt,
      isNow: false,
    })
  }

  return points
}

/** 오늘(또는 예보 구간) 최고·최저 */
export function mapHighLow(current, forecastList = []) {
  const temps = forecastList.slice(0, 8).map((item) => item.main.temp)
  if (temps.length) {
    return {
      high: Math.round(Math.max(...temps)),
      low: Math.round(Math.min(...temps)),
    }
  }
  return {
    high: Math.round(current.main.temp_max ?? current.main.temp),
    low: Math.round(current.main.temp_min ?? current.main.temp),
  }
}

/** 강수 확률: 예보 pop(0~1) → % */
export function mapRainChance(forecastList = []) {
  const first = forecastList[0]
  if (!first || first.pop == null) return 0
  return Math.round(first.pop * 100)
}

/**
 * @param {object} meta - weatherCities 디렉터리 항목
 * @param {{ current: object, forecast: object }} bundle
 */
export function mapCityFromOpenWeather(meta, bundle) {
  const { current, forecast } = bundle
  const weather = current.weather?.[0] ?? {}
  const list = forecast?.list ?? []
  const wind = current.wind?.speed ?? 0
  const { high, low } = mapHighLow(current, list)
  const timezoneOffsetSec = forecast?.city?.timezone ?? current?.timezone ?? 0

  return {
    id: meta.id,
    name: meta.name,
    region: meta.region,
    lat: bundle.lat ?? meta.lat,
    lon: bundle.lon ?? meta.lon,
    custom: Boolean(meta.custom),
    timezoneOffsetSec,
    icon: mapWeatherIcon(weather, wind),
    status: mapWeatherStatus(weather, wind),
    temp: Math.round(current.main.temp),
    feels: Math.round(current.main.feels_like),
    high,
    low,
    humidity: current.main.humidity,
    wind: Number(wind.toFixed(1)),
    rain: mapRainChance(list),
    hourly: mapHourlyFromForecast(list, 5, timezoneOffsetSec, current.main.temp),
  }
}
