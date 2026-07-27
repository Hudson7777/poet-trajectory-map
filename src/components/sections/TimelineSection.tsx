import type { Stop } from '../../data/schemas'
import { usePoetState } from '../../pages/poet-state'
import { poetThemes } from '../../themes'
import { MotifIcon } from '../../themes/motifs/MotifIcon'
import { renderEasterEggs } from '../../themes/easter-eggs/registry'

export function TimelineSection({ stops, poetId }: { stops: Stop[]; poetId: string }) {
  const { hoveredStop, setHoveredStop, setYear } = usePoetState()
  const theme = poetThemes[poetId] ?? poetThemes.libai
  return (
    <section className="timeline-section">
      <h2 className="section-title"><MotifIcon name={theme.motifs[0]} size={20} />生平年表</h2>
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
      {renderEasterEggs(theme.easterEggs, 'timeline')}
    </section>
  )
}
