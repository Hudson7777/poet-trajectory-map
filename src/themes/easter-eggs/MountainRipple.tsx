import { useState } from 'react'

export function MountainRipple({ position }: { position?: [number, number] }) {
  const [rippling, setRippling] = useState(false)
  if (!position) return null
  const [x, y] = position
  return (
    <g
      onClick={() => {
        if (rippling) return
        setRippling(true)
        setTimeout(() => setRippling(false), 800)
      }}
    >
      <circle cx={x} cy={y} r={6} fill="var(--accent)" opacity={0.4} className="mountain-dot" />
      {rippling && (
        <circle cx={x} cy={y} r={10} fill="none" stroke="var(--accent)" strokeWidth={1.5} className="rippling" />
      )}
    </g>
  )
}
