export type Projection = (lon: number, lat: number) => [number, number]

/** 全项目唯一投影常量（与 basemap.svg 生成时一致，禁止另起数值） */
export const TANG_PROJECTION = { lon0: 72, lat0: 54.5, s: 25, sy: 29 }

export function createProjection(lon0: number, lat0: number, s: number, sy: number): Projection {
  return (lon, lat) => [(lon - lon0) * s, (lat0 - lat) * sy]
}

export function buildTrajectoryPath(points: [number, number][], smooth = true): string {
  if (points.length === 0) return ''
  let d = `M${points[0][0]},${points[0][1]}`
  if (!smooth) {
    return d + points.slice(1).map(([x, y]) => `L${x},${y}`).join('')
  }
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i]
    const [nx, ny] = points[i + 1]
    d += ` Q${x},${y} ${(x + nx) / 2},${(y + ny) / 2}`
  }
  const last = points[points.length - 1]
  return d + ` L${last[0]},${last[1]}`
}

export function visibleStops<T extends { year: number }>(stops: T[], year: number): T[] {
  return stops.filter(s => s.year <= year)
}
