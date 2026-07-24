export function StrawHutHover({ position }: { position?: [number, number] }) {
  if (!position) return null
  const [x, y] = position
  return (
    <g className="straw-hut-group" style={{ transformOrigin: `${x}px ${y}px` }}>
      <path d={`M${x - 12},${y} L${x},${y - 16} L${x + 12},${y} Z`} className="straw-hut" />
      <path d={`M${x - 8},${y} v10 h16 v-10`} className="straw-hut" />
    </g>
  )
}
