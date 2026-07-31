import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Work } from '../../data/schemas'
import { usePoetState } from '../../pages/poet-state'
import { poetThemes } from '../../themes'
import { MotifIcon } from '../../themes/motifs/MotifIcon'
import { groupIntoVolumes } from './volumeGrouping'
import { VOLUME_NAMES } from './volumeNames'

export function WorksSection({ works, poetId = 'libai', birthYear }: { works: Work[]; poetId?: string; birthYear?: number }) {
  const { openWork, setOpenWork } = usePoetState()
  const theme = poetThemes[poetId] ?? poetThemes.libai
  const volumes = groupIntoVolumes(works, birthYear)
  let cardIndex = 0
  const volumeNames = VOLUME_NAMES[poetId]

  // 滚动进入视口后卡片按序渐入（一次性，触发后不再隐藏）
  const sectionRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect() } },
      { threshold: 0.05 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!openWork) return
    document.getElementById(`work-${openWork}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [openWork])

  return (
    <section ref={sectionRef} className={`works-section${revealed ? ' wk-revealed' : ''}`}>
      <h2 className="section-title"><MotifIcon name={theme.motifs[0]} size={28} />作品集</h2>
      {volumes.map((vol, volIndex) => (
        <div key={vol.title} className="volume">
          <div className="volume-header">
            <span className="volume-title font-calligraphy">{vol.title}</span>
            {volumeNames?.[volIndex] && (
              <span className="volume-subtitle">{volumeNames[volIndex]}</span>
            )}
            <span className="volume-years font-calligraphy">{vol.startYear}—{vol.endYear}</span>
          </div>
          {vol.works.map(w => {
            const open = openWork === w.title
            const idx = cardIndex++
            return (
              <article
                key={`${w.title}-${w.year}`}
                id={`work-${w.title}`}
                className={`album-card mounted-card${open ? ' open' : ''}`}
                style={{ '--wk-i': idx } as CSSProperties}
              >
                <header onClick={() => setOpenWork(open ? null : w.title)}>
                  <div className="album-meta">
                    <span className="album-year font-calligraphy">{w.year}</span>
                    <span className="album-city">{w.city}</span>
                    {birthYear != null && <span className="album-age">时年 {w.year - birthYear + 1} 岁</span>}
                    <span className="album-genre">{w.genre}</span>
                  </div>
                  <h3 className="album-title font-calligraphy">《{w.title}》</h3>
                </header>
                {open && (
                  <div className="album-detail">
                    <p className="work-text">{w.text}</p>
                    <p className="work-background">{w.background}</p>
                    <p className="work-source">出处：{w.source}</p>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      ))}
    </section>
  )
}
