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

export const THEME_VARS = ['--accent', '--accent-soft', '--ink', '--paper', '--seal', '--font-calligraphy'] as const

export function applyPoetTheme(theme: PoetTheme, poetId: string): void {
  const el = document.documentElement
  el.dataset.poet = poetId
  const vars: Record<(typeof THEME_VARS)[number], string> = {
    '--accent': theme.accent,
    '--accent-soft': theme.accentSoft,
    '--ink': theme.inkTone,
    '--paper': theme.paperTone,
    '--seal': theme.seal,
    '--font-calligraphy': CALLIGRAPHY_FONTS[theme.calligraphy],
  }
  for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v)
}

/** 离开人物页（回总览）时复位根变量，避免上一人主题泄漏到总览页 */
export function resetPoetTheme(): void {
  const el = document.documentElement
  delete el.dataset.poet
  for (const v of THEME_VARS) el.style.removeProperty(v)
}
