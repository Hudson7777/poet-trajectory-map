import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePoetBundle } from '../components/map/usePoetBundle'
import { useDynasty, useDynasties } from '../components/map/useDynasty'
import { usePoetIndex } from '../components/map/usePoetIndex'
import { PoetStateProvider } from './poet-state'
import { HeroMap } from '../components/map/HeroMap'
import { MiniMap } from '../components/map/MiniMap'
import { TimeSlider } from '../components/sections/TimeSlider'
import { TimelineSection } from '../components/sections/TimelineSection'
import { SummarySection } from '../components/sections/SummarySection'
import { QuotesSection } from '../components/sections/QuotesSection'
import { WorksSection } from '../components/sections/WorksSection'
import { SectionDivider } from '../components/sections/SectionDivider'
import { PaperTexture } from '../components/PaperTexture'
import { poetThemes, applyPoetTheme } from '../themes'

export function PoetPage() {
  const { dynasty, poetId } = useParams<{ dynasty: string; poetId: string }>()
  const [retry, setRetry] = useState(0)
  const state = usePoetBundle(dynasty!, poetId!, retry)
  const dynastyState = useDynasty(dynasty!, retry)
  const dynastiesState = useDynasties(retry)
  const indexState = usePoetIndex()
  const [dynOpen, setDynOpen] = useState(false)
  // 点击菜单外区域收起朝代下拉
  useEffect(() => {
    if (!dynOpen) return
    const onDown = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.poet-nav-dynasty')) setDynOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [dynOpen])
  const theme = poetThemes[poetId!] ?? poetThemes.libai
  useEffect(() => { applyPoetTheme(theme, poetId!) }, [theme, poetId])

  // Hero 地图滚出视口后，右下角浮现迷你地图保持年表-地图联动可见
  const heroRef = useRef<HTMLDivElement>(null)
  const [showMini, setShowMini] = useState(false)
  // 切换人物后回到页面顶部，并重置 MiniMap（否则 showMini 残留 true，新 IO 异步回调前会闪一帧）
  useEffect(() => { window.scrollTo(0, 0); setShowMini(false) }, [poetId])
  const loaded = state.status === 'loaded' && dynastyState.status === 'loaded'
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowMini(!entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loaded])

  if (state.status === 'error' || dynastyState.status === 'error') {
    return (
      <main className="load-error">
        <p>人物数据加载失败。</p>
        <button onClick={() => setRetry(r => r + 1)}>重试</button>
      </main>
    )
  }
  if (state.status === 'loading' || dynastyState.status === 'loading') {
    return <main className="loading">加载中…</main>
  }
  const { bundle } = state
  const dynastyInfo = dynastyState.dynasty
  return (
    <PoetStateProvider key={poetId} initialYear={bundle.poet.birth.year}>
      <main className="poet-page">
        <PaperTexture />
        {indexState.status === 'loaded' && (
          <nav className="poet-nav">
            <Link to="/poets" className="poet-nav-back">← 返回总览</Link>
            {dynastiesState.status === 'loaded' && (
              <div className="poet-nav-dynasty">
                <button
                  type="button"
                  className="poet-nav-dynasty-toggle font-calligraphy"
                  onClick={() => setDynOpen(o => !o)}
                >
                  {dynastiesState.dynasties.find(d => d.id === dynasty)?.name ?? dynasty} ▾
                </button>
                {dynOpen && (
                  <ul className="poet-nav-dynasty-menu">
                    {dynastiesState.dynasties.map(d => {
                      const first = indexState.index.find(p => p.dynasty === d.id)
                      return (
                        <li key={d.id}>
                          {first ? (
                            <Link
                              to={`/poets/${d.id}/${first.id}`}
                              className={d.id === dynasty ? 'active' : ''}
                              onClick={() => setDynOpen(false)}
                            >
                              {d.name}
                            </Link>
                          ) : (
                            // 该朝代已注册但尚无文人（D10 扩展中间态），禁用而非跳转到空路由
                            <span className="empty" aria-disabled="true">{d.name}（暂无）</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )}
            <div className="poet-nav-switch">
              {indexState.index.filter(p => p.dynasty === dynasty).map(p => (
                <Link
                  key={p.id}
                  to={`/poets/${p.dynasty}/${p.id}`}
                  className={`poet-nav-item font-calligraphy${p.id === poetId ? ' active' : ''}`}
                >
                  {p.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
        <div ref={heroRef}>
          <HeroMap bundle={bundle} theme={theme} dynasty={dynastyInfo} />
        </div>
        {showMini && <MiniMap bundle={bundle} theme={theme} dynasty={dynastyInfo} />}
        <TimeSlider min={bundle.poet.birth.year} max={bundle.poet.death.year} />
        <TimelineSection stops={bundle.poet.stops} poetId={poetId!} />
        <SectionDivider svg={theme.divider} />
        <SummarySection poet={bundle.poet} poetId={poetId!} />
        <SectionDivider svg={theme.divider} />
        <QuotesSection poet={bundle.poet} poetId={poetId!} />
        <SectionDivider svg={theme.divider} />
        <WorksSection works={bundle.poet.works} poetId={poetId!} />
      </main>
    </PoetStateProvider>
  )
}
