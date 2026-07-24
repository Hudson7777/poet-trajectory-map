export function GrassSway() {
  return (
    <div className="grass-sway" aria-hidden="true">
      {[0, 1, 2, 3].map(i => (
        <span key={i} className="grass-blade" style={{ left: `${20 + i * 18}%`, animationDelay: `${i * 0.4}s` }} />
      ))}
    </div>
  )
}
