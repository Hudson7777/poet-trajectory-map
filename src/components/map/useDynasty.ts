import { useEffect, useState } from 'react'
import type { DynastyInfo } from '../../themes/types'

export function useDynasty(dynastyId: string): DynastyInfo | null {
  const [dynasty, setDynasty] = useState<DynastyInfo | null>(null)
  useEffect(() => {
    fetch('/data/dynasties.json')
      .then(r => r.json())
      .then((all: DynastyInfo[]) => setDynasty(all.find(d => d.id === dynastyId) ?? null))
      .catch(() => setDynasty(null))
  }, [dynastyId])
  return dynasty
}
