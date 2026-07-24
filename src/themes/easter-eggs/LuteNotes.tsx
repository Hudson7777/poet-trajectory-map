export function LuteNotes({ position }: { position?: [number, number] }) {
  if (!position) return null
  const [x, y] = position
  return (
    <g className="lute-notes">
      <text x={x} y={y} className="lute-note" style={{ animationDelay: '0s' }}>♪</text>
      <text x={x + 10} y={y} className="lute-note" style={{ animationDelay: '1s' }}>♪</text>
      <text x={x - 10} y={y} className="lute-note" style={{ animationDelay: '2s' }}>♪</text>
    </g>
  )
}
