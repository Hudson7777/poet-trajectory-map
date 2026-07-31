import type { PoetTheme } from '../types'

/** 白居易 · 江南·香山：杏花粉、春水绿。意象出自：乱花渐欲迷人眼 / 琵琶行 / 号香山居士 */
export const baijuyiTheme: PoetTheme = {
  accent: '#c07a86',
  accentSoft: '#d4a0a7',
  inkTone: '#2f2b28',
  paperTone: '#f7f2ea',
  seal: '#9e2b25',
  motifs: ['apricot', 'lute', 'incense-peak'],
  calligraphy: 'wenkai',
  brush: { kind: 'spring', colors: ['#7a9b62', '#c07a86'], width: 2.5 },
  divider:
    '<path d="M40 50 q30 -8 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="var(--ink)" stroke-width="1.2" opacity=".5"/>' +
    '<path d="M980 56 q4 -22 22 -26 M998 30 q8 -6 14 0 M1006 38 l4 -6" fill="none" stroke="var(--accent)" stroke-width="1.3" stroke-linecap="round" opacity=".7"/>' +
    '<circle cx="1012" cy="28" r="3" fill="var(--accent-soft)" opacity=".7"/>' +
    '<circle cx="1024" cy="32" r="2.5" fill="var(--accent-soft)" opacity=".6"/>' +
    '<path d="M60 60 Q300 54 560 58 T1100 58" fill="none" stroke="var(--ink)" stroke-width="1" opacity=".3"/>',
  inscription: { line: '乱花渐欲迷人眼', sub: '白居易 772—846' },
  easterEggs: [
    { id: 'grass-sway', type: 'quote-hover' },
  ],
}
