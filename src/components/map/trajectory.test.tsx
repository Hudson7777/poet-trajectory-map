import { render } from '@testing-library/react'
import { describe, it, expect, beforeAll } from 'vitest'
import { Trajectory } from './Trajectory'
import { createProjection } from './projection'

// jsdom v29 不暴露 SVGPathElement 全局，从真实 path 元素取原型挂 mock；
// 语义与 brief 一致（getTotalLength → 100），guard 的 typeof 检查走原型链不受影响。
// jsdom v29 也不实现 window.matchMedia，挂最小 mock 让 reduced-motion 分支可走。
beforeAll(() => {
  const sample = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  Object.defineProperty(Object.getPrototypeOf(sample), 'getTotalLength', {
    configurable: true,
    value: () => 100,
  })
  if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }) as unknown as MediaQueryList
  }
})

const cities = {
  长安: { name: '长安', modernName: '西安', lon: 108.94, lat: 34.34, region: '京畿道' },
  洛阳: { name: '洛阳', modernName: '洛阳', lon: 112.45, lat: 34.62, region: '都畿道' },
}
const stops = [
  { year: 726, city: '长安', event: '事件一', role: '布衣', source: '出处' },
  { year: 742, city: '洛阳', event: '事件二', role: '官员', source: '出处' },
  { year: 750, city: '长安', event: '事件三', role: '官员', source: '出处' },
]
const brush = { kind: 'plain' as const, colors: ['#333', '#999'] as [string, string], width: 2 }

describe('Trajectory 生长动画', () => {
  it('渲染 mask 且主线/晕线在 mask 组内', () => {
    const project = createProjection(72, 54.5, 25, 29)
    const { container } = render(
      <svg><Trajectory stops={stops} cities={cities} project={project} year={750} brush={brush} /></svg>,
    )
    const mask = container.querySelector('mask')
    expect(mask).toBeTruthy()
    expect(mask!.querySelector('path')).toBeTruthy()
    expect(container.querySelector('g[mask]')).toBeTruthy()
  })
  it('年份回拨时直接全显（不走动画分支）', () => {
    const project = createProjection(72, 54.5, 25, 29)
    const { container, rerender } = render(
      <svg><Trajectory stops={stops} cities={cities} project={project} year={750} brush={brush} /></svg>,
    )
    rerender(<svg><Trajectory stops={stops} cities={cities} project={project} year={742} brush={brush} /></svg>)
    const maskPath = container.querySelector('mask path') as (Element & { style: CSSStyleDeclaration }) | null
    expect(maskPath?.style.strokeDashoffset).toBe('0')
  })
})
