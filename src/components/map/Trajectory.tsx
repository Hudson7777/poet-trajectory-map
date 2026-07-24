import type { CityEntry, Stop } from '../../data/schemas'
import { buildTrajectoryPath, visibleStops, type Projection } from './projection'

interface TrajectoryProps {
  stops: Stop[]
  cities: Record<string, CityEntry>
  project: Projection
  year: number
  style?: 'ink' | 'gold' | 'beacon'
}

export function Trajectory({ stops, cities, project, year, style = 'ink' }: TrajectoryProps) {
  const points = visibleStops(stops, year).map(s => {
    const c = cities[s.city]
    return project(c.lon, c.lat)
  })
  if (points.length < 2) return null
  return <path d={buildTrajectoryPath(points, true)} className={`trajectory trajectory-${style}`} fill="none" />
}
