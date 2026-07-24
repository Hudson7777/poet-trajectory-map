import { describe, it, expect } from 'vitest'
import { poetThemes, applyPoetTheme } from './index'
import type { PoetTheme } from './types'

const REQUIRED_TOKENS: (keyof PoetTheme)[] = ['accent', 'accentSoft', 'inkTone', 'paperTone', 'seal', 'motifs', 'calligraphy']

describe('poetThemes', () => {
  it.each(Object.keys(poetThemes))('%s 主题七类 token 齐全', id => {
    const theme = poetThemes[id]
    for (const key of REQUIRED_TOKENS) expect(theme[key], key).toBeTruthy()
    expect(theme.motifs.length).toBeGreaterThan(0)
    expect(theme.easterEggs.length).toBeGreaterThanOrEqual(2)
  })
  it('自动发现五人主题', () => {
    expect(Object.keys(poetThemes).sort()).toEqual(['baijuyi', 'dufu', 'libai', 'menghaoran', 'wangwei'])
  })
})

describe('applyPoetTheme', () => {
  it('设置 data-poet 与 CSS 变量', () => {
    applyPoetTheme(poetThemes.libai, 'libai')
    const el = document.documentElement
    expect(el.dataset.poet).toBe('libai')
    expect(el.style.getPropertyValue('--accent')).toBe(poetThemes.libai.accent)
  })
})
