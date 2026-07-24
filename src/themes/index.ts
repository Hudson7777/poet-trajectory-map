import type { PoetTheme } from './types'

export const poetThemes: Record<string, PoetTheme> = {
  libai: {
    accent: '#b8860b', accentSoft: '#d4af37', inkTone: '#2e3340', paperTone: '#e9e8e0',
    seal: '#9e2b25', motifs: ['moon'], calligraphy: 'liujian', easterEggs: [],
  },
}

export function applyPoetTheme(_theme: PoetTheme, _poetId: string): void {}
