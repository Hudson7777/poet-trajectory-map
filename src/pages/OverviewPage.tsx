import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { PoetIndexEntry } from '../data/types'
import { MotifIcon } from '../themes/motifs/MotifIcon'
import { poetThemes, resetPoetTheme, CALLIGRAPHY_FONTS } from '../themes'
import { PaperTexture } from '../components/PaperTexture'

export function OverviewPage() {
  const [index, setIndex] = useState<PoetIndexEntry[]>([])
  const [error, setError] = useState(false)
  useEffect(() => {
    fetch('/data/index.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(setIndex)
      .catch(() => setError(true))
  }, [])
  useEffect(() => { resetPoetTheme() }, [])
  return (
    <main className="overview">
      <PaperTexture />
      <h1 className="site-title font-calligraphy">文人生命轨迹地图</h1>
      <nav className="dynasty-switcher">
        <span className="dynasty active">唐</span>
        {['宋', '元', '明', '清'].map(d => (
          <span key={d} className="dynasty disabled" title="敬请期待">{d}</span>
        ))}
      </nav>
      {error ? (
        <p className="load-error">索引加载失败，请刷新重试。</p>
      ) : (
        <div className="poet-wall">
          {index.map((p, i) => {
            const t = poetThemes[p.theme]
            const callig = t ? { fontFamily: `${CALLIGRAPHY_FONTS[t.calligraphy]}, "Kaiti SC", "STKaiti", "KaiTi", serif` } : undefined
            return (
              <Link key={p.id} to={`/poets/${p.dynasty}/${p.id}`} className="poet-card mounted-card" style={{ animationDelay: `${Math.min(i * 90, 600)}ms` }}>
                <MotifIcon name={t?.motifs[0] ?? 'moon'} size={48} />
                <span className="poet-name font-calligraphy" style={callig}>{p.name}</span>
                <span className="poet-years font-calligraphy" style={callig}>{p.birthYear} — {p.deathYear}</span>
                <span className="poet-quote">{p.representativeLine}</span>
              </Link>
            )
          })}
        </div>
      )}
      <footer className="project-note">
        生平依据正史本传与权威年谱；地名坐标据谭其骧《中国历史地图集》复核；
        标「存疑」者为学界尚有争议之点位，宁缺毋滥。
      </footer>
    </main>
  )
}
