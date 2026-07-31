import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MotifIcon } from '../themes/motifs/MotifIcon'
import { poetThemes, resetPoetTheme, CALLIGRAPHY_FONTS, calligraphyFontStack } from '../themes'
import { PaperTexture } from '../components/PaperTexture'
import { usePoetIndex } from '../components/map/usePoetIndex'
import { useDynasties } from '../components/map/useDynasty'

export function OverviewPage() {
  const indexState = usePoetIndex()
  const dynastiesState = useDynasties()
  useEffect(() => { resetPoetTheme() }, [])
  return (
    <main className="overview">
      <PaperTexture />
      <h1 className="site-title font-calligraphy">文人生命轨迹地图</h1>
      {dynastiesState.status === 'loaded' && (
        <nav className="dynasty-switcher">
          {dynastiesState.dynasties.map(d => (
            <span key={d.id} className="dynasty active" style={{ fontFamily: calligraphyFontStack(d.calligraphy) }}>{d.name}</span>
          ))}
        </nav>
      )}
      {indexState.status === 'error' ? (
        <p className="load-error">索引加载失败，请刷新重试。</p>
      ) : (
        <div className="poet-wall">
          {indexState.status === 'loaded' && indexState.index.map((p, i) => {
            const t = poetThemes[p.theme]
            const callig = t ? { fontFamily: `${CALLIGRAPHY_FONTS[t.calligraphy]}, "Kaiti SC", "STKaiti", "KaiTi", serif` } : undefined
            return (
              <Link key={p.id} to={`/poets/${p.dynasty}/${p.id}`} className="poet-card mounted-card" style={{ animationDelay: `${Math.min(i * 90, 600)}ms` }}>
                <span className="poet-card-motif"><MotifIcon name={t?.motifs[0] ?? 'moon'} size={48} /></span>
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
