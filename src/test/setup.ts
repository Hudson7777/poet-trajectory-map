// jsdom 不实现 scrollIntoView，测试中需要时以 no-op 兜底
if (typeof window !== 'undefined' && typeof window.Element !== 'undefined') {
  if (!window.Element.prototype.scrollIntoView) {
    window.Element.prototype.scrollIntoView = () => {}
  }
}
