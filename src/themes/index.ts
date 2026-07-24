import type { PoetTheme } from './types'

const modules = import.meta.glob('./poets/*.ts', { eager: true }) as Record<string, Record<string, PoetTheme>>

export const poetThemes: Record<string, PoetTheme> = Object.fromEntries(
  Object.entries(modules).flatMap(([path, mod]) => {
    const id = path.replace('./poets/', '').replace('.ts', '')
    const theme = Object.values(mod)[0]
    return theme ? [[id, theme]] : []
  }),
)

export const CALLIGRAPHY_FONTS: Record<PoetTheme['calligraphy'], string> = {
  liujian: '"Liu Jian Mao Cao"',
  longcang: '"Long Cang"',
  mashan: '"Ma Shan Zheng"',
  zhimang: '"Zhi Mang Xing"',
}

export function applyPoetTheme(theme: PoetTheme, poetId: string): void {
  const el = document.documentElement
  el.dataset.poet = poetId
  el.style.setProperty('--accent', theme.accent)
  el.style.setProperty('--accent-soft', theme.accentSoft)
  el.style.setProperty('--ink', theme.inkTone)
  el.style.setProperty('--paper', theme.paperTone)
  el.style.setProperty('--seal', theme.seal)
  el.style.setProperty('--font-calligraphy', CALLIGRAPHY_FONTS[theme.calligraphy])
}
