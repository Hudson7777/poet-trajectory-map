export type BrushKind = 'gold' | 'dry' | 'fade' | 'plain' | 'spring'

export interface BrushStyle {
  kind: BrushKind
  colors: [string, string]
  width: number
}

export interface EasterEggConfig {
  id: string
  type: 'map-node' | 'quote-hover' | 'timeline' | 'decoration'
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
  calligraphy: 'liujian' | 'longcang' | 'mashan' | 'zhimang'
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
}
