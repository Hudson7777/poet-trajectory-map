import type { PoetTheme } from '../types'

/** 杜甫 · 诗史·烽燧：赭石沉郁、烽烟灰。意象出自：安史之乱 / 茅屋为秋风所破歌 / 晚年孤舟漂泊 */
export const dufuTheme: PoetTheme = {
  accent: '#8a5a3b',
  accentSoft: '#a97a56',
  inkTone: '#33302b',
  paperTone: '#f0ece1',
  seal: '#8f2d23',
  motifs: ['beacon', 'hut', 'boat'],
  calligraphy: 'longcang',
  easterEggs: [
    { id: 'beacon-trajectory', type: 'trajectory-style', style: 'beacon', trigger: { yearGte: 755 } },
    { id: 'straw-hut-hover', type: 'map-node', target: '成都' },
    { id: 'snow-mountain', type: 'decoration' },
  ],
}
