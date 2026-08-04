/**
 * 기온 구간 · 색상 공통 규칙 (섭씨)
 *  · 10°C 미만  → 파랑 · 0~1/4
 *  · 10°C 이상  → 노랑 · 1/4~2/4
 *  · 20°C 이상  → 주황 · 2/4~3/4
 *  · 30°C 이상  → 빨강 · 3/4~4/4 (40°C에서 가득)
 */

export const TEMP_COLOR_STOPS = [
  { t: -10, r: 110, g: 178, b: 245 },
  { t: 10, r: 130, g: 198, b: 240 },
  { t: 12, r: 255, g: 224, b: 130 },
  { t: 20, r: 255, g: 196, b: 110 },
  { t: 22, r: 255, g: 158, b: 92 },
  { t: 30, r: 255, g: 120, b: 96 },
  { t: 40, r: 255, g: 96, b: 96 },
]

export const TEMP_BAND_LEGEND = [
  { at: 5, label: '10°C 미만' },
  { at: 15, label: '10°C~' },
  { at: 25, label: '20°C~' },
  { at: 35, label: '30°C~' },
]

const lerp = (a, b, t) => a + (b - a) * t

export const mixTowardWhite = ({ r, g, b }, amount) => ({
  r: Math.round(lerp(r, 255, amount)),
  g: Math.round(lerp(g, 255, amount)),
  b: Math.round(lerp(b, 255, amount)),
})

export const rgbCss = ({ r, g, b }, alpha = 1) =>
  alpha === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`

export const colorAtTemp = (celsius) => {
  const stops = TEMP_COLOR_STOPS
  const t = Math.max(stops[0].t, Math.min(stops[stops.length - 1].t, celsius))
  let i = 0
  while (i < stops.length - 1 && t > stops[i + 1].t) i += 1
  const a = stops[i]
  const b = stops[Math.min(i + 1, stops.length - 1)]
  const span = b.t - a.t || 1
  const p = (t - a.t) / span
  return {
    r: Math.round(lerp(a.r, b.r, p)),
    g: Math.round(lerp(a.g, b.g, p)),
    b: Math.round(lerp(a.b, b.b, p)),
  }
}

/** 구간 기준 막대 길이/높이 (0~100%) */
export const barExtentOf = (celsius) => {
  let pct
  if (celsius < 10) {
    const t = Math.max(-10, Math.min(10, celsius))
    pct = ((t + 10) / 20) * 25
  } else if (celsius < 20) {
    pct = 25 + ((celsius - 10) / 10) * 25
  } else if (celsius < 30) {
    pct = 50 + ((celsius - 20) / 10) * 25
  } else {
    pct = 75 + ((Math.min(celsius, 40) - 30) / 10) * 25
  }
  return Math.round(Math.max(4, Math.min(100, pct)))
}

/**
 * @param {number} celsius
 * @param {'horizontal' | 'vertical'} direction
 */
export const barFillStyle = (celsius, direction = 'horizontal') => {
  const tip = colorAtTemp(celsius)
  const soft = mixTowardWhite(tip, 0.35)
  const extent = `${barExtentOf(celsius)}%`
  const gradient =
    direction === 'vertical'
      ? `linear-gradient(180deg, ${rgbCss(tip)}, ${rgbCss(soft, 0.35)})`
      : `linear-gradient(90deg, ${rgbCss(soft, 0.55)}, ${rgbCss(tip)})`

  return direction === 'vertical'
    ? { height: extent, background: gradient }
    : { width: extent, background: gradient }
}

export const bandLegendItems = () =>
  TEMP_BAND_LEGEND.map((item) => ({
    label: item.label,
    color: rgbCss(colorAtTemp(item.at)),
  }))
