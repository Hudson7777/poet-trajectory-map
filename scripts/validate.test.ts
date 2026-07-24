import { describe, it, expect } from 'vitest'
import { validatePoet } from './validate'
import type { Poet, CityEntry, DynastyEntry } from '../src/data/types'

const dynasty: DynastyEntry = {
  id: 'tang', name: '唐', era: [618, 907], divisionName: '道',
  basemap: 'geo/tang/basemap.svg', cities: 'geo/tang/cities.yaml',
  projection: { lon0: 72, lat0: 54.5, s: 25, sy: 29 },
  viewBox: '0 0 1650 1130',
}
const cities: CityEntry[] = [
  { name: '长安', modernName: '西安', lon: 108.94, lat: 34.34, region: '京畿道' },
  { name: '洛阳', modernName: '洛阳', lon: 112.45, lat: 34.62, region: '都畿道' },
  { name: '扬州', modernName: '扬州', lon: 119.41, lat: 32.39, region: '淮南道' },
]
const basePoet: Poet = {
  id: 'libai', name: '李白', courtesyName: '太白', dynasty: 'tang',
  birth: { year: 701, place: '碎叶' }, death: { year: 762, place: '当涂' },
  theme: 'libai',
  summary: { review: '评传', stats: { cities: 18, works: '存诗约千首', topOffice: '翰林供奉', age: 61 } },
  stops: [
    { year: 726, city: '扬州', event: '作《静夜思》', role: '布衣', source: '《李太白全集》卷六' },
    { year: 742, city: '长安', event: '供奉翰林', role: '翰林供奉', source: '《旧唐书·文苑传》' },
  ],
  works: [
    { title: '静夜思', year: 726, city: '扬州', genre: '诗', text: '床前明月光，疑是地上霜。举头望明月，低头思故乡。', background: '开元十四年旅寓扬州作', famous: ['床前明月光'], source: '《李太白全集》卷六' },
  ],
}

describe('validatePoet', () => {
  it('合法数据无错误', () => {
    expect(validatePoet(basePoet, cities, dynasty)).toEqual([])
  })
  it('stops 未按年份升序报错', () => {
    const poet = { ...basePoet, stops: [basePoet.stops[1], basePoet.stops[0]] }
    expect(validatePoet(poet, cities, dynasty)[0]).toMatch('升序')
  })
  it('stop 城市未注册报错', () => {
    const poet = { ...basePoet, stops: [{ ...basePoet.stops[0], city: '登州' }] }
    expect(validatePoet(poet, cities, dynasty)[0]).toMatch('未注册')
  })
  it('作品年份超出生卒年报错', () => {
    const poet = { ...basePoet, works: [{ ...basePoet.works[0], year: 700 }] }
    expect(validatePoet(poet, cities, dynasty)[0]).toMatch('生卒年')
  })
  it('作品年份超出朝代纪元报错', () => {
    const poet = { ...basePoet, works: [{ ...basePoet.works[0], year: 960 }] }
    expect(validatePoet(poet, cities, dynasty).some(e => e.includes('纪元'))).toBe(true)
  })
  it('名句不在原文中报错', () => {
    const poet = { ...basePoet, works: [{ ...basePoet.works[0], famous: ['不存在的句子'] }] }
    expect(validatePoet(poet, cities, dynasty)[0]).toMatch('不在原文')
  })
})
