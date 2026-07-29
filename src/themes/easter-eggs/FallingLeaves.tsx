export function FallingLeaves() {
  const delays = [0, 1.1, 2.3, 3.4]
  return (
    <div className="falling-leaves" aria-hidden="true">
      {delays.map((d, i) => (
        <span key={i} className="leaf" style={{ left: `${14 + i * 22}%`, animationDelay: `${d}s` }} />
      ))}
    </div>
  )
}
