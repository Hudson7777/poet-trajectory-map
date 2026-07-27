import { describe, it, expect } from 'vitest'
import { createProjection, buildTrajectoryPath, visibleStops, TANG_PROJECTION } from './projection'

describe('createProjection', () => {
  it('与 mockup 常量一致的长安投影', () => {
    const project = createProjection(TANG_PROJECTION.lon0, TANG_PROJECTION.lat0, TANG_PROJECTION.s, TANG_PROJECTION.sy)
    const [x, y] = project(108.94, 34.34)
    expect(x).toBeCloseTo(923.5, 0)
    expect(y).toBeCloseTo(584.6, 0)
  })
})

describe('buildTrajectoryPath', () => {
  it('smooth 模式曲线精确穿过每个输入点', () => {
    const pts: [number, number][] = [[0, 0], [10, 10], [20, 0], [30, 12]]
    const d = buildTrajectoryPath(pts, true)
    expect(d).toMatch(/^M0,0/)
    // 每个中间点都必须作为某段 C 曲线的终点出现（不再漂移到 midpoint）
    expect(d).toContain('10,10')
    expect(d).toContain('20,0')
    expect(d).toMatch(/30,12$/)
  })
  it('非 smooth 模式为折线', () => {
    expect(buildTrajectoryPath([[0, 0], [10, 10], [20, 0]], false)).toBe('M0,0L10,10L20,0')
  })
  it('空数组返回空串', () => {
    expect(buildTrajectoryPath([], true)).toBe('')
  })
  it('单点只输出 M', () => {
    expect(buildTrajectoryPath([[5, 5]], true)).toBe('M5,5')
  })
})

describe('visibleStops', () => {
  const stops = [{ year: 705 }, { year: 726 }, { year: 742 }]
  it('按年份过滤', () => {
    expect(visibleStops(stops, 726)).toEqual([{ year: 705 }, { year: 726 }])
  })
})
