import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Stop } from '../data/schemas'

interface PoetState {
  year: number
  hoveredStop: Stop | null
  openWork: string | null
  setYear: (y: number) => void
  setHoveredStop: (s: Stop | null) => void
  setOpenWork: (title: string | null) => void
}

const Ctx = createContext<PoetState | null>(null)

/** key={poetId} 使用本 Provider 时强制 remount，切换人物后 year/hoveredStop/openWork 全部重置 */
export function PoetStateProvider({ initialYear, children }: { initialYear: number; children: ReactNode }) {
  const [year, setYear] = useState(initialYear)
  const [hoveredStop, setHoveredStop] = useState<Stop | null>(null)
  const [openWork, setOpenWork] = useState<string | null>(null)
  return (
    <Ctx.Provider value={{ year, hoveredStop, openWork, setYear, setHoveredStop, setOpenWork }}>
      {children}
    </Ctx.Provider>
  )
}

export function usePoetState(): PoetState {
  const s = useContext(Ctx)
  if (!s) throw new Error('usePoetState must be used within PoetStateProvider')
  return s
}
