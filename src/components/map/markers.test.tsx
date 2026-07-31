import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Trajectory } from './Trajectory'
import { CityMarker } from './CityMarker'
import type { Stop } from '../../data/schemas'
import type { BrushStyle } from '../../themes/types'

const goldBrush: BrushStyle = { kind: 'gold', colors: ['#b8860b', '#d4af37'], width: 2.5 }

const cities = {
  扬州: { name: '扬州', modernName: '扬州', lon: 119.41, lat: 32.39, region: '淮南道' },
  长安: { name: '长安', modernName: '西安', lon: 108.94, lat: 34.34, region: '京畿道' },
}
const project = (lon: number, lat: number) => [lon * 10, lat * 10] as [number, number]
const stops: Stop[] = [
  { year: 726, city: '扬州', event: '作《静夜思》', role: '布衣', source: 's' },
  { year: 742, city: '长安', event: '供奉翰林', role: '翰林供奉', source: 's', uncertain: '有争议' },
]

describe('Trajectory', () => {
  it('按年份过滤后少于 2 点不渲染', () => {
    const { container } = render(
      <svg><Trajectory stops={stops} cities={cities} project={project} year={700} brush={goldBrush} /></svg>,
    )
    expect(container.querySelector('path')).toBeNull()
  })
  it('正常年份渲染轨迹双层 path（底层晕染 + 上层主线条），主线条带 brush kind class', () => {
    const { container } = render(
      <svg><Trajectory stops={stops} cities={cities} project={project} year={762} brush={goldBrush} /></svg>,
    )
    expect(container.querySelector('path.trajectory-gold')).not.toBeNull()
    expect(container.querySelectorAll('path.trajectory').length).toBeGreaterThanOrEqual(2)
  })
})

describe('CityMarker', () => {
  it('普通组为实心朱砂印点，默认无年份/事件 text', () => {
    const { container } = render(
      <svg><CityMarker group={[stops[0]]} position={[100, 100]} highlighted={false} labelSide="right" showLabel={true} onHover={() => {}} onLock={() => {}} /></svg>,
    )
    expect(container.querySelector('circle[fill="var(--seal)"]')).not.toBeNull()
    expect(container.querySelector('.city-year')).toBeNull()
    expect(container.querySelector('.city-event')).toBeNull()
  })
  it('存疑组为空心虚线印点，不再额外渲染存疑文字印章（虚线本身即存疑标识）', () => {
    const { container } = render(
      <svg><CityMarker group={[stops[1]]} position={[100, 100]} highlighted={false} labelSide="right" showLabel={true} onHover={() => {}} onLock={() => {}} /></svg>,
    )
    expect(container.querySelector('circle[fill="none"][stroke-dasharray]')).not.toBeNull()
    expect(container.querySelector('.uncertain-seal')).toBeNull()
  })
  it('click 触发 onLock 回调', () => {
    const onLock = vi.fn()
    const { container } = render(
      <svg><CityMarker group={[stops[0]]} position={[100, 100]} highlighted={false} labelSide="right" showLabel={true} onHover={() => {}} onLock={onLock} /></svg>,
    )
    fireEvent.click(container.querySelector('.city-marker')!)
    expect(onLock).toHaveBeenCalledWith([stops[0]])
  })
})
