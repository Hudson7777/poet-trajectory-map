import type { BrushStyle } from '../../themes/types'

/**
 * 按当前笔触 kind 渲染共享 SVG defs（渐变 / 滤镜）。
 * 同页只有一个地图、一个诗人，故 id 直接按 kind 共用，不加人物后缀。
 * - gold：线性渐变 + feTurbulence 金粉颗粒
 * - dry：feTurbulence + feDisplacementMap 枯笔飞白
 * - fade：沿线透明渐变（渐变作为 stroke，alpha 随位置起伏）
 * - plain：无（纯色淡墨）
 * - spring：双色线性渐变
 */
export function BrushDefs({ brush }: { brush: BrushStyle }) {
  const { kind, colors } = brush
  return (
    <defs>
      {(kind === 'gold' || kind === 'spring') && (
        <linearGradient id={`brush-${kind}-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      )}
      {kind === 'fade' && (
        <linearGradient id="brush-fade-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors[0]} stopOpacity={0.9} />
          <stop offset="50%" stopColor={colors[1]} stopOpacity={0.45} />
          <stop offset="100%" stopColor={colors[0]} stopOpacity={0.8} />
        </linearGradient>
      )}
      {kind === 'gold' && (
        <filter id="brush-gold-grain" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="noise" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.72  0 0 0 0 0.53  0 0 0 0 0.04  0 0 0 0.55 0"
            result="grain"
          />
          <feComposite in="grain" in2="SourceGraphic" operator="in" result="grainMasked" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="grainMasked" />
          </feMerge>
        </filter>
      )}
      {kind === 'dry' && (
        <filter id="brush-dry-flying" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.6" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      )}
    </defs>
  )
}
