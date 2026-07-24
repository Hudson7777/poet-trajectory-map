import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderEasterEggs, easterEggComponents } from './registry'
import { poetThemes } from '../index'

describe('easter egg registry', () => {
  it('所有主题引用的彩蛋 id 均有对应组件', () => {
    for (const theme of Object.values(poetThemes)) {
      for (const egg of theme.easterEggs) {
        // trajectory-style 类彩蛋由 HeroMap 通用处理，不经 registry 渲染，跳过组件存在性断言
        if (egg.type === 'trajectory-style') continue
        expect(easterEggComponents[egg.id], egg.id).toBeTruthy()
      }
    }
  })
  it('renderEasterEggs 按 scope 过滤', () => {
    const { container } = render(
      <svg>{renderEasterEggs([
        { id: 'catch-moon', type: 'map-node', target: '当涂' },
        { id: 'hanlin-seal', type: 'timeline', target: '742' },
      ], 'map')}</svg>,
    )
    expect(container.querySelectorAll('g').length).toBe(1)
  })
})
