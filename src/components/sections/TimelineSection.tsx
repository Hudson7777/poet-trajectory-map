import { useEffect, useRef, useState } from 'react'
import type { Stop } from '../../data/schemas'
import { usePoetState } from '../../pages/poet-state'
import { visibleStops } from '../map/projection'
import { poetThemes } from '../../themes'
import { MotifIcon } from '../../themes/motifs/MotifIcon'
import { renderEasterEggs } from '../../themes/easter-eggs/registry'

export function TimelineSection({ stops, poetId }: { stops: Stop[]; poetId: string }) {
  const { year, hoveredStop, setHoveredStop, setYear } = usePoetState()
  const theme = poetThemes[poetId] ?? poetThemes.libai
  // 滚动进入视口后自上而下 stagger 展开；年份推进新解锁的节点挂载时同样播放
  const olRef = useRef<HTMLOListElement>(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const el = olRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); observer.disconnect() } },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  // 选中态：最新一个不超过当前年份的 stop，与 MiniMap 朱砂点同一语义（共用 visibleStops）
  const selected = visibleStops(stops, year).at(-1) ?? null
  return (
    <section className="timeline-section">
      <h2 className="section-title"><MotifIcon name={theme.motifs[0]} size={28} />生平年表</h2>
      <ol ref={olRef}>
        {stops.map((s, i) => (
          <li
            key={`${s.year}-${s.city}`}
            className={`${revealed ? 'tl-in ' : ''}${hoveredStop === s ? 'active ' : ''}${s === selected ? 'selected' : ''}`}
            style={{ animationDelay: `${Math.min(i * 35, 420)}ms` }}
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
