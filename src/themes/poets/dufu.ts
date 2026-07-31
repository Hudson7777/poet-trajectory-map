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
  brush: { kind: 'dry', colors: ['#5a4632', '#8a5a3b'], width: 3 },
  divider:
    '<path d="M580 60 L620 24 L660 60 Z" fill="none" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round" opacity=".7"/>' +
    '<path d="M620 24 Q624 10 618 2 M628 26 Q634 12 626 4" fill="none" stroke="var(--accent)" stroke-width="1.2" opacity=".6"/>' +
    '<path d="M40 56 Q300 48 560 56 T1120 54" fill="none" stroke="var(--ink)" stroke-width="1" opacity=".35"/>' +
    '<path d="M620 60 L620 40 M640 60 L640 44" fill="none" stroke="var(--ink)" stroke-width="1" opacity=".4"/>',
  inscription: { line: '无边落木萧萧下', sub: '杜甫 712—770' },
  easterEggs: [
    { id: 'falling-leaves', type: 'quote-hover' },
  ],
}
