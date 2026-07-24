import type { PoetTheme } from '../types'

/** 李白 · 谪仙·明月：月白为底、青莲黛为墨、酒金为 accent。意象出自：举杯邀明月 / 将进酒 / 号青莲居士 / 仗剑去国 */
export const libaiTheme: PoetTheme = {
  accent: '#b8860b',
  accentSoft: '#d4af37',
  inkTone: '#2e3340',
  paperTone: '#e9e8e0',
  seal: '#9e2b25',
  motifs: ['moon', 'wine', 'lotus', 'sword'],
  calligraphy: 'liujian',
  easterEggs: [
    { id: 'catch-moon', type: 'map-node', target: '当涂' },
    { id: 'gold-trajectory', type: 'trajectory-style', style: 'gold' },
    { id: 'westward-suiye', type: 'decoration' },
    { id: 'hanlin-seal', type: 'timeline', target: '742' },
  ],
}
