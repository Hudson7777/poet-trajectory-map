import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Trajectory } from './Trajectory'
import { CityMarker } from './CityMarker'
import type { Stop } from '../../data/schemas'

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
      <svg><Trajectory stops={stops} cities={cities} project={project} year={700} /></svg>,
    )
    expect(container.querySelector('path')).toBeNull()
  })
  it('正常年份渲染轨迹 path', () => {
    const { container } = render(
      <svg><Trajectory stops={stops} cities={cities} project={project} year={762} /></svg>,
    )
    expect(container.querySelector('path.trajectory-ink')).not.toBeNull()
  })
})

describe('CityMarker', () => {
  it('普通节点为实心朱砂印点', () => {
    const { container } = render(
      <svg><CityMarker stop={stops[0]} position={[100, 100]} highlighted={false} dimmed={false} onHover={() => {}} /></svg>,
    )
    expect(container.querySelector('circle[fill="var(--seal)"]')).not.toBeNull()
  })
  it('存疑节点为空心虚线印点并带存疑标签', () => {
    render(
      <svg><CityMarker stop={stops[1]} position={[100, 100]} highlighted={false} dimmed={false} onHover={() => {}} /></svg>,
    )
    expect(screen.getByText('存疑')).toBeTruthy()
  })
  it('hover 触发 onHover 回调', () => {
    const onHover = vi.fn()
    const { container } = render(
      <svg><CityMarker stop={stops[0]} position={[100, 100]} highlighted={false} dimmed={false} onHover={onHover} /></svg>,
    )
    fireEvent.mouseEnter(container.querySelector('.city-marker')!)
    expect(onHover).toHaveBeenCalledWith(stops[0])
  })
})
