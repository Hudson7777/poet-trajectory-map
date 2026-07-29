import type { Stop } from '../../data/schemas'
import { isUncertainGroup } from './groupStops'

interface MarkerTooltipProps {
  stops: Stop[]
  position: [number, number]
  onClose: () => void
  /** 印点 x 越界（>viewBox 宽 - 260）时翻到左侧渲染 */
  flip?: boolean
}

const PAD_X = 14
const PAD_TOP = 18
const PAD_BOTTOM = 14
const WIDTH = 240
const TEXT_X = 52
const TEXT_W = WIDTH - TEXT_X - PAD_X
const EVENT_FS = 12
const ROLE_FS = 11
const UNCERTAIN_FS = 10
const LINE_GAP = 3

/** 按可用像素宽度折行：CJK 按全宽计，ASCII 按 0.55 宽计 */
function wrapText(text: string, fontSize: number): string[] {
  const maxUnits = TEXT_W / fontSize
  const lines: string[] = []
  let cur = ''
  let w = 0
  for (const ch of text) {
    const cw = ch.charCodeAt(0) < 256 ? 0.55 : 1
    if (cur && w + cw > maxUnits) {
      lines.push(cur)
      cur = ch
      w = cw
    } else {
      cur += ch
      w += cw
    }
  }
  if (cur) lines.push(cur)
  return lines
}

interface RowLayout {
  stop: Stop
  eventLines: string[]
  roleLines: string[]
  uncertainLines: string[]
  height: number
}

function layoutRows(stops: Stop[]): RowLayout[] {
  return stops.map(stop => {
    const eventLines = wrapText(`${stop.city} · ${stop.event}`, EVENT_FS)
    const roleLines = wrapText(stop.role, ROLE_FS)
    const uncertainLines = stop.uncertain ? wrapText(stop.uncertain, UNCERTAIN_FS) : []
    const height =
      eventLines.length * (EVENT_FS + LINE_GAP) +
      roleLines.length * (ROLE_FS + LINE_GAP) +
      uncertainLines.length * (UNCERTAIN_FS + LINE_GAP) +
      8
    return { stop, eventLines, roleLines, uncertainLines, height }
  })
}

export function MarkerTooltip({ stops, position, onClose, flip = false }: MarkerTooltipProps) {
  const [x, y] = position
  const uncertain = isUncertainGroup(stops)
  const rows = layoutRows(stops)
  const bodyH = rows.reduce((sum, r) => sum + r.height, 0)
  const height = PAD_TOP + bodyH + PAD_BOTTOM
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

      {rows.map((row, i) => {
        const rowY = PAD_TOP + 16 + rows.slice(0, i).reduce((s, r) => s + r.height, 0)
        let lineY = 0
        return (
          <g key={`${row.stop.year}-${row.stop.city}-${i}`} transform={`translate(${PAD_X} ${rowY})`}>
            <text x={0} y={0} className="marker-tooltip-year font-calligraphy">{row.stop.year}</text>
            {row.eventLines.map((line, j) => {
              const ly = lineY
              lineY += EVENT_FS + LINE_GAP
              return <text key={j} x={TEXT_X} y={ly} className="marker-tooltip-event">{line}</text>
            })}
            {row.roleLines.map((line, j) => {
              const ly = lineY
              lineY += ROLE_FS + LINE_GAP
              return <text key={j} x={TEXT_X} y={ly} className="marker-tooltip-role">{line}</text>
            })}
            {row.uncertainLines.map((line, j) => {
              const ly = lineY
              lineY += UNCERTAIN_FS + LINE_GAP
              return <text key={j} x={TEXT_X} y={ly} className="marker-tooltip-uncertain">{line}</text>
            })}
          </g>
        )
      })}

    </g>
  )
}
