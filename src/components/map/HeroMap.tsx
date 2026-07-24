import { useEffect, useMemo, useRef } from 'react'
import type { PoetBundle } from '../../data/types'
import type { DynastyInfo, PoetTheme } from '../../themes/types'
import { usePoetState } from '../../pages/poet-state'
import { InkMap, type InkMapController } from './InkMap'
import { Trajectory } from './Trajectory'
import { CityMarker } from './CityMarker'
import { WorkMarker } from './WorkMarker'
import { createProjection, visibleStops } from './projection'
import { renderEasterEggs } from '../../themes/easter-eggs/registry'

const basemapModules = import.meta.glob('../../../data/geo/*/basemap.svg', {
  query: '?raw',
  eager: true,
  import: 'default',
}) as Record<string, string>

interface HeroMapProps {
  bundle: PoetBundle
  theme: PoetTheme
  dynasty: DynastyInfo
}

export function HeroMap({ bundle, theme, dynasty }: HeroMapProps) {
  const { year, hoveredStop, setHoveredStop, setOpenWork } = usePoetState()
  const controllerRef = useRef<InkMapController | null>(null)
  const project = useMemo(() => {
    const p = dynasty.projection
    return createProjection(p.lon0, p.lat0, p.s, p.sy)
  }, [dynasty])
  const basemapRaw = basemapModules[`../../../data/geo/${dynasty.id}/basemap.svg`] ?? ''
  const visible = visibleStops(bundle.poet.stops, year)

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

  return (
    <section className="hero-map">
      <InkMap basemapRaw={basemapRaw} viewBox={dynasty.viewBox} controllerRef={controllerRef}>
        <Trajectory stops={bundle.poet.stops} cities={bundle.cities} project={project} year={year} style={trajectoryStyle} />
        {renderEasterEggs(theme.easterEggs, 'map', city => {
          const c = bundle.cities[city]
          return c ? project(c.lon, c.lat) : undefined
        })}
        {visible.map(stop => {
          const c = bundle.cities[stop.city]
          return (
            <CityMarker
              key={`${stop.year}-${stop.city}`}
              stop={stop}
              position={project(c.lon, c.lat)}
              highlighted={hoveredStop === stop}
              dimmed={hoveredStop !== null && hoveredStop !== stop}
              onHover={setHoveredStop}
            />
          )
        })}
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
