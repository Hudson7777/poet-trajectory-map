import { zoomIdentity, type ZoomTransform } from 'd3-zoom'

/** 计算把 target 平移到视口中心、缩放 scale 的 transform */
export function computeFlyTransform(
  target: [number, number],
  viewport: [number, number],
  scale: number,
): ZoomTransform {
  const [x, y] = target
  const [w, h] = viewport
  return zoomIdentity.translate(w / 2 - x * scale, h / 2 - y * scale).scale(scale)
}
