import type { Stop } from '../../data/schemas'

export interface StopGroup {
  city: string
  stops: Stop[]
}

/**
 * 按 city 分组 stops，组内按年份升序，组间按首站年份升序。
 * 输入通常是 visibleStops 的结果（已按年份过滤、整体年份升序）。
 */
export function groupStopsByCity(stops: Stop[]): StopGroup[] {
  const order: string[] = []
  const map = new Map<string, Stop[]>()
  for (const stop of stops) {
    let arr = map.get(stop.city)
    if (!arr) {
      arr = []
      map.set(stop.city, arr)
      order.push(stop.city)
    }
    arr.push(stop)
  }
  const groups = order.map(city => {
    const arr = map.get(city)!
    arr.sort((a, b) => a.year - b.year)
    return { city, stops: arr }
  })
  groups.sort((a, b) => a.stops[0].year - b.stops[0].year)
  return groups
}

/** 组内任一 stop 有 uncertain 即视为存疑组 */
export function isUncertainGroup(group: Stop[]): boolean {
  return group.some(s => s.uncertain)
}
