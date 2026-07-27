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
  brush: { kind: 'fade', colors: ['#5f7a6e', '#7a9b8a'], width: 2 },
  divider:
    '<path d="M40 56 L240 28 L420 50 L620 22 L820 52 L1020 30 L1160 54" fill="none" stroke="var(--ink)" stroke-width="1.2" opacity=".5"/>' +
    '<path d="M180 60 V40 M180 40 h8 M180 48 h-6" fill="none" stroke="var(--accent)" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M920 60 V38 M920 38 h8 M920 46 h-6 M920 52 h8" fill="none" stroke="var(--accent)" stroke-width="1.4" stroke-linecap="round"/>' +
    '<path d="M60 62 Q300 56 560 60 T1100 60" fill="none" stroke="var(--ink)" stroke-width="1" opacity=".3"/>',
  inscription: { line: '行到水穷处，坐看云起时', sub: '王维 701—761' },
  easterEggs: [
    { id: 'bamboo-sway', type: 'map-node', target: '辋川' },
    { id: 'zen-whitespace', type: 'decoration' },
    { id: 'mountain-ripple', type: 'map-node', target: '辋川' },
  ],
}
