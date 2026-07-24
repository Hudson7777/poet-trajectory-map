import type { Stop } from '../../data/schemas'
import { usePoetState } from '../../pages/poet-state'

export function TimelineSection({ stops }: { stops: Stop[] }) {
  const { hoveredStop, setHoveredStop, setYear } = usePoetState()
  return (
    <section className="timeline-section">
      <h2 className="section-title">生平年表</h2>
      <ol>
        {stops.map(s => (
          <li
            key={`${s.year}-${s.city}`}
            className={hoveredStop === s ? 'active' : ''}
            onMouseEnter={() => setHoveredStop(s)}
            onMouseLeave={() => setHoveredStop(null)}
            onClick={() => setYear(s.year)}
          >
            <span className="tl-year font-calligraphy">{s.year}</span>
            <span className="tl-event">{s.city} · {s.event}</span>
            <span className="tl-role">{s.role}</span>
            {s.uncertain && <span className="tl-uncertain" title={s.uncertain}>存疑</span>}
          </li>
        ))}
      </ol>
    </section>
  )
}
