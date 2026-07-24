export interface EasterEggConfig {
  id: string
  type: 'map-node' | 'quote-hover' | 'timeline' | 'decoration' | 'trajectory-style'
  target?: string
  style?: 'ink' | 'gold' | 'beacon'
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
