import { usePoetState } from '../../pages/poet-state'

export function HanlinSeal({ target }: { target?: string }) {
  const { year } = usePoetState()
  if (!target || year < Number(target)) return null
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" className="hanlin-seal" aria-label="翰林供奉">
      <rect width={64} height={64} rx={8} fill="var(--seal)" />
      <text x={32} y={30} fill="#f6f1e3">翰</text>
      <text x={32} y={54} fill="#f6f1e3">林</text>
    </svg>
  )
}
