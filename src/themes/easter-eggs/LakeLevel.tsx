export function LakeLevel({ position }: { position?: [number, number] }) {
  if (!position) return null
  const [x, y] = position
  return (
    <ellipse cx={x} cy={y + 18} rx={30} ry={6} fill="none" stroke="#7a9b62" strokeWidth={1.5} className="lake-level" />
  )
}
