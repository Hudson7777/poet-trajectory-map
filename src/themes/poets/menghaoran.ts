import type { PoetTheme } from '../types'

/** 孟浩然 · 鹿门·春晓：春泥褐、新绿、淡粉。意象出自：隐居鹿门山 / 春晓 / 欲济无舟楫 */
export const menghaoranTheme: PoetTheme = {
  accent: '#7a9b62',
  accentSoft: '#a3b98a',
  inkTone: '#3a352c',
  paperTone: '#f5f1e6',
  seal: '#a0503c',
  motifs: ['peach', 'spring-rain', 'boat'],
  calligraphy: 'zhimang',
  brush: { kind: 'plain', colors: ['#8a7a5c', '#a39a80'], width: 2 },
  divider: '春眠不觉晓',
  inscription: { line: '春眠不觉晓', sub: '孟浩然 689—740' },
  easterEggs: [
    { id: 'falling-petals', type: 'quote-hover' },
    { id: 'lake-level', type: 'map-node', target: '岳阳' },
  ],
}
