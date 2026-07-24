import { useEffect, useState } from 'react'
import type { PoetBundle } from '../../data/types'

export type BundleState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; bundle: PoetBundle }

export function usePoetBundle(dynasty: string, poetId: string, retry = 0): BundleState {
  const [state, setState] = useState<BundleState>({ status: 'loading' })
  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    fetch(`/data/${dynasty}/${poetId}.json`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(bundle => { if (!cancelled) setState({ status: 'loaded', bundle }) })
      .catch(() => { if (!cancelled) setState({ status: 'error' }) })
    return () => { cancelled = true }
  }, [dynasty, poetId, retry])
  return state
}
