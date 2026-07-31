export type BrushKind = 'gold' | 'dry' | 'fade' | 'plain' | 'spring'

export interface BrushStyle {
  kind: BrushKind
  colors: [string, string]
  width: number
}

export type CalligraphyKind = 'liujian' | 'longcang' | 'mashan' | 'zhimang' | 'wenkai'

export interface EasterEggConfig {
  id: string
  type: 'quote-hover' | 'timeline'
  target?: string
  trigger?: { yearGte: number }
}

export interface PoetTheme {
  accent: string
  accentSoft: string
  inkTone: string
  paperTone: string
  seal: string
  motifs: string[]
  calligraphy: CalligraphyKind
  brush: BrushStyle
  divider: string
  inscription: { line: string; sub: string }
  easterEggs: EasterEggConfig[]
}

export interface DynastyInfo {
  id: string
  name: string
  era: [number, number]
  divisionName: string
  projection: { lon0: number; lat0: number; s: number; sy: number }
  viewBox: string
  calligraphy?: CalligraphyKind
}
