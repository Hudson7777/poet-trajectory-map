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
  if (points.length < 2) return null
  const d = buildTrajectoryPath(points, true)
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
  )
}
