import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { usePoetState } from '../../pages/poet-state'

interface Particle { id: number; dx: number }

interface TimeSliderProps { min: number; max: number; poetId?: string }

/** 主题化时间轴：水墨轨道 + 朱砂印拇指；拖动时散出诗人意象微粒子。键盘 ←/→/Home/End 可调 */
export function TimeSlider({ min, max, poetId = 'libai' }: TimeSliderProps) {
  const { year, setYear } = usePoetState()
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const pidRef = useRef(0)
  const lastSpawn = useRef(0)
  const ratio = (year - min) / (max - min)

  const yearFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const r = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    setYear(Math.round(min + r * (max - min)))
  }, [min, max, setYear])

  const spawnParticle = () => {
    const now = Date.now()
    if (now - lastSpawn.current < 90) return
    lastSpawn.current = now
    const id = ++pidRef.current
    const dx = Math.round(Math.random() * 32 - 16)
    setParticles(ps => [...ps.slice(-11), { id, dx }])
  }
  const removeParticle = (id: number) => setParticles(ps => ps.filter(p => p.id !== id))

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDragging(true)
    yearFromClientX(e.clientX)
    spawnParticle()
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    yearFromClientX(e.clientX)
    spawnParticle()
  }
  const onPointerUp = () => setDragging(false)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') setYear(Math.max(min, year - 1))
    else if (e.key === 'ArrowRight') setYear(Math.min(max, year + 1))
    else if (e.key === 'Home') setYear(min)
    else if (e.key === 'End') setYear(max)
    else return
    e.preventDefault()
  }

  return (
    <div className="time-slider-wrap">
      <div
        ref={trackRef}
        className={`tl-track${dragging ? ' dragging' : ''}`}
        role="slider"
        aria-label="年份"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={year}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <div className="tl-fill" style={{ width: `${ratio * 100}%` }} />
        <div className="tl-thumb" style={{ left: `${ratio * 100}%` }} />
        {particles.map(p => (
          <span
            key={p.id}
            className={`tl-particle tlp-${poetId}`}
            style={{ left: `${ratio * 100}%`, '--dx': `${p.dx}px` } as CSSProperties}
            onAnimationEnd={() => removeParticle(p.id)}
          />
        ))}
      </div>
      <span className="time-slider-year font-calligraphy">{year}</span>
    </div>
  )
}
