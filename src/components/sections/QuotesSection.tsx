import type { Poet } from '../../data/schemas'
import { poetThemes } from '../../themes'
import { MotifIcon } from '../../themes/motifs/MotifIcon'
import { renderEasterEggs } from '../../themes/easter-eggs/registry'

export function QuotesSection({ poet, poetId }: { poet: Poet; poetId: string }) {
  const theme = poetThemes[poetId] ?? poetThemes.libai
  const quotes = poet.signature.map(line => ({
    line,
    title: poet.works.find(w => w.famous.includes(line))?.title ?? '',
  }))
  return (
    <section className="quotes-section">
      <h2 className="section-title"><MotifIcon name={theme.motifs[0]} size={28} />精华名句</h2>
      <div className="quotes">
        {quotes.map(q => (
          <blockquote key={q.line} className="quote">
            <span className="quote-line font-calligraphy">{q.line}</span>
            <cite>《{q.title}》</cite>
          </blockquote>
        ))}
      </div>
      {renderEasterEggs(theme.easterEggs, 'quote')}
    </section>
  )
}
