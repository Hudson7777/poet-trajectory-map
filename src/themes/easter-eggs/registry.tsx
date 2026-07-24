import type { ReactElement } from 'react'
import type { EasterEggConfig } from '../types'
import { CatchMoon } from './CatchMoon'
import { WestwardSuiye } from './WestwardSuiye'
import { HanlinSeal } from './HanlinSeal'
import { StrawHutHover } from './StrawHutHover'
import { BambooSway } from './BambooSway'
import { MountainRipple } from './MountainRipple'
import { FallingPetals } from './FallingPetals'
import { LuteNotes } from './LuteNotes'
import { LakeLevel } from './LakeLevel'
import { SnowMountain } from './SnowMountain'
import { ZenWhitespace } from './ZenWhitespace'
import { GrassSway } from './GrassSway'
import { SlowEnding } from './SlowEnding'

export const easterEggComponents: Record<string, (props: { target?: string; position?: [number, number] }) => ReactElement | null> = {
  'catch-moon': CatchMoon,
  'westward-suiye': WestwardSuiye,
  'hanlin-seal': HanlinSeal,
  'straw-hut-hover': StrawHutHover,
  'bamboo-sway': BambooSway,
  'mountain-ripple': MountainRipple,
  'falling-petals': FallingPetals,
  'lute-notes': LuteNotes,
  'lake-level': LakeLevel,
  'snow-mountain': SnowMountain,
  'zen-whitespace': ZenWhitespace,
  'grass-sway': GrassSway,
  'slow-ending': SlowEnding,
}

const SCOPE_MAP: Partial<Record<EasterEggConfig['type'], string>> = {
  'map-node': 'map',
  decoration: 'map',
  'quote-hover': 'quote',
  timeline: 'timeline',
  // 'trajectory-style' 不在此渲染，由 HeroMap 通用处理
}

export function renderEasterEggs(
  configs: EasterEggConfig[],
  scope: 'map' | 'quote' | 'timeline',
  resolvePosition?: (cityName: string) => [number, number] | undefined,
) {
  return configs
    .filter(c => SCOPE_MAP[c.type] === scope)
    .map(c => {
      const C = easterEggComponents[c.id]
      if (!C) return null
      const position = c.target ? resolvePosition?.(c.target) : undefined
      return <C key={c.id} target={c.target} position={position} />
    })
}
