import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { PoetPage } from './PoetPage'

// 真实构建产物作为 fetch 响应，避免维护夹具（glob 模式同 basemaps.ts）
const dataModules = import.meta.glob('../../public/data/**/*.json', { eager: true, import: 'default' }) as Record<string, unknown>
const responses: Record<string, unknown> = {
  '/data/tang/libai.json': dataModules['../../public/data/tang/libai.json'],
  '/data/dynasties.json': dataModules['../../public/data/dynasties.json'],
  '/data/index.json': dataModules['../../public/data/index.json'],
}

// 记录型 IntersectionObserver：捕获实例、回调与被观察元素
interface IOInstance {
  cb: IntersectionObserverCallback
  el: Element | null
}
const ioInstances: IOInstance[] = []

beforeAll(() => {
  // 同 trajectory.test.tsx：jsdom 缺 getTotalLength / matchMedia
  const sample = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  Object.defineProperty(Object.getPrototypeOf(sample), 'getTotalLength', {
    configurable: true,
    value: () => 100,
  })
  if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }) as unknown as MediaQueryList
  }
})

beforeEach(() => {
  ioInstances.length = 0
  vi.stubGlobal('IntersectionObserver', class {
    cb: IntersectionObserverCallback
    el: Element | null = null
    constructor(cb: IntersectionObserverCallback) {
      this.cb = cb
      ioInstances.push(this as unknown as IOInstance)
    }
    observe(el: Element) { this.el = el }
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
  })
  vi.stubGlobal('fetch', (url: string) => {
    const body = responses[url]
    if (!body) return Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('404')) })
    return Promise.resolve({ ok: true, json: () => Promise.resolve(body) })
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/poets/tang/libai']}>
      <Routes>
        <Route path="/poets/:dynasty/:poetId" element={<PoetPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('PoetPage MiniMap 悬浮开关', () => {
  it('数据加载完成后才为 Hero 挂 IntersectionObserver', async () => {
    renderPage()
    await screen.findByText('生平年表')
    const heroObserver = ioInstances.find(i => i.el?.querySelector('.hero-map'))
    expect(heroObserver).toBeTruthy()
  })

  it('朝代下拉：toggle 展开 dynasties.json 朝代菜单，菜单项指向该朝第一位文人', async () => {
    renderPage()
    await screen.findByText('生平年表')
    fireEvent.click(screen.getByRole('button', { name: /唐 ▾/ }))
    const menu = document.querySelector('.poet-nav-dynasty-menu')
    expect(menu).toBeTruthy()
    expect(menu?.textContent).toContain('唐')
    const firstDynasty = (responses['/data/dynasties.json'] as { id: string }[])[0]
    const firstPoet = (responses['/data/index.json'] as { dynasty: string; id: string }[]).find(p => p.dynasty === firstDynasty.id)!
    expect(menu?.querySelector('a')?.getAttribute('href')).toBe(`/poets/${firstDynasty.id}/${firstPoet.id}`)
  })

  it('无文人的朝代菜单项为禁用文本而非链接（D10 扩展守卫）', async () => {
    const dynasties = [
      ...(responses['/data/dynasties.json'] as unknown[]),
      { id: 'song', name: '宋', era: [960, 1279], divisionName: '路', projection: { lon0: 72, lat0: 54.5, s: 25, sy: 29 }, viewBox: '0 0 960 720' },
    ]
    vi.stubGlobal('fetch', (url: string) => {
      if (url === '/data/dynasties.json') return Promise.resolve({ ok: true, json: () => Promise.resolve(dynasties) })
      const body = responses[url]
      if (!body) return Promise.resolve({ ok: false, status: 404, json: () => Promise.reject(new Error('404')) })
      return Promise.resolve({ ok: true, json: () => Promise.resolve(body) })
    })
    renderPage()
    await screen.findByText('生平年表')
    fireEvent.click(screen.getByRole('button', { name: /唐 ▾/ }))
    const items = [...document.querySelectorAll('.poet-nav-dynasty-menu li')]
    const songItem = items.find(li => li.textContent!.includes('宋'))!
    expect(songItem).toBeTruthy()
    expect(songItem.querySelector('a')).toBeNull()
    expect(songItem.querySelector('span.empty')).toBeTruthy()
  })

  it('点击菜单外区域收起朝代下拉', async () => {
    renderPage()
    await screen.findByText('生平年表')
    fireEvent.click(screen.getByRole('button', { name: /唐 ▾/ }))
    expect(document.querySelector('.poet-nav-dynasty-menu')).toBeTruthy()
    fireEvent.mouseDown(document.body)
    expect(document.querySelector('.poet-nav-dynasty-menu')).toBeNull()
  })

  it('Hero 滚出视口渲染 MiniMap，滚回视口移除', async () => {
    renderPage()
    await screen.findByText('生平年表')
    const heroObserver = ioInstances.find(i => i.el?.querySelector('.hero-map'))!
    expect(document.querySelector('.mini-map')).toBeNull()
    act(() => { heroObserver.cb([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver) })
    expect(document.querySelector('.mini-map')).toBeTruthy()
    act(() => { heroObserver.cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver) })
    expect(document.querySelector('.mini-map')).toBeNull()
  })

  it('导航诗人名各自锁本人书法体，不随当前页字体', async () => {
    renderPage()
    await screen.findByText('生平年表')
    expect(screen.getByRole('link', { name: '李白' }).style.fontFamily).toContain('Liu Jian Mao Cao')
    expect(screen.getByRole('link', { name: '杜甫' }).style.fontFamily).toContain('Long Cang')
    expect(screen.getByRole('link', { name: '白居易' }).style.fontFamily).toContain('LXGW WenKai')
  })

  it('朝代 toggle 用朝代书法体（唐=马善政）', async () => {
    renderPage()
    await screen.findByText('生平年表')
    expect(screen.getByRole('button', { name: /唐 ▾/ }).style.fontFamily).toContain('Ma Shan Zheng')
  })
})
