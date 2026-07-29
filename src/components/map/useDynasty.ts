import { useEffect, useState } from 'react'
import type { DynastyInfo } from '../../themes/types'

export type DynastyState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; dynasty: DynastyInfo }

export function useDynasty(dynastyId: string, retry = 0): DynastyState {
  const [state, setState] = useState<DynastyState>({ status: 'loading' })
  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    fetch('/data/dynasties.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((all: DynastyInfo[]) => {
        if (cancelled) return
        const found = all.find(d => d.id === dynastyId) ?? null
        if (found) setState({ status: 'loaded', dynasty: found })
        else setState({ status: 'error' })
      })
      .catch(() => { if (!cancelled) setState({ status: 'error' }) })
    return () => { cancelled = true }
  }, [dynastyId, retry])
  return state
}

export type DynastiesState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; dynasties: DynastyInfo[] }

export function useDynasties(retry = 0): DynastiesState {
  const [state, setState] = useState<DynastiesState>({ status: 'loading' })
  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    fetch('/data/dynasties.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((dynasties: DynastyInfo[]) => { if (!cancelled) setState({ status: 'loaded', dynasties }) })
      .catch(() => { if (!cancelled) setState({ status: 'error' }) })
    return () => { cancelled = true }
  }, [retry])
  return state
}
