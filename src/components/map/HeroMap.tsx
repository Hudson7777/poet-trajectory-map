import { useEffect, useMemo, useRef, useState } from 'react'
import type { PoetBundle } from '../../data/types'
import type { DynastyInfo, PoetTheme } from '../../themes/types'
import { usePoetState } from '../../pages/poet-state'
import { InkMap, type InkMapController } from './InkMap'
import { Trajectory } from './Trajectory'
import { CityMarker, type LabelSide } from './CityMarker'
import { MarkerTooltip } from './MarkerTooltip'
import { WorkMarker } from './WorkMarker'
import { createProjection, visibleStops } from './projection'
import { groupStopsByCity } from './groupStops'
import { renderEasterEggs } from '../../themes/easter-eggs/registry'

const basemapModules = import.meta.glob('../../../data/geo/*/basemap.svg', {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>

const LABEL_SIDES: LabelSide[] = ['right', 'top', 'left', 'bottom']

interface HeroMapProps {
  bundle: PoetBundle
  theme: PoetTheme
  dynasty: DynastyInfo
}

export function HeroMap({ bundle, theme, dynasty }: HeroMapProps) {
  const { year, hoveredStop, setHoveredStop, lockedStop, setLockedStop, setOpenWork } = usePoetState()
  const controllerRef = useRef<InkMapController | null>(null)
  const [zoomK, setZoomK] = useState(1)
  const project = useMemo(() => {
    const p = dynasty.projection
    return createProjection(p.lon0, p.lat0, p.s, p.sy)
  }, [dynasty])
  const basemapRaw = basemapModules[`../../../data/geo/${dynasty.id}/basemap.svg`] ?? ''
  const visible = useMemo(() => visibleStops(bundle.poet.stops, year), [bundle.poet.stops, year])
  const groups = useMemo(() => groupStopsByCity(visible), [visible])
  const [vbW, vbH] = dynasty.viewBox.split(' ').map(Number)

  useEffect(() => {
    const latest = visible[visible.length - 1]
    if (!latest || !controllerRef.current) return
    const city = bundle.cities[latest.city]
    controllerRef.current.flyTo(project(city.lon, city.lat), 1.2)
    // 仅在年份变化时飞行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year])

  // 轨迹样式：通用读取 trajectory-style 彩蛋配置，不认识具体彩蛋 id
  const styleEgg = theme.easterEggs.find(e => e.type === 'trajectory-style')
  const trajectoryStyle = styleEgg?.trigger?.yearGte !== undefined
    ? (year >= styleEgg.trigger.yearGte ? styleEgg.style ?? 'ink' : 'ink')
    : styleEgg?.style ?? 'ink'

  // locked 优先于 hover：决定哪个组展示 tooltip
  const hoveredGroup = hoveredStop
    ? groups.find(g => g.stops.includes(hoveredStop))?.stops ?? null
    : null
  // lockedStop 只在对应组仍存在于当前可见组时生效（年份回拨导致组消失时自动失效）
  const lockedGroup = lockedStop && groups.some(g => g.city === lockedStop[0]?.city && g.stops.length === lockedStop.length)
    ? lockedStop
    : null
  const activeGroup = lockedGroup ?? hoveredGroup

  return (
    <section className="hero-map">
      <InkMap basemapRaw={basemapRaw} viewBox={dynasty.viewBox} controllerRef={controllerRef} onZoomChange={setZoomK}>
        {/* 空白点击区：点地图空白清除 lockedStop */}
        <rect
          x={0}
          y={0}
          width={vbW}
          height={vbH}
          fill="transparent"
          pointerEvents="all"
          onClick={() => setLockedStop(null)}
        />
        <Trajectory stops={bundle.poet.stops} cities={bundle.cities} project={project} year={year} style={trajectoryStyle} />
        {renderEasterEggs(theme.easterEggs, 'map', city => {
          const c = bundle.cities[city]
          return c ? project(c.lon, c.lat) : undefined
        })}
        {groups.map((g, i) => {
          const c = bundle.cities[g.city]
          const pos = project(c.lon, c.lat)
          const highlighted = (lockedGroup !== null && lockedGroup[0]?.city === g.city)
            || (hoveredStop !== null && g.stops.includes(hoveredStop))
          const showLabel = zoomK >= 0.9 || highlighted
          return (
            <CityMarker
              key={`${g.city}-${g.stops[0].year}`}
              group={g.stops}
              position={pos}
              highlighted={highlighted}
              labelSide={LABEL_SIDES[i % LABEL_SIDES.length]}
              showLabel={showLabel}
              onHover={grp => setHoveredStop(grp ? grp[grp.length - 1] : null)}
              onLock={setLockedStop}
            />
          )
        })}
        {activeGroup && activeGroup.length > 0 && (() => {
          const c = bundle.cities[activeGroup[0].city]
          const pos = project(c.lon, c.lat)
          const flip = pos[0] > vbW - 260
          return (
            <MarkerTooltip
              stops={activeGroup}
              position={pos}
              flip={flip}
              onClose={() => setLockedStop(null)}
            />
          )
        })()}
        {bundle.poet.works.filter(w => w.year <= year).map(work => {
          const c = bundle.cities[work.city]
          const [x, y] = project(c.lon, c.lat)
          return (
            <WorkMarker
              key={`${work.title}-${work.year}`}
              work={work}
              position={[x + 12, y - 12]}
              onOpen={w => setOpenWork(w.title)}
            />
          )
        })}
      </InkMap>
    </section>
  )
}
