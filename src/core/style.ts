import type { NodeStyle, Theme } from '../types'

export const DEFAULT_THEME: Theme = {
  primary: '#3459f7',
  primaryLight: '#eef4ff',
  secondary: '#ff6b35',
  accent: '#ffb020',
  text: '#1a1d28',
  subText: '#7b8494',
  background: '#f5f6f9',
  cardBg: '#ffffff',
  radius: 14,
  fontTitle: 17,
  fontBody: 14,
}

export function styleToCss(style: NodeStyle = {}, opts: { fullBleed?: boolean } = {}): React.CSSProperties {
  const px = opts.fullBleed ? 0 : style.paddingLeft ?? 0
  const css: React.CSSProperties = {
    marginTop: style.marginTop ?? 0,
    marginBottom: style.marginBottom ?? 0,
    paddingTop: style.paddingTop ?? 0,
    paddingBottom: style.paddingBottom ?? 0,
    paddingLeft: px,
    paddingRight: opts.fullBleed ? 0 : style.paddingRight ?? px,
    borderRadius: style.radius ?? 0,
  }
  if (style.background && style.background !== 'transparent') css.background = style.background
  if (style.borderWidth) {
    css.borderWidth = style.borderWidth
    css.borderStyle = 'solid'
    css.borderColor = style.borderColor ?? '#eef0f4'
  }
  if (style.shadow === 1) css.boxShadow = '0 2px 10px rgba(16,24,40,.06)'
  if (style.shadow === 2) css.boxShadow = '0 8px 28px rgba(16,24,40,.12)'
  return css
}

export function styleToWxss(style: NodeStyle = {}): string {
  const parts: string[] = []
  const push = (k: string, v: string | number, unit = 'rpx') => parts.push(`${k}:${typeof v === 'number' ? `${v}${unit}` : v}`)
  if (style.marginTop) push('margin-top', style.marginTop)
  if (style.marginBottom) push('margin-bottom', style.marginBottom)
  if (style.paddingTop) push('padding-top', style.paddingTop)
  if (style.paddingBottom) push('padding-bottom', style.paddingBottom)
  if (style.paddingLeft) push('padding-left', style.paddingLeft)
  if (style.paddingRight) push('padding-right', style.paddingRight)
  if (style.radius) push('border-radius', style.radius)
  if (style.background && style.background !== 'transparent') parts.push(`background:${style.background}`)
  if (style.borderWidth) parts.push(`border:${style.borderWidth}rpx solid ${style.borderColor || '#eef0f4'}`)
  if (style.shadow === 1) parts.push('box-shadow:0 2rpx 10rpx rgba(16,24,40,.06)')
  if (style.shadow === 2) parts.push('box-shadow:0 8rpx 28rpx rgba(16,24,40,.12)')
  return parts.join(';')
}

/** 颜色值兜底：空字符串时使用主题色 */
export function pick(color: string | undefined, fallback: string): string {
  if (!color) return fallback
  return color
}

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return `rgba(${r},${g},${b},${alpha})`
}
