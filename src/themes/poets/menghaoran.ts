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
  easterEggs: [
    { id: 'falling-petals', type: 'quote-hover' },
    { id: 'lake-level', type: 'map-node', target: '岳阳' },
  ],
}
