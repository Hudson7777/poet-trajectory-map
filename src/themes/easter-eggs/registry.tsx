import type { ReactElement } from 'react'
import type { EasterEggConfig } from '../types'
import { HanlinSeal } from './HanlinSeal'
import { FallingPetals } from './FallingPetals'
import { GrassSway } from './GrassSway'
import { MoonRise } from './MoonRise'
import { FallingLeaves } from './FallingLeaves'
import { MistDrift } from './MistDrift'

export const easterEggComponents: Record<string, (props: { target?: string }) => ReactElement | null> = {
  'hanlin-seal': HanlinSeal,
  'falling-petals': FallingPetals,
  'grass-sway': GrassSway,
  'moon-rise': MoonRise,
  'falling-leaves': FallingLeaves,
  'mist-drift': MistDrift,
}

const SCOPE_MAP: Record<EasterEggConfig['type'], string> = {
  'quote-hover': 'quote',
  timeline: 'timeline',
}

export function renderEasterEggs(
  configs: EasterEggConfig[],
  scope: 'quote' | 'timeline',
) {
  return configs
    .filter(c => SCOPE_MAP[c.type] === scope)
    .map(c => {
      const C = easterEggComponents[c.id]
      return C ? <C key={c.id} target={c.target} /> : null
    })
}
