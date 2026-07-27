import type { Stop } from '../../data/schemas'
import { isUncertainGroup } from './groupStops'

interface MarkerTooltipProps {
  stops: Stop[]
  position: [number, number]
  onClose: () => void
  /** 印点 x 越界（>viewBox 宽 - 260）时翻到左侧渲染 */
  flip?: boolean
}

const ROW_H = 26
const PAD_X = 14
const PAD_TOP = 18
const WIDTH = 240

export function MarkerTooltip({ stops, position, onClose, flip = false }: MarkerTooltipProps) {
  const [x, y] = position
  const uncertain = isUncertainGroup(stops)
  const bodyH = stops.length * ROW_H
  const height = PAD_TOP + bodyH + 14
  const tipX = flip ? x - WIDTH - 14 : x + 14
  const tipY = y - height - 8

  return (
    <g className="marker-tooltip" transform={`translate(${tipX} ${tipY})`}>
      <rect
        x={0}
        y={0}
        width={WIDTH}
        height={height}
        rx={6}
        fill="var(--paper)"
        stroke="#c9b992"
        strokeWidth={1.2}
      />
      {/* 绫边装饰：顶底双线 */}
      <line x1={6} y1={6} x2={WIDTH - 6} y2={6} stroke="#c9b992" strokeWidth={0.5} opacity={0.6} />
      <line x1={6} y1={height - 6} x2={WIDTH - 6} y2={height - 6} stroke="#c9b992" strokeWidth={0.5} opacity={0.6} />

      {/* 关闭点击区 */}
      <g className="marker-tooltip-close" onClick={e => { e.stopPropagation(); onClose() }}>
        <rect x={WIDTH - 24} y={2} width={20} height={20} fill="transparent" pointerEvents="all" />
        <text x={WIDTH - 14} y={16} textAnchor="middle" className="marker-tooltip-close-x">×</text>
      </g>

      {/* 城名标题 */}
      <text x={PAD_X} y={PAD_TOP} className="marker-tooltip-title font-calligraphy">
        {stops[0]?.city}
      </text>
      {uncertain && (
        <text x={WIDTH - 30} y={PAD_TOP} textAnchor="end" className="marker-tooltip-uncertain-tag">存疑</text>
      )}

      {stops.map((s, i) => {
        const rowY = PAD_TOP + 16 + i * ROW_H
        return (
          <g key={`${s.year}-${s.city}-${i}`} transform={`translate(${PAD_X} ${rowY})`}>
            <text x={0} y={0} className="marker-tooltip-year font-calligraphy">{s.year}</text>
            <text x={52} y={0} className="marker-tooltip-event">{s.city} · {s.event}</text>
            <text x={52} y={14} className="marker-tooltip-role">{s.role}</text>
            {s.uncertain && (
              <text x={52} y={28} className="marker-tooltip-uncertain">{s.uncertain}</text>
            )}
          </g>
        )
      })}

    </g>
  )
}
