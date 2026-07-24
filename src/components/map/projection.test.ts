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
  it('smooth 模式含二次贝塞尔', () => {
    const d = buildTrajectoryPath([[0, 0], [10, 10], [20, 0]], true)
    expect(d).toMatch(/^M0,0/)
    expect(d).toContain('Q10,10')
    expect(d).toMatch(/L20,0$/)
  })
  it('非 smooth 模式为折线', () => {
    const d = buildTrajectoryPath([[0, 0], [10, 10], [20, 0]], false)
    expect(d).toBe('M0,0L10,10L20,0')
  })
  it('空数组返回空串', () => {
    expect(buildTrajectoryPath([], true)).toBe('')
  })
})

describe('visibleStops', () => {
  const stops = [{ year: 705 }, { year: 726 }, { year: 742 }]
  it('按年份过滤', () => {
    expect(visibleStops(stops, 726)).toEqual([{ year: 705 }, { year: 726 }])
  })
})
