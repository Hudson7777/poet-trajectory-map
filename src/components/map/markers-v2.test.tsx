import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { CityMarker } from './CityMarker'
import { groupStopsByCity, isUncertainGroup } from './groupStops'
import type { Stop } from '../../data/schemas'

const stops: Stop[] = [
  { year: 726, city: '扬州', event: '作《静夜思》', role: '布衣', source: 's' },
  { year: 742, city: '长安', event: '供奉翰林', role: '翰林供奉', source: 's', uncertain: '有争议' },
  { year: 744, city: '长安', event: '赐金放还', role: '布衣', source: 's' },
]

describe('groupStopsByCity', () => {
  it('同城多 stop 合并为一组，组内年份升序', () => {
    const groups = groupStopsByCity(stops)
    expect(groups).toHaveLength(2)
    expect(groups.map(g => g.city)).toEqual(['扬州', '长安'])
    expect(groups[1].stops.map(s => s.year)).toEqual([742, 744])
  })
  it('组间按首站年份升序', () => {
    const reversed = [...stops].reverse()
    const groups = groupStopsByCity(reversed)
    expect(groups.map(g => g.stops[0].year)).toEqual([726, 742])
  })
})

describe('isUncertainGroup', () => {
  it('组内任一 stop 有 uncertain 即存疑', () => {
    expect(isUncertainGroup(stops.slice(1, 3))).toBe(true)
    expect(isUncertainGroup(stops.slice(0, 1))).toBe(false)
  })
})

describe('CityMarker v2', () => {
  const baseProps = {
    position: [100, 100] as [number, number],
    highlighted: false,
    labelSide: 'right' as const,
    showLabel: true,
    onHover: () => {},
    onLock: () => {},
  }

  it('默认只渲染城市名 text，不渲染年份/事件 text', () => {
    const { container } = render(
      <svg><CityMarker group={stops.slice(0, 1)} {...baseProps} /></svg>,
    )
    expect(container.querySelector('.city-label')).not.toBeNull()
    expect(container.querySelector('.city-year')).toBeNull()
    expect(container.querySelector('.city-event')).toBeNull()
  })

  it('普通组渲染实心朱砂印点', () => {
    const { container } = render(
      <svg><CityMarker group={stops.slice(0, 1)} {...baseProps} /></svg>,
    )
    expect(container.querySelector('circle[fill="var(--seal)"]')).not.toBeNull()
  })

  it('存疑组渲染空心虚线 circle + 存疑印章', () => {
    const { container } = render(
      <svg><CityMarker group={stops.slice(1, 2)} {...baseProps} /></svg>,
    )
    expect(container.querySelector('circle[fill="none"][stroke-dasharray]')).not.toBeNull()
    expect(container.querySelector('.uncertain-seal')).not.toBeNull()
  })

  it('click 触发 onLock(group)', () => {
    const onLock = vi.fn()
    const group = stops.slice(0, 1)
    const { container } = render(
      <svg><CityMarker group={group} {...baseProps} onLock={onLock} /></svg>,
    )
    fireEvent.click(container.querySelector('.city-marker')!)
    expect(onLock).toHaveBeenCalledWith(group)
  })

  it('mouseenter/leave 触发 onHover(group|null)', () => {
    const onHover = vi.fn()
    const group = stops.slice(0, 1)
    const { container } = render(
      <svg><CityMarker group={group} {...baseProps} onHover={onHover} /></svg>,
    )
    fireEvent.mouseEnter(container.querySelector('.city-marker')!)
    expect(onHover).toHaveBeenCalledWith(group)
    fireEvent.mouseLeave(container.querySelector('.city-marker')!)
    expect(onHover).toHaveBeenCalledWith(null)
  })

  it('showLabel=false 时不渲染城市名', () => {
    const { container } = render(
      <svg><CityMarker group={stops.slice(0, 1)} {...baseProps} showLabel={false} /></svg>,
    )
    expect(container.querySelector('.city-label')).toBeNull()
  })

  it('highlighted 时印点半径变大', () => {
    const { container: normal } = render(
      <svg><CityMarker group={stops.slice(0, 1)} {...baseProps} highlighted={false} /></svg>,
    )
    const normalR = Number(normal.querySelector('circle[fill="var(--seal)"]')!.getAttribute('r'))
    const { container: hi } = render(
      <svg><CityMarker group={stops.slice(0, 1)} {...baseProps} highlighted={true} /></svg>,
    )
    const hiR = Number(hi.querySelector('circle[fill="var(--seal)"]')!.getAttribute('r'))
    expect(hiR).toBeGreaterThan(normalR)
  })
})
