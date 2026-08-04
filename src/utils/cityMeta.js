/** Geocoding 결과·저장된 메타를 앱 도시 메타로 맞춥니다. */

const COUNTRY_LABELS = {
  KR: '대한민국',
  JP: '일본',
  CN: '중국',
  US: '미국',
  GB: '영국',
  DE: '독일',
  FR: '프랑스',
  AU: '호주',
  CA: '캐나다',
  TW: '대만',
  VN: '베트남',
  TH: '태국',
  SG: '싱가포르',
  HK: '홍콩',
}

/** OpenWeather 한글 검색이 약한 도시를 영문명으로 보완합니다. */
const CITY_QUERY_ALIASES = {
  도쿄: 'Tokyo',
  동경: 'Tokyo',
  오사카: 'Osaka',
  교토: 'Kyoto',
  나고야: 'Nagoya',
  후쿠오카: 'Fukuoka',
  파리: 'Paris',
  런던: 'London',
  뉴욕: 'New York',
  로스앤젤레스: 'Los Angeles',
  LA: 'Los Angeles',
  베이징: 'Beijing',
  북경: 'Beijing',
  상하이: 'Shanghai',
  상해: 'Shanghai',
  타이베이: 'Taipei',
  대만: 'Taipei',
  홍콩: 'Hong Kong',
  싱가포르: 'Singapore',
  방콕: 'Bangkok',
  하노이: 'Hanoi',
  호치민: 'Ho Chi Minh City',
  시드니: 'Sydney',
  멜버른: 'Melbourne',
  베를린: 'Berlin',
  로마: 'Rome',
  마드리드: 'Madrid',
  모스크바: 'Moscow',
  두바이: 'Dubai',
}

export const expandSearchQueries = (rawQuery) => {
  const trimmed = rawQuery.trim()
  if (!trimmed) return []
  const alias = CITY_QUERY_ALIASES[trimmed]
  if (alias && alias.toLowerCase() !== trimmed.toLowerCase()) {
    return [trimmed, alias]
  }
  return [trimmed]
}

const WEAK_PLACE_PATTERN = /airport|international|station|university|harbor|harbour|port\b/i

export const isWeakPlaceName = (name = '') => WEAK_PLACE_PATTERN.test(name)

/** 좌표 기준으로 중복을 제거하고, 공항 등 약한 결과는 뒤로 보냅니다. */
export const rankAndDedupeLocations = (locations = []) => {
  const seen = new Set()
  const unique = []

  for (const location of locations) {
    const key = `${Number(location.lat).toFixed(3)},${Number(location.lon).toFixed(3)}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(location)
  }

  return unique.sort((a, b) => {
    const weakA = isWeakPlaceName(a.name) ? 1 : 0
    const weakB = isWeakPlaceName(b.name) ? 1 : 0
    return weakA - weakB
  })
}

export const makeCityId = (lat, lon) =>
  `geo_${Number(lat).toFixed(4)}_${Number(lon).toFixed(4)}`

export const countryLabel = (code = '') => COUNTRY_LABELS[code] ?? code

export const displayCityName = (location) =>
  location.localNames?.ko || location.name || location.queryName || '알 수 없음'

export const displayRegion = (location) => {
  const country = countryLabel(location.country)
  const state = location.state
  if (state && country) return `${country} · ${state}`
  if (country) return country
  return state || '위치 정보'
}

export const metaFromLocation = (location) => {
  const lat = location.lat
  const lon = location.lon
  const name = displayCityName(location)
  return {
    id: location.id || makeCityId(lat, lon),
    name,
    region: displayRegion(location),
    queryName: location.name || name,
    countryCode: location.country || '',
    lat,
    lon,
    custom: true,
  }
}

export const samePlace = (a, b) => {
  if (!a || !b) return false
  if (a.id && b.id && a.id === b.id) return true
  return (
    Math.abs(Number(a.lat) - Number(b.lat)) < 0.01 &&
    Math.abs(Number(a.lon) - Number(b.lon)) < 0.01
  )
}
