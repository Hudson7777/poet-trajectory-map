import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { renderEasterEggs, easterEggComponents } from './registry'
import { poetThemes } from '../index'

describe('easter egg registry', () => {
  it('所有主题引用的彩蛋 id 均有对应组件', () => {
    for (const theme of Object.values(poetThemes)) {
      for (const egg of theme.easterEggs) {
        expect(easterEggComponents[egg.id], egg.id).toBeTruthy()
      }
    }
  })
  it('renderEasterEggs 按 scope 过滤', () => {
    const { container } = render(
      <div>{renderEasterEggs([
        { id: 'moon-rise', type: 'quote-hover' },
        { id: 'hanlin-seal', type: 'timeline', target: '742' },
      ], 'quote')}</div>,
    )
    expect(container.querySelectorAll('.moon-rise').length).toBe(1)
    expect(container.querySelectorAll('.hanlin-seal').length).toBe(0)
  })
})
