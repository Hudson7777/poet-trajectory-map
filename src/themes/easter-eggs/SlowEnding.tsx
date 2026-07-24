export function SlowEnding() {
  return (
    <g className="slow-ending">
      <circle cx={0} cy={0} r={3} fill="var(--accent)" opacity={0.6} className="slow-dot slow-dot-1" />
      <circle cx={12} cy={0} r={2} fill="var(--accent)" opacity={0.4} className="slow-dot slow-dot-2" />
      <circle cx={22} cy={0} r={1} fill="var(--accent)" opacity={0.2} className="slow-dot slow-dot-3" />
    </g>
  )
}
