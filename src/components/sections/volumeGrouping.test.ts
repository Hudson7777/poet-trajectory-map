import { describe, it, expect } from 'vitest'
import { groupIntoVolumes } from './volumeGrouping'
import type { Work } from '../../data/schemas'

function work(title: string, year: number): Work {
  return {
    title,
    year,
    city: '扬州',
    genre: '诗',
    text: 'text',
    background: 'bg',
    famous: [],
    source: 's',
  }
}

describe('groupIntoVolumes', () => {
  it('10 首跨 30 年按 >6 年间隔正确分卷', () => {
    // 726, 727, 728, 729, 730, 731（6 首，满卷）→ 新卷
    // 740（与 731 差 9 >6，开新卷）, 741, 742, 743
    const works = [
      work('一', 726), work('二', 727), work('三', 728), work('四', 729),
      work('五', 730), work('六', 731), work('七', 740), work('八', 741),
      work('九', 742), work('十', 743),
    ]
    const volumes = groupIntoVolumes(works)
    expect(volumes).toHaveLength(2)
    expect(volumes[0].title).toBe('卷一')
    expect(volumes[0].startYear).toBe(726)
    expect(volumes[0].endYear).toBe(731)
    expect(volumes[0].works).toHaveLength(6)
    expect(volumes[1].title).toBe('卷二')
    expect(volumes[1].startYear).toBe(740)
    expect(volumes[1].endYear).toBe(743)
    expect(volumes[1].works).toHaveLength(4)
  })

  it('相邻年份差 >6 即开新卷（即使未满 6 首）', () => {
    const works = [
      work('一', 726), work('二', 727), work('三', 750),
    ]
    const volumes = groupIntoVolumes(works)
    expect(volumes).toHaveLength(2)
    expect(volumes[0].works).toHaveLength(2)
    expect(volumes[1].works).toHaveLength(1)
    expect(volumes[1].startYear).toBe(750)
  })

  it('中文卷号正确（卷一/卷二/卷三）', () => {
    // 每卷 6 首，3 卷 = 18 首
    const years: number[] = []
    let y = 720
    for (let v = 0; v < 3; v++) {
      for (let i = 0; i < 6; i++) years.push(y++)
    }
    const works = years.map((yr, i) => work(`w${i}`, yr))
    const volumes = groupIntoVolumes(works)
    expect(volumes.map(v => v.title)).toEqual(['卷一', '卷二', '卷三'])
  })

  it('空数组返回空数组', () => {
    expect(groupIntoVolumes([])).toEqual([])
  })

  it('未排序的输入按年份升序归卷', () => {
    const works = [work('后', 750), work('先', 726)]
    const volumes = groupIntoVolumes(works)
    expect(volumes).toHaveLength(2)
    expect(volumes[0].startYear).toBe(726)
    expect(volumes[0].title).toBe('卷一')
  })
})
