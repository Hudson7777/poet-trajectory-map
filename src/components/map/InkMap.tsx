import { useEffect, useRef, type ReactNode, type MutableRefObject } from 'react'
import { zoom } from 'd3-zoom'
import { select } from 'd3-selection'
import 'd3-transition'
import { computeFlyTransform } from './flyTo'

export function zoomFilter(event: Event): boolean {
  if (event.type === 'wheel') {
    const we = event as WheelEvent
    return we.ctrlKey || we.metaKey
  }
  if (event.type.startsWith('touch')) return true
  return !(event as MouseEvent).button
}

export interface InkMapController {
  flyTo: (target: [number, number], scale?: number) => void
}

interface InkMapProps {
  basemapRaw: string
  viewBox: string
  controllerRef?: MutableRefObject<InkMapController | null>
  onZoomChange?: (k: number) => void
  children: ReactNode
}

export function InkMap({ basemapRaw, viewBox, controllerRef, onZoomChange, children }: InkMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return
    const vb = viewBox.split(' ').map(Number)
    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .filter(zoomFilter)
      .translateExtent([
        [0, 0],
        [vb[2], vb[3]],
      ])
      .on('zoom', (event) => {
        gRef.current!.setAttribute('transform', event.transform.toString())
        onZoomChange?.(event.transform.k)
      })
    select(svgRef.current).call(z)
    if (controllerRef) {
      controllerRef.current = {
        flyTo: (target, scale = 1.2) => {
          const t = computeFlyTransform(target, [vb[2], vb[3]], scale)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          select(svgRef.current!).transition().duration(800).call(z.transform as any, t)
        },
      }
    }
    return () => {
      // 卸载时必须移除 d3-zoom 注册的监听器并清空 controller，避免路由切换后泄漏
      if (svgRef.current) select(svgRef.current).on('.zoom', null)
      if (controllerRef) controllerRef.current = null
    }
  }, [controllerRef, onZoomChange, viewBox])

  return (
    <svg ref={svgRef} viewBox={viewBox} className="ink-map" role="img" aria-label="水墨地图">
      <g ref={gRef}>
        <g dangerouslySetInnerHTML={{ __html: basemapRaw }} />
        {children}
      </g>
    </svg>
  )
}
