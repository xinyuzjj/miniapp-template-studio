import { ICONS } from '../core/icons'
import { isRemoteImage, paletteAt } from '../core/palette'

export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.8,
  filled = false,
}: {
  name: string
  size?: number
  color?: string
  strokeWidth?: number
  filled?: boolean
}) {
  const paths = ICONS[name] ?? ICONS.sparkles
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? color : 'none'}
      stroke={filled ? 'none' : color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}

export function Stars({ value = 5, size = 12, color = '#ffb020' }: { value?: number; size?: number; color?: string }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Icon key={i} name="star" size={size} color={i < value ? color : '#e3e6ec'} filled={i < value} strokeWidth={1} />
      ))}
    </span>
  )
}

/** 图片：优先真实地址，否则渲染渐变占位块 */
export function SmartImage({
  src,
  g1,
  g2,
  radius = 8,
  ratio,
  height,
  width,
  children,
}: {
  src?: string
  g1?: string
  g2?: string
  radius?: number
  ratio?: number
  height?: number
  width?: number | string
  children?: React.ReactNode
}) {
  const [a, b] = g1 && g2 ? [g1, g2] : paletteAt(0)
  const style: React.CSSProperties = {
    borderRadius: radius,
    overflow: 'hidden',
    position: 'relative',
    width: width ?? '100%',
    height: height,
    aspectRatio: ratio && !height ? String(ratio) : undefined,
    flexShrink: 0,
  }
  if (isRemoteImage(src)) {
    return (
      <div style={{ ...style, background: '#f0f2f6' }}>
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        {children}
      </div>
    )
  }
  return (
    <div
      style={{
        ...style,
        background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  )
}
