import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePoetBundle } from '../components/map/usePoetBundle'
import { useDynasty } from '../components/map/useDynasty'
import { PoetStateProvider } from './poet-state'
import { HeroMap } from '../components/map/HeroMap'
import { TimeSlider } from '../components/sections/TimeSlider'
import { TimelineSection } from '../components/sections/TimelineSection'
import { SummarySection } from '../components/sections/SummarySection'
import { QuotesSection } from '../components/sections/QuotesSection'
import { WorksSection } from '../components/sections/WorksSection'
import { SectionDivider } from '../components/sections/SectionDivider'
import { poetThemes, applyPoetTheme } from '../themes'

export function PoetPage() {
  const { dynasty, poetId } = useParams<{ dynasty: string; poetId: string }>()
  const [retry, setRetry] = useState(0)
  const state = usePoetBundle(dynasty!, poetId!, retry)
  const dynastyState = useDynasty(dynasty!, retry)
  const theme = poetThemes[poetId!] ?? poetThemes.libai
  useEffect(() => { applyPoetTheme(theme, poetId!) }, [theme, poetId])

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
    <PoetStateProvider key={poetId} initialYear={bundle.poet.death.year}>
      <main className="poet-page">
        <HeroMap bundle={bundle} theme={theme} dynasty={dynastyInfo} />
        <TimeSlider min={bundle.poet.birth.year} max={bundle.poet.death.year} />
        <TimelineSection stops={bundle.poet.stops} poetId={poetId!} />
        <SectionDivider svg={theme.divider} />
        <SummarySection poet={bundle.poet} poetId={poetId!} />
        <SectionDivider svg={theme.divider} />
        <QuotesSection works={bundle.poet.works} poetId={poetId!} />
        <SectionDivider svg={theme.divider} />
        <WorksSection works={bundle.poet.works} poetId={poetId!} />
      </main>
    </PoetStateProvider>
  )
}
