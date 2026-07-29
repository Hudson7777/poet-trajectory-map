import { useMemo } from 'react'
import type { PoetBundle } from '../../data/types'
import type { DynastyInfo, PoetTheme } from '../../themes/types'
import { usePoetState } from '../../pages/poet-state'
import { Trajectory, isIntenseBrush } from './Trajectory'
import { BrushDefs } from './brushDefs'
import { createProjection, visibleStops } from './projection'
import { getBasemapRaw } from './basemaps'

interface MiniMapProps {
  bundle: PoetBundle
  theme: PoetTheme
  dynasty: DynastyInfo
}

/** 悬浮小地图：全景静态呈现，轨迹随 year 渐进，朱砂点标记当前最新行迹；点击滚回 Hero 大地图 */
export function MiniMap({ bundle, theme, dynasty }: MiniMapProps) {
  const { year } = usePoetState()
  const project = useMemo(() => {
    const p = dynasty.projection
    return createProjection(p.lon0, p.lat0, p.s, p.sy)
  }, [dynasty])
  const basemapRaw = getBasemapRaw(dynasty.id)
  const latest = visibleStops(bundle.poet.stops, year).at(-1)
  const intense = isIntenseBrush(theme.brush, year)

  return (
    <button
      type="button"
      className="mini-map"
      aria-label="回到大地图"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg viewBox={dynasty.viewBox} className="mini-map-svg" role="img" aria-label="行迹缩略图">
        <g dangerouslySetInnerHTML={{ __html: basemapRaw }} />
        <BrushDefs brush={theme.brush} />
        <Trajectory
          stops={bundle.poet.stops}
          cities={bundle.cities}
          project={project}
          year={year}
          brush={theme.brush}
          intense={intense}
        />
        {latest && (() => {
          const c = bundle.cities[latest.city]
          if (!c) return null
          const [cx, cy] = project(c.lon, c.lat)
          return (
            <g className="mini-map-current">
              <circle cx={cx} cy={cy} r={10} fill="none" stroke="var(--seal)" strokeWidth={2} opacity={0.5} />
              <circle cx={cx} cy={cy} r={5} fill="var(--seal)" />
            </g>
          )
        })()}
      </svg>
      <span className="mini-map-year font-calligraphy">{year}</span>
    </button>
  )
}
