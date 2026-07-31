import { render } from '@testing-library/react'
import { describe, it, expect, beforeAll } from 'vitest'
import { MiniMap } from './MiniMap'
import { PoetStateProvider } from '../../pages/poet-state'
import type { PoetBundle } from '../../data/types'
import type { DynastyInfo, PoetTheme } from '../../themes/types'

// 同 trajectory.test.tsx：jsdom 缺 getTotalLength / matchMedia，从真实元素原型挂 mock
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

const bundle: PoetBundle = {
  poet: {
    id: 'libai',
    name: '李白',
    courtesyName: '太白',
    dynasty: 'tang',
    birth: { year: 701, place: '碎叶' },
    death: { year: 762, place: '当涂' },
    theme: 'libai',
    summary: { review: '评', stats: { cities: 2, works: '0', topOffice: '翰林供奉', age: 62 } },
    signature: ['a', 'b', 'c', 'd', 'e'],
    stops: [
      { year: 726, city: '扬州', event: '作《静夜思》', role: '布衣', source: 's' },
      { year: 744, city: '长安', event: '赐金放还', role: '翰林供奉', source: 's' },
    ],
    works: [],
  },
  cities: {
    扬州: { name: '扬州', modernName: '扬州', lon: 119.4, lat: 32.4, region: '淮南道' },
    长安: { name: '长安', modernName: '西安', lon: 108.94, lat: 34.34, region: '京畿道' },
  },
}

const dynasty: DynastyInfo = {
  id: 'tang',
  name: '唐',
  era: [618, 907],
  divisionName: '道',
  projection: { lon0: 72, lat0: 54.5, s: 25, sy: 29 },
  viewBox: '0 0 960 720',
}

const theme: PoetTheme = {
  accent: '#000',
  accentSoft: '#000',
  inkTone: '#000',
  paperTone: '#fff',
  seal: '#a00',
  motifs: [],
  calligraphy: 'liujian',
  brush: { kind: 'plain', colors: ['#333', '#999'], width: 2 },
  divider: '',
  inscription: { line: '', sub: '' },
  easterEggs: [],
}

describe('MiniMap 当前行迹标注', () => {
  it('年份旁标注当前城市（最新一个不超过当前年份的 stop）', () => {
    const { container } = render(
      <PoetStateProvider initialYear={750}>
        <MiniMap bundle={bundle} theme={theme} dynasty={dynasty} />
      </PoetStateProvider>,
    )
    expect(container.querySelector('.mini-map-year')?.textContent).toBe('750 · 长安')
  })
})
