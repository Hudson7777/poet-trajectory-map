import type { Work } from '../../data/schemas'

export function QuotesSection({ works }: { works: Work[] }) {
  const quotes = works.flatMap(w => w.famous.map(line => ({ line, title: w.title }))).slice(0, 5)
  return (
    <section className="quotes-section">
      <h2 className="section-title">精华名句</h2>
      <div className="quotes">
        {quotes.map(q => (
          <blockquote key={q.line} className="quote">
            <span className="quote-line font-calligraphy">{q.line}</span>
            <cite>《{q.title}》</cite>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
