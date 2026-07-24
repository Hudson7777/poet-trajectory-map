import { useState } from 'react'

export function CatchMoon({ position }: { position?: [number, number] }) {
  const [offset, setOffset] = useState(0)
  const [x, y] = position ?? [0, 0]
  return (
    <g onMouseMove={e => setOffset(((e.clientX % 40) - 20) / 10)} className="catch-moon">
      <ellipse cx={x + offset * 3} cy={y + 34} rx={26} ry={7} fill="#d4af37" opacity={0.5}>
        <animate attributeName="opacity" values="0.5;0.3;0.5" dur="4s" repeatCount="indefinite" />
      </ellipse>
      <circle cx={x + offset * 3} cy={y} r={14} fill="#e8e4d8" stroke="#b8860b" strokeWidth={1.5} opacity={0.9} />
      <title>当涂 · 捉月传说</title>
    </g>
  )
}
