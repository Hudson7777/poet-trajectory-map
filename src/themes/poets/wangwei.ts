import type { PoetTheme } from '../types'

/** 王维 · 辋川·空山：青绿竹青、留白禅意。意象出自：独坐幽篁里 / 空山新雨后 / 弹琴复长啸 */
export const wangweiTheme: PoetTheme = {
  accent: '#5f7a6e',
  accentSoft: '#7a9b8a',
  inkTone: '#28323b',
  paperTone: '#f2f4ef',
  seal: '#9e2b25',
  motifs: ['bamboo', 'mountain', 'qin'],
  calligraphy: 'mashan',
  easterEggs: [
    { id: 'bamboo-sway', type: 'map-node', target: '辋川' },
    { id: 'zen-whitespace', type: 'decoration' },
    { id: 'mountain-ripple', type: 'map-node', target: '辋川' },
  ],
}
