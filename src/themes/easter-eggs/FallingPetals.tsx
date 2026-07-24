export function FallingPetals() {
  const delays = [0, 0.6, 1.2, 1.8, 2.4, 3]
  return (
    <div className="falling-petals" aria-hidden="true">
      {delays.map((d, i) => (
        <span
          key={i}
          className="petal"
          style={{ left: `${10 + i * 15}%`, animationDelay: `${d}s` }}
        />
      ))}
    </div>
  )
}
