import type { Stop } from '../../data/schemas'

interface CityMarkerProps {
  stop: Stop
  position: [number, number]
  highlighted: boolean
  dimmed: boolean
  onHover: (stop: Stop | null) => void
}

export function CityMarker({ stop, position, highlighted, dimmed, onHover }: CityMarkerProps) {
  const [x, y] = position
  const r = highlighted ? 12 : 8
  return (
    <g
      className={`city-marker${highlighted ? ' highlighted' : ''}`}
      opacity={dimmed ? 0.25 : 1}
      onMouseEnter={() => onHover(stop)}
      onMouseLeave={() => onHover(null)}
    >
      {stop.uncertain ? (
        <circle cx={x} cy={y} r={r} fill="none" stroke="var(--seal)" strokeWidth={2} strokeDasharray="4 3" />
      ) : (
        <>
          <circle cx={x} cy={y} r={r} fill="var(--seal)" />
          <circle cx={x} cy={y} r={r / 2.5} fill="var(--paper)" />
        </>
      )}
      <text x={x + 14} y={y - 10} className="city-year">{stop.year}</text>
      <text x={x + 14} y={y + 12} className="city-event">{stop.city} · {stop.event}</text>
      {stop.uncertain && <text x={x - 12} y={y - 14} className="uncertain-tag">存疑</text>}
      {stop.uncertain && <title>{stop.uncertain}</title>}
    </g>
  )
}
