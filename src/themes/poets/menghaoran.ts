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
  divider:
    '<path d="M40 58 Q260 40 480 58 T920 56 T1160 58" fill="none" stroke="var(--ink)" stroke-width="1.3" opacity=".5"/>' +
    '<circle cx="200" cy="30" r="2.5" fill="var(--accent-soft)" opacity=".7"/>' +
    '<circle cx="360" cy="22" r="2" fill="var(--accent-soft)" opacity=".6"/>' +
    '<circle cx="560" cy="28" r="2.5" fill="var(--accent-soft)" opacity=".7"/>' +
    '<circle cx="760" cy="20" r="2" fill="var(--accent-soft)" opacity=".55"/>' +
    '<circle cx="960" cy="26" r="2.5" fill="var(--accent-soft)" opacity=".65"/>' +
    '<path d="M60 64 Q300 58 560 62 T1100 62" fill="none" stroke="var(--ink)" stroke-width="1" opacity=".3"/>',
  inscription: { line: '春眠不觉晓', sub: '孟浩然 689—740' },
  easterEggs: [
    { id: 'falling-petals', type: 'quote-hover' },
  ],
}
