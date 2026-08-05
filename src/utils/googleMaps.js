/**
 * Google Maps JavaScript API 동적 로더.
 *
 * index.html 에 부트스트랩 스크립트를 넣는 대신, 지도 페이지에 들어갈 때만
 * 스크립트를 주입합니다. (대시보드만 쓰는 사용자는 지도 SDK 를 받지 않음)
 *
 * 원본: js-api-samples / 3d-simple-map 의 inline bootstrap loader
 */

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''
// 3D 지도(maps3d)는 채널에 따라 제공 여부가 달라질 수 있어 버전을 덮어쓸 수 있게 둡니다.
const API_VERSION = import.meta.env.VITE_GOOGLE_MAPS_VERSION ?? ''

const CALLBACK_NAME = '__skylineMapsReady__'

let bootstrapPromise = null

export const hasMapsApiKey = () => Boolean(API_KEY)

/** Maps JS API 부트스트랩을 1회만 주입하고 google.maps 네임스페이스를 돌려줍니다. */
const bootstrapMapsApi = () => {
  if (window.google?.maps?.importLibrary) {
    return Promise.resolve(window.google.maps)
  }
  if (bootstrapPromise) return bootstrapPromise

  if (!API_KEY) {
    return Promise.reject(
      new Error('Google Maps API 키가 없습니다. .env 에 VITE_GOOGLE_MAPS_API_KEY 를 설정하세요.'),
    )
  }

  bootstrapPromise = new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      key: API_KEY,
      libraries: 'maps3d',
      loading: 'async',
      callback: `google.maps.${CALLBACK_NAME}`,
    })
    if (API_VERSION) params.set('v', API_VERSION)

    // 부트스트랩 콜백은 google.maps 네임스페이스 위에 걸어 둡니다.
    window.google = window.google ?? {}
    window.google.maps = window.google.maps ?? {}
    window.google.maps[CALLBACK_NAME] = () => resolve(window.google.maps)

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`
    script.async = true
    script.nonce = document.querySelector('script[nonce]')?.nonce ?? ''
    script.onerror = () => {
      bootstrapPromise = null
      reject(new Error('Google Maps API 를 불러오지 못했습니다.'))
    }

    document.head.append(script)
  })

  return bootstrapPromise
}

/** Maps JS API 의 개별 라이브러리를 로드합니다. */
export const loadMapsLibrary = async (name) => {
  const maps = await bootstrapMapsApi()
  return maps.importLibrary(name)
}

/** maps3d 라이브러리(Map3DElement · Marker3DElement)를 로드합니다. */
export const loadMaps3d = () => loadMapsLibrary('maps3d')
