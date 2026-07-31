import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { TimeSlider } from './TimeSlider'
import { PoetStateProvider } from '../../pages/poet-state'

function setup() {
  return render(
    <PoetStateProvider initialYear={701}>
      <TimeSlider min={701} max={762} poetId="libai" />
    </PoetStateProvider>,
  )
}

afterEach(() => { vi.restoreAllMocks() })

describe('TimeSlider 定制滑块', () => {
  it('方向键/Home/End 调整年份且不越界', () => {
    setup()
    const slider = screen.getByRole('slider')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider.getAttribute('aria-valuenow')).toBe('702')
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(slider.getAttribute('aria-valuenow')).toBe('701')
    fireEvent.keyDown(slider, { key: 'End' })
    expect(slider.getAttribute('aria-valuenow')).toBe('762')
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider.getAttribute('aria-valuenow')).toBe('762')
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(slider.getAttribute('aria-valuenow')).toBe('701')
  })

  it('指针按下/拖动按轨道位置换算年份并散出粒子', () => {
    const { container } = setup()
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
      { left: 0, top: 0, width: 100, height: 28, right: 100, bottom: 28, x: 0, y: 0, toJSON: () => ({}) } as DOMRect,
    )
    const slider = screen.getByRole('slider')
    fireEvent.pointerDown(slider, { clientX: 50, pointerId: 1 })
    expect(slider.getAttribute('aria-valuenow')).toBe('732') // 701 + round(0.5 × 61)
    fireEvent.pointerMove(slider, { clientX: 100, pointerId: 1 })
    expect(slider.getAttribute('aria-valuenow')).toBe('762')
    expect(container.querySelectorAll('.tl-particle').length).toBeGreaterThan(0)
    expect(container.querySelector('.tlp-libai')).toBeTruthy()
    fireEvent.pointerUp(slider, { pointerId: 1 })
  })
})
