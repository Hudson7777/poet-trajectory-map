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
  brush: { kind: 'gold', colors: ['#b8860b', '#d4af37'], width: 2.5 },
  divider:
    '<circle cx="180" cy="34" r="16" fill="none" stroke="var(--accent)" stroke-width="1.5" opacity=".75"/>' +
    '<path d="M40 58 Q300 50 560 58 T1080 56" fill="none" stroke="var(--ink)" stroke-width="1.5" opacity=".55"/>' +
    '<path d="M60 64 Q320 56 580 64 T1100 62" fill="none" stroke="var(--ink)" stroke-width="1" opacity=".35"/>' +
    '<path d="M1120 30 q8 -6 16 0 t16 0" fill="none" stroke="var(--accent)" stroke-width="1.2" opacity=".6"/>',
  inscription: { line: '天生我材必有用', sub: '李白 701—762' },
  easterEggs: [
    { id: 'catch-moon', type: 'map-node', target: '当涂' },
    { id: 'westward-suiye', type: 'decoration' },
    { id: 'hanlin-seal', type: 'timeline', target: '742' },
    { id: 'moon-rise', type: 'quote-hover' },
  ],
}
