import type { Stop } from '../../data/schemas'
import { isUncertainGroup } from './groupStops'

export type LabelSide = 'right' | 'top' | 'left' | 'bottom'

interface CityMarkerProps {
  group: Stop[]
  position: [number, number]
  highlighted: boolean
  labelSide: LabelSide
  showLabel: boolean
  onHover: (group: Stop[] | null) => void
  onLock: (group: Stop[]) => void
}

const LABEL_OFFSET = 12

function labelPosition(x: number, y: number, side: LabelSide): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } {
  switch (side) {
    case 'right': return { x: x + LABEL_OFFSET, y: y + 4, anchor: 'start' }
    case 'top': return { x, y: y - LABEL_OFFSET, anchor: 'middle' }
    case 'left': return { x: x - LABEL_OFFSET, y: y + 4, anchor: 'end' }
    case 'bottom': return { x, y: y + LABEL_OFFSET + 8, anchor: 'middle' }
  }
}

export function CityMarker({ group, position, highlighted, labelSide, showLabel, onHover, onLock }: CityMarkerProps) {
  const [x, y] = position
  const r = highlighted ? 8 : 4.5
  const uncertain = isUncertainGroup(group)
  const cityName = group[0]?.city ?? ''
  const label = labelPosition(x, y, labelSide)
  return (
    <g
      className={`city-marker${highlighted ? ' highlighted' : ''}`}
      onMouseEnter={() => onHover(group)}
      onMouseLeave={() => onHover(null)}
      onClick={e => { e.stopPropagation(); onLock(group) }}
    >
      {uncertain ? (
        <circle cx={x} cy={y} r={r} fill="none" stroke="var(--seal)" strokeWidth={1.8} strokeDasharray="4 3" />
      ) : (
        <>
          <circle cx={x} cy={y} r={r} fill="var(--seal)" />
          <circle cx={x} cy={y} r={r / 2.4} fill="var(--paper)" />
        </>
      )}
      {uncertain && (
        <g className="uncertain-seal" transform={`translate(${x + r + 4} ${y - r - 4}) rotate(-4)`}>
          <rect x={-2} y={-9} width={26} height={13} rx={1.5} fill="none" stroke="var(--seal)" strokeWidth={0.8} />
          <text x={11} y={1} textAnchor="middle">存疑</text>
        </g>
      )}
      {showLabel && (
        <text
          x={label.x}
          y={label.y}
          textAnchor={label.anchor}
          className="city-label font-calligraphy"
        >
          {cityName}
        </text>
      )}
    </g>
  )
}
