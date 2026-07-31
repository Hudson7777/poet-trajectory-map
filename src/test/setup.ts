// jsdom 不实现 scrollIntoView，测试中需要时以 no-op 兜底
if (typeof window !== 'undefined' && typeof window.Element !== 'undefined') {
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = () => {}
  }
}

// jsdom 的 window.scrollTo 是「未实现」桩，调用即打印警告（PoetPage 回顶 / MiniMap 回大地图会触发），直接覆盖为 no-op
if (typeof window !== 'undefined') {
  window.scrollTo = () => {}
}

// jsdom 不实现 IntersectionObserver，TimelineSection useEffect 依赖它，no-op 兜底
// 注：brief 原文 `window.IntersectionObserver = ...` 在 lib:DOM 下因 `in` 收敛为 never 不过 tsc，
// 此处 LHS 改用结构化类型断言绕过收窄，运行时与 brief 完全等价
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  ;(window as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
  } as unknown as typeof IntersectionObserver
}
