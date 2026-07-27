export function SlowEnding({ position }: { position?: [number, number] }) {
  if (!position) return null
  const [x, y] = position
  return (
    <g className="slow-ending">
      <circle cx={x} cy={y} r={4} fill="var(--accent)" className="slow-dot slow-dot-1" />
      <circle cx={x + 10} cy={y} r={3} fill="var(--accent)" className="slow-dot slow-dot-2" />
      <circle cx={x + 18} cy={y} r={2} fill="var(--accent)" className="slow-dot slow-dot-3" />
    </g>
  )
}
