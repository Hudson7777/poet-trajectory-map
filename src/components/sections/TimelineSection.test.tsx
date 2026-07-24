import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimelineSection } from './TimelineSection'
import { PoetStateProvider, usePoetState } from '../../pages/poet-state'
import type { Stop } from '../../data/schemas'

const stops: Stop[] = [
  { year: 726, city: '扬州', event: '作《静夜思》', role: '布衣', source: 's' },
  { year: 742, city: '长安', event: '供奉翰林', role: '翰林供奉', source: 's' },
]

function YearProbe() {
  const { year } = usePoetState()
  return <span data-testid="year">{year}</span>
}

function renderWithState() {
  return render(
    <PoetStateProvider initialYear={762}>
      <TimelineSection stops={stops} poetId="libai" />
      <YearProbe />
    </PoetStateProvider>,
  )
}

describe('TimelineSection', () => {
  it('点击年表条目设置年份', () => {
    renderWithState()
    fireEvent.click(screen.getByText('扬州 · 作《静夜思》'))
    expect(screen.getByTestId('year').textContent).toBe('726')
  })
  it('hover 条目设置 hoveredStop', () => {
    renderWithState()
    fireEvent.mouseEnter(screen.getByText('扬州 · 作《静夜思》'))
    expect(document.querySelector('li.active')).toBeTruthy()
  })
})
