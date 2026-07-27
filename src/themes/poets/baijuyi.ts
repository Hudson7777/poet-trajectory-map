import type { PoetTheme } from '../types'

/** 白居易 · 江南·香山：杏花粉、春水绿。意象出自：乱花渐欲迷人眼 / 琵琶行 / 号香山居士 */
export const baijuyiTheme: PoetTheme = {
  accent: '#c07a86',
  accentSoft: '#d4a0a7',
  inkTone: '#2f2b28',
  paperTone: '#f7f2ea',
  seal: '#9e2b25',
  motifs: ['apricot', 'lute', 'incense-peak'],
  calligraphy: 'zhimang',
  brush: { kind: 'spring', colors: ['#7a9b62', '#c07a86'], width: 2.5 },
  divider: '乱花渐欲迷人眼',
  inscription: { line: '乱花渐欲迷人眼', sub: '白居易 772—846' },
  easterEggs: [
    { id: 'lute-notes', type: 'map-node', target: '浔阳' },
    { id: 'grass-sway', type: 'quote-hover' },
    { id: 'slow-ending', type: 'decoration', target: '洛阳' },
  ],
}
