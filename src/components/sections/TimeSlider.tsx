import { usePoetState } from '../../pages/poet-state'

export function TimeSlider({ min, max }: { min: number; max: number }) {
  const { year, setYear } = usePoetState()
  return (
    <div className="time-slider-wrap">
      <input
        type="range" min={min} max={max} value={year}
        onChange={e => setYear(Number(e.target.value))}
        className="time-slider" aria-label="年份"
      />
      <span className="time-slider-year font-calligraphy">{year}</span>
    </div>
  )
}
