import { describe, it, expect } from 'vitest'

// 同 PoetPage.test：直接读真实构建产物，避免维护夹具（跑前需 build-data）
const dataModules = import.meta.glob('../../public/data/*.json', { eager: true, import: 'default' }) as Record<string, unknown>

describe('构建产物纪律', () => {
  it('index.json 按出生年升序', () => {
    const index = dataModules['../../public/data/index.json'] as { birthYear: number }[]
    const years = index.map(p => p.birthYear)
    expect(years).toEqual([...years].sort((a, b) => a - b))
  })
  it('dynasties.json 各朝代声明 calligraphy（导航朝代字体数据驱动）', () => {
    const dynasties = dataModules['../../public/data/dynasties.json'] as { calligraphy?: string }[]
    for (const d of dynasties) expect(d.calligraphy).toBeTruthy()
  })
})
