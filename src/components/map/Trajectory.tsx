import { useEffect, useId, useRef } from 'react'
import type { CityEntry, Stop } from '../../data/schemas'
import type { BrushStyle, BrushKind } from '../../themes/types'
import { buildTrajectoryPath, visibleStops, type Projection } from './projection'

interface TrajectoryProps {
  stops: Stop[]
  cities: Record<string, CityEntry>
  project: Projection
  year: number
  brush: BrushStyle
  intense?: boolean
}

const DASH_BY_KIND: Record<BrushKind, string | undefined> = {
  gold: '26 9 4 9 14 7',
  dry: '18 12 3 10',
  fade: '26 9 4 9 14 7',
  plain: undefined,
  spring: '26 9 4 9 14 7',
}

const GRADIENT_KINDS: BrushKind[] = ['gold', 'spring', 'fade']

/** 焦墨笔触（杜甫）在安史之乱（755）后转为重笔：intense 加粗加深。HeroMap 与 MiniMap 共用。 */
export function isIntenseBrush(brush: BrushStyle, year: number): boolean {
  return brush.kind === 'dry' && year >= 755
}

/** 颜色加深：intense 时主线条/晕染加深，体现杜甫安史之乱后笔力沉郁。 */
function deepen(hex: string): string {
  const m = /^#([\da-f]{6})$/i.exec(hex.trim())
  if (!m) return hex
  const n = parseInt(m[1], 16)
  const r = Math.round(((n >> 16) & 0xff) * 0.7)
  const g = Math.round(((n >> 8) & 0xff) * 0.7)
  const b = Math.round((n & 0xff) * 0.7)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function Trajectory({ stops, cities, project, year, brush, intense = false }: TrajectoryProps) {
  const points = visibleStops(stops, year).map(s => {
    const c = cities[s.city]
    return project(c.lon, c.lat)
  })
  const d = points.length >= 2 ? buildTrajectoryPath(points, true) : ''

  // F2 轨迹生长：mask 路径 dashoffset 从「上次长度 → 0」过渡，年份前进时线条向前生长；
  // 回拨/reduced-motion 直接全显。mask 保留底层笔触纹理（枯笔/金粉不受影响）。
  // effect 重跑前必须 cancel 上一个 Animation——TimeSlider 连续拖动时每帧重跑，
  // fill:'forwards' 的 Animation 不 cancel 会持续堆积（critic-glm 裁决项）。
  const maskId = `tjg-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const mainRef = useRef<SVGPathElement>(null)
  const maskRef = useRef<SVGPathElement>(null)
  const prevLen = useRef(0)
  const animRef = useRef<Animation | null>(null)
  useEffect(() => {
    const main = mainRef.current
    const mask = maskRef.current
    if (!main || !mask || typeof main.getTotalLength !== 'function') return
    const len = main.getTotalLength()
    mask.style.strokeDasharray = `${len}`
    animRef.current?.cancel()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || len <= prevLen.current || !mask.animate) {
      mask.style.strokeDashoffset = '0'
      animRef.current = null
    } else {
      animRef.current = mask.animate(
        [{ strokeDashoffset: `${len - prevLen.current}` }, { strokeDashoffset: '0' }],
        { duration: Math.min(300 + (len - prevLen.current) * 0.4, 900), easing: 'ease-out', fill: 'forwards' },
      )
    }
    prevLen.current = len
  }, [d])

  if (points.length < 2) return null
  const { kind, colors, width } = brush
  const scale = intense ? 1.4 : 1
  const mainWidth = width * scale
  const haloWidth = mainWidth * 3
  const mainColor = intense ? deepen(colors[0]) : colors[0]
  const haloColor = intense ? deepen(colors[1]) : colors[1]
  const stroke = GRADIENT_KINDS.includes(kind) ? `url(#brush-${kind}-grad)` : mainColor
  const filter = kind === 'gold' ? 'url(#brush-gold-grain)' : kind === 'dry' ? 'url(#brush-dry-flying)' : undefined
  const dash = DASH_BY_KIND[kind]
  return (
    <g className={`trajectory-group trajectory-${kind}`}>
      <mask id={maskId}>
        <path ref={maskRef} d={d} fill="none" stroke="#fff" strokeWidth={haloWidth} strokeLinecap="round" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path
          d={d}
          className={`trajectory trajectory-${kind}-halo`}
          fill="none"
          stroke={haloColor}
          strokeWidth={haloWidth}
          strokeOpacity={0.15}
          strokeLinecap="round"
        />
        <path
          ref={mainRef}
          d={d}
          className={`trajectory trajectory-${kind}`}
          fill="none"
          stroke={stroke}
          strokeWidth={mainWidth}
          strokeDasharray={dash}
          strokeLinecap="round"
          filter={filter}
        />
      </g>
    </g>
  )
}
