import { describe, it, expect } from 'vitest'
import { zoomFilter } from './InkMap'

describe('zoomFilter', () => {
  it('wheel 无修饰键不缩放（还给人页面滚动）', () => {
    expect(zoomFilter(new WheelEvent('wheel'))).toBe(false)
  })
  it('wheel + ctrl/meta 缩放', () => {
    expect(zoomFilter(new WheelEvent('wheel', { ctrlKey: true }))).toBe(true)
    expect(zoomFilter(new WheelEvent('wheel', { metaKey: true }))).toBe(true)
  })
  it('拖拽与触摸不受影响', () => {
    expect(zoomFilter(new MouseEvent('mousedown', { button: 0 }))).toBe(true)
    expect(zoomFilter(new Event('touchstart'))).toBe(true)
  })
})
