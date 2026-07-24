import type { Work } from '../../data/schemas'

interface WorkMarkerProps {
  work: Work
  position: [number, number]
  onOpen: (work: Work) => void
}

export function WorkMarker({ work, position, onOpen }: WorkMarkerProps) {
  const [x, y] = position
  return (
    <g className="work-marker" onClick={() => onOpen(work)} role="button" aria-label={`作品《${work.title}》`}>
      <rect x={x - 6} y={y - 8} width={12} height={16} rx={2} fill="var(--paper)" stroke="var(--accent)" strokeWidth={1.5} />
      <line x1={x - 3} y1={y - 3} x2={x + 3} y2={y - 3} stroke="var(--accent)" strokeWidth={1} />
      <line x1={x - 3} y1={y + 1} x2={x + 3} y2={y + 1} stroke="var(--accent)" strokeWidth={1} />
      <title>《{work.title}》{work.year} 年作于{work.city}</title>
    </g>
  )
}
