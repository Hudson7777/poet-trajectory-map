import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SummarySection } from './SummarySection'
import { QuotesSection } from './QuotesSection'
import { WorksSection } from './WorksSection'
import { PoetStateProvider } from '../../pages/poet-state'
import type { Poet, Work } from '../../data/schemas'

const works: Work[] = [
  { title: '静夜思', year: 726, city: '扬州', genre: '诗', text: '床前明月光，疑是地上霜。', background: '背景', famous: ['床前明月光'], source: 's' },
  { title: '将进酒', year: 752, city: '嵩山', genre: '诗', text: '君不见黄河之水天上来。', background: '背景', famous: ['君不见黄河之水天上来'], source: 's' },
]
const poet = {
  summary: { review: '李白，字太白，兴圣皇帝九世孙。', stats: { cities: 18, works: '存诗约千首', topOffice: '翰林供奉', age: 61 } },
} as Poet

describe('SummarySection', () => {
  it('渲染评传与四个生涯数字', () => {
    render(<SummarySection poet={poet} />)
    expect(screen.getByText('李白，字太白，兴圣皇帝九世孙。')).toBeTruthy()
    expect(screen.getByText('行迹城市')).toBeTruthy()
    expect(screen.getByText('18')).toBeTruthy()
  })
})

describe('QuotesSection', () => {
  it('聚合名句最多 5 句并标注出处', () => {
    render(<QuotesSection works={works} />)
    expect(screen.getByText('床前明月光')).toBeTruthy()
    expect(screen.getByText('《静夜思》')).toBeTruthy()
  })
})

describe('WorksSection', () => {
  it('点击作品卡展开全文与背景', () => {
    render(
      <PoetStateProvider initialYear={762}>
        <WorksSection works={works} />
      </PoetStateProvider>,
    )
    fireEvent.click(screen.getByText('《静夜思》'))
    expect(screen.getByText('床前明月光，疑是地上霜。')).toBeTruthy()
  })
})
