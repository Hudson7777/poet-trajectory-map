import { useEffect } from 'react'
import type { Work } from '../../data/schemas'
import { usePoetState } from '../../pages/poet-state'
import { poetThemes } from '../../themes'
import { MotifIcon } from '../../themes/motifs/MotifIcon'

export function WorksSection({ works, poetId = 'libai' }: { works: Work[]; poetId?: string }) {
  const { openWork, setOpenWork } = usePoetState()
  const theme = poetThemes[poetId] ?? poetThemes.libai

  useEffect(() => {
    if (!openWork) return
    document.getElementById(`work-${openWork}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [openWork])

  return (
    <section className="works-section">
      <h2 className="section-title"><MotifIcon name={theme.motifs[0]} size={20} />作品集</h2>
      {works.map(w => (
        <article key={`${w.title}-${w.year}`} id={`work-${w.title}`} className="work-card mounted-card">
          <header onClick={() => setOpenWork(openWork === w.title ? null : w.title)}>
            <span className="work-year font-calligraphy">{w.year}</span>
            <h3>《{w.title}》</h3>
            <span className="work-city">{w.city}</span>
            <span className="work-genre">{w.genre}</span>
          </header>
          {openWork === w.title && (
            <div className="work-detail">
              <p className="work-text">{w.text}</p>
              <p className="work-background">{w.background}</p>
              <p className="work-source">出处：{w.source}</p>
            </div>
          )}
        </article>
      ))}
    </section>
  )
}
