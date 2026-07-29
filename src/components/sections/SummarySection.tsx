import type { Poet } from '../../data/schemas'
import { poetThemes } from '../../themes'
import { MotifIcon } from '../../themes/motifs/MotifIcon'

export function SummarySection({ poet, poetId = 'libai' }: { poet: Poet; poetId?: string }) {
  const theme = poetThemes[poetId] ?? poetThemes.libai
  const { review, stats } = poet.summary
  const items = [
    { label: '行迹城市', value: stats.cities },
    { label: '存世作品', value: stats.works },
    { label: '仕途最高', value: stats.topOffice },
    { label: '享年', value: stats.age },
  ]
  return (
    <section className="summary-section">
      <h2 className="section-title"><MotifIcon name={theme.motifs[0]} size={28} />其人</h2>
      <p className="review">{review}</p>
      <div className="stats">
        {items.map(i => (
          <div key={i.label} className="stat">
            <div className="stat-value font-calligraphy">{i.value}</div>
            <div className="stat-label">{i.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
