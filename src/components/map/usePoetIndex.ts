import { useEffect, useState } from 'react'
import type { PoetIndexEntry } from '../../data/types'

export type PoetIndexState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; index: PoetIndexEntry[] }

export function usePoetIndex(retry = 0): PoetIndexState {
  const [state, setState] = useState<PoetIndexState>({ status: 'loading' })
  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    fetch('/data/index.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((index: PoetIndexEntry[]) => { if (!cancelled) setState({ status: 'loaded', index }) })
      .catch(() => { if (!cancelled) setState({ status: 'error' }) })
    return () => { cancelled = true }
  }, [retry])
  return state
}
