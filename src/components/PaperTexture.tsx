export function PaperTexture() {
  return (
    <svg className="paper-texture-svg" aria-hidden="true">
      <filter id="paper-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.85, 0 0 0 0 0.8, 0 0 0 0 0.7, 0 0 0 0.06 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-noise)" />
    </svg>
  )
}
