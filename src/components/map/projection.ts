export type Projection = (lon: number, lat: number) => [number, number]

/** 全项目唯一投影常量（与 basemap.svg 生成时一致，禁止另起数值） */
export const TANG_PROJECTION = { lon0: 72, lat0: 54.5, s: 25, sy: 29 }

export function createProjection(lon0: number, lat0: number, s: number, sy: number): Projection {
  return (lon, lat) => [(lon - lon0) * s, (lat0 - lat) * sy]
}

export function buildTrajectoryPath(points: [number, number][], smooth = true): string {
  if (points.length === 0) return ''
  const fmt = (n: number) => Math.round(n * 100) / 100
  let d = `M${fmt(points[0][0])},${fmt(points[0][1])}`
  if (!smooth) {
    return d + points.slice(1).map(([x, y]) => `L${fmt(x)},${fmt(y)}`).join('')
  }
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += `C${fmt(c1x)},${fmt(c1y)} ${fmt(c2x)},${fmt(c2y)} ${fmt(p2[0])},${fmt(p2[1])}`
  }
  return d
}

export function visibleStops<T extends { year: number }>(stops: T[], year: number): T[] {
  return stops.filter(s => s.year <= year)
}
