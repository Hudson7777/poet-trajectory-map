export function BambooSway({ position }: { position?: [number, number] }) {
  if (!position) return null
  const [x, y] = position
  return (
    <g className="bamboo-sway" style={{ transformOrigin: `${x}px ${y + 30}px` }}>
      <path d={`M${x},${y + 30} V${y - 30} M${x},${y} h8 M${x},${y + 12} h-6`} className="bamboo-stem" />
      <path d={`M${x + 16},${y + 30} V${y - 24} M${x + 16},${y + 4} h-8 M${x + 16},${y + 16} h8`} className="bamboo-stem" />
    </g>
  )
}
