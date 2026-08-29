import { createContext, useContext } from 'react'
import type { MpNode, Theme } from '../types'
import { REGISTRY } from '../core/registry'
import { styleToCss, pick, hexToRgba } from '../core/style'
import { Icon, SmartImage, Stars } from './primitives'
import { paletteAt } from '../core/palette'

const ThemeCtx = createContext<Theme>({} as Theme)
export const ThemeProvider = ThemeCtx.Provider
export const useTheme = () => useContext(ThemeCtx)

const SelCtx = createContext<{ selectedId?: string | null; onSelect?: (id: string) => void }>({})
export const SelectProvider = SelCtx.Provider

/** 预览态点击跳转的回调（由 PhoneFrame 注入） */
const NavCtx = createContext<((path: string) => void) | undefined>(undefined)
export const NavProvider = NavCtx.Provider
export const useNav = () => useContext(NavCtx)

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function seedOf(node: MpNode): number {
  return hash(node.id)
}

/* ------------------------------------------------------------------ */
/* 主体                                                                */
/* ------------------------------------------------------------------ */

export function NodeRenderer({ node, editable = false, isLast = false }: { node: MpNode; editable?: boolean; isLast?: boolean }) {
  const theme = useTheme()
  const sel = useContext(SelCtx)
  const nav = useContext(NavCtx)
  const def = REGISTRY[node.type]
  const selected = sel.selectedId === node.id
  const linkTo = node.link?.to || ''

  const outer = styleToCss(node.style)
  if (isLast && node.type === 'cartBar') {
    // 结算栏不额外撑开底部
  }

  const inner = renderBody(node, theme, seedOf(node))

  if (!editable) {
    const clickable = !!linkTo && !!nav
    return (
      <div
        style={{ ...outer, cursor: clickable ? 'pointer' : undefined }}
        onClick={
          clickable
            ? (e) => {
                e.stopPropagation()
                nav!(linkTo)
              }
            : undefined
        }
      >
        {inner}
      </div>
    )
  }

  return (
    <div
      data-node-id={node.id}
      onClick={(e) => {
        e.stopPropagation()
        sel.onSelect?.(node.id)
      }}
      style={{ ...outer, position: 'relative', cursor: 'pointer' }}
      className="group"
    >
      <div
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: (node.style.radius ?? 0) + 4,
          pointerEvents: 'none',
          outline: selected ? '2px solid #3459f7' : '1px solid transparent',
          outlineOffset: 0,
          transition: 'outline-color .12s',
          zIndex: 5,
        }}
        className={selected ? '' : 'group-hover:outline group-hover:outline-1 group-hover:outline-brand-300'}
      />
      {selected && <NodeBadge label={def?.name ?? node.type} linkTo={linkTo} />}
      {linkTo ? (
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: 0,
            background: '#10b981',
            color: '#fff',
            fontSize: 11,
            lineHeight: '18px',
            padding: '0 6px',
            borderRadius: 4,
            zIndex: 30,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          🔗 已绑定跳转
        </div>
      ) : null}
      {inner}
    </div>
  )
}

function NodeBadge({ label, linkTo }: { label: string; linkTo?: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: -20,
        left: 0,
        background: '#3459f7',
        color: '#fff',
        fontSize: 11,
        lineHeight: '18px',
        padding: '0 6px',
        borderRadius: 4,
        zIndex: 30,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}
    >
      {label}
      {linkTo ? `  ↗` : ''}
    </div>
  )
}

function NodeChildren({ nodes }: { nodes: MpNode[] }) {
  return (
    <>
      {nodes.map((c) => (
        <NodeRenderer key={c.id} node={c} />
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* 各组件渲染                                                          */
/* ------------------------------------------------------------------ */

function renderBody(node: MpNode, T: Theme, seed: number): React.ReactNode {
  const p = node.props ?? {}
  const items: any[] = (p.items ?? []) as any[]
  const primary = T.primary ?? '#3459f7'
  const text = T.text ?? '#1a1d28'
  const sub = T.subText ?? '#7b8494'

  switch (node.type) {
    /* ---------------- 基础 ---------------- */
    case 'view': {
      const dir = p.direction === 'row' ? 'row' : 'column'
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: dir,
            gap: p.gap ?? 12,
            alignItems: dir === 'row' ? (p.align === 'stretch' ? 'stretch' : (p.align as any) ?? 'center') : 'stretch',
          }}
        >
          {(node.children ?? []).length === 0 ? (
            <div
              style={{
                border: '1px dashed #d5d9e2',
                borderRadius: 10,
                padding: '18px 0',
                textAlign: 'center',
                color: '#a6aebd',
                fontSize: 12,
                background: 'rgba(255,255,255,.5)',
                width: '100%',
              }}
            >
              空容器 · 从左侧拖入组件
            </div>
          ) : (
            (node.children ?? []).map((c) => <NodeRenderer key={c.id} node={c} />)
          )}
        </div>
      )
    }

    case 'title': {
      const size = p.size ?? 17
      return (
        <div style={{ display: 'flex', alignItems: p.sub ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ flex: 1, textAlign: p.align === 'center' ? 'center' : 'left' }}>
            <div style={{ fontSize: size, fontWeight: 700, color: pick(p.color, text), letterSpacing: 0.2, lineHeight: 1.35 }}>{p.content}</div>
            {p.sub ? <div style={{ fontSize: 12, color: pick(p.subColor, sub), marginTop: 4 }}>{p.sub}</div> : null}
          </div>
          {p.more ? (
            <div style={{ fontSize: 12, color: sub, display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, paddingTop: p.sub ? 2 : 0 }}>
              {p.moreText || '更多'}
              <Icon name="chevronRight" size={12} color={sub} />
            </div>
          ) : null}
        </div>
      )
    }

    case 'text':
      return (
        <div
          style={{
            fontSize: p.size ?? 14,
            color: pick(p.color, sub),
            fontWeight: p.weight ?? '400',
            textAlign: p.align ?? 'left',
            lineHeight: p.lineHeight ?? 1.7,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {p.content}
        </div>
      )

    case 'image': {
      const [g1, g2] = paletteAt(seed)
      return (
        <div>
          <SmartImage src={p.src} g1={g1} g2={g2} height={p.height ?? 160} radius={p.radius ?? 12}>
            <Icon name="image" size={26} color="rgba(255,255,255,.75)" />
          </SmartImage>
          {p.caption ? (
            <div style={{ fontSize: 12, color: sub, textAlign: 'center', marginTop: 6 }}>{p.caption}</div>
          ) : null}
        </div>
      )
    }

    case 'video': {
    const [g1, g2] = paletteAt(seed)
    if (p.src) {
      return (
        <video
          src={p.src}
          poster={p.poster || undefined}
          controls={p.controls !== false}
          autoPlay={!!p.autoplay}
          style={{ width: '100%', height: p.height ?? 200, display: 'block', objectFit: 'cover', borderRadius: p.radius ?? 14 }}
        />
      )
    }
    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: p.height ?? 200,
          borderRadius: p.radius ?? 14,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${g1}, ${g2})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {p.poster ? (
          <img src={p.poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
        <span
          style={{
            position: 'relative',
            width: 54,
            height: 54,
            borderRadius: 27,
            background: 'rgba(0,0,0,.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name="play" size={26} color="#fff" filled />
        </span>
      </div>
    )
  }

  case 'richText': {
    const bg = pick(p.background, '#ffffff')
    return (
      <div
        style={{
          background: bg,
          borderRadius: p.radius ?? 14,
          padding: '14px 16px',
          fontSize: 14,
          lineHeight: 1.7,
          color: sub,
          overflow: 'hidden',
        }}
        className="mp-rich"
        dangerouslySetInnerHTML={{ __html: p.html || '' }}
      />
    )
  }

  case 'divider':
      return (
        <div
          style={{
            height: 0,
            borderTop: `${Math.max(1, p.height ?? 1)}px ${p.dashed ? 'dashed' : 'solid'} ${p.color ?? '#eef0f4'}`,
          }}
        />
      )

    case 'blank':
      return <div style={{ height: p.height ?? 16 }} />

    /* ---------------- 导航 ---------------- */
    case 'search':
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: p.align === 'center' ? 'center' : 'flex-start',
            gap: 6,
            height: 38,
            padding: '0 14px',
            borderRadius: p.radius ?? 20,
            background: p.background ?? '#f4f6f9',
          }}
        >
          <Icon name="search" size={15} color="#9aa3b2" />
          <span style={{ fontSize: 13, color: '#9aa3b2' }}>{p.placeholder}</span>
          {p.showScan ? <Icon name="camera" size={15} color="#9aa3b2" /> : null}
        </div>
      )

    case 'notice':
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 12px',
            borderRadius: 10,
            background: p.background ?? '#fff8e6',
          }}
        >
          {p.icon ? <Icon name={p.icon} size={15} color={p.color ?? '#d97706'} /> : null}
          <div style={{ flex: 1, fontSize: 12, color: p.color ?? '#d97706', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.text}</div>
          {p.more ? <Icon name="chevronRight" size={13} color={p.color ?? '#d97706'} /> : null}
        </div>
      )

    case 'swiper': {
      const h = p.height ?? 168
      return <SwiperBlock items={items} height={h} radius={p.radius ?? 14} indicator={p.indicator ?? 'dot'} seed={seed} />
    }

    case 'grid': {
      const cols = Number(p.columns ?? 4)
      const iconBg = pick(p.iconBg, hexToRgba(primary, 0.1))
      const iconColor = pick(p.iconColor, primary)
      return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Icon name={it.icon || 'star'} size={p.iconSize ?? 24} color={iconColor} />
                {it.badge ? (
                  <span
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -6,
                      background: T.secondary ?? '#ff6b35',
                      color: '#fff',
                      fontSize: 9,
                      padding: '1px 4px',
                      borderRadius: 8,
                      lineHeight: 1.4,
                    }}
                  >
                    {it.badge}
                  </span>
                ) : null}
              </div>
              <div style={{ fontSize: p.fontSize ?? 12, color: text, textAlign: 'center', lineHeight: 1.3 }}>{it.text}</div>
            </div>
          ))}
        </div>
      )
    }

    case 'tabs': {
      const activeIdx = Number(p.active ?? 0)
      const activeColor = pick(p.activeColor, primary)
      return (
        <div style={{ display: 'flex', gap: 18, overflowX: 'auto', padding: '6px 14px', background: p.background ?? '#fff' }} className="no-scrollbar">
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                fontSize: i === activeIdx ? 15 : 14,
                fontWeight: i === activeIdx ? 600 : 400,
                color: i === activeIdx ? activeColor : sub,
                whiteSpace: 'nowrap',
                position: 'relative',
                paddingBottom: 6,
              }}
            >
              {it.text}
              {i === activeIdx ? (
                <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 3, borderRadius: 2, background: activeColor }} />
              ) : null}
            </div>
          ))}
        </div>
      )
    }

    case 'floatBtn': {
    const bg = pick(p.bg, primary)
    const pos: Record<string, React.CSSProperties> = {
      br: { right: 12, bottom: 14 },
      bl: { left: 12, bottom: 14 },
      tr: { right: 12, top: 14 },
      tl: { left: 12, top: 14 },
    }
    const pp = pos[String(p.position)] ?? pos.br
    return (
      <div
        style={{
          position: 'sticky',
          ...pp,
          display: 'flex',
          justifyContent: p.position === 'bl' || p.position === 'tl' ? 'flex-start' : 'flex-end',
          zIndex: 60,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: p.text ? '9px 14px' : 11,
            borderRadius: 999,
            background: bg,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            boxShadow: '0 6px 18px rgba(16,24,40,.22)',
          }}
        >
          <Icon name={p.icon || 'plus'} size={18} color="#fff" />
          {p.text ? <span>{p.text}</span> : null}
        </div>
      </div>
    )
  }

  /* ---------------- 营销 ---------------- */
    case 'coupon':
      return (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }} className="no-scrollbar">
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                minWidth: 168,
                borderRadius: 10,
                overflow: 'hidden',
                background: p.background ?? '#fff1f0',
                border: `1px solid ${hexToRgba(T.secondary ?? '#ff6b35', 0.25)}`,
              }}
            >
              <div style={{ padding: '10px 12px', textAlign: 'center', borderRight: `1px dashed ${hexToRgba(T.secondary ?? '#ff6b35', 0.35)}` }}>
                <div style={{ color: T.secondary ?? '#ff6b35', fontWeight: 700, fontSize: 20, lineHeight: 1.1 }}>
                  <span style={{ fontSize: 11 }}>¥</span>
                  {it.amount}
                </div>
                <div style={{ fontSize: 10, color: sub, marginTop: 2 }}>{it.condition}</div>
              </div>
              <div style={{ flex: 1, padding: '8px 10px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{it.name}</div>
                <div style={{ fontSize: 11, color: sub, marginTop: 3 }}>有效期至 2026.12.31</div>
              </div>
              <div style={{ padding: '0 8px' }}>
                <div style={{ background: T.secondary ?? '#ff6b35', color: '#fff', fontSize: 11, padding: '5px 9px', borderRadius: 20, whiteSpace: 'nowrap' }}>{it.tag}</div>
              </div>
            </div>
          ))}
        </div>
      )

    case 'seckill':
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: text }}>{p.title}</span>
              <Icon name="fire" size={15} color={T.secondary ?? '#ff6b35'} filled />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: sub }}>
              <Icon name="clock" size={12} color={sub} />
              {p.sub}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 14px 4px' }} className="no-scrollbar">
            {items.map((it, i) => (
              <div key={i} style={{ width: 96, flexShrink: 0 }}>
                <SmartImage src={it.image} g1={it._g1} g2={it._g2} ratio={1} radius={8} />
                <div style={{ fontSize: 12, color: text, marginTop: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
                  <span style={{ color: T.secondary ?? '#ff6b35', fontWeight: 700, fontSize: 14 }}>
                    <span style={{ fontSize: 10 }}>¥</span>
                    {it.price}
                  </span>
                  <span style={{ fontSize: 10, color: '#b9c0cc', textDecoration: 'line-through' }}>¥{it.origin}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'banner': {
      const [g1, g2] = paletteAt(seed)
      return (
        <SmartImage src={p.image} g1={g1} g2={g2} radius={12} height={104}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,.45), rgba(0,0,0,0))', borderRadius: 12 }} />
          <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, zIndex: 2 }}>
            <div style={{ color: '#fff', fontSize: 17, fontWeight: 700 }}>{p.title}</div>
            <div style={{ color: 'rgba(255,255,255,.85)', fontSize: 12 }}>{p.sub}</div>
            {p.buttonText ? (
              <div style={{ alignSelf: 'flex-start', background: '#fff', color: '#e0553a', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20, marginTop: 2 }}>{p.buttonText}</div>
            ) : null}
          </div>
        </SmartImage>
      )
    }

    case 'countdown': {
      const raw: [string, string][] = [
        [p.days, '天'],
        [p.hours, '时'],
        [p.minutes, '分'],
        [p.seconds, '秒'],
      ]
      const blocks = raw.filter(([v]) => v !== '' && v !== undefined && v !== null)
      return (
        <div
          style={{
            margin: '0 14px',
            background: `linear-gradient(120deg, ${primary} 0%, ${hexToRgba(primary, 0.72)} 100%)`,
            borderRadius: 12,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 600, flex: 1 }}>{p.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            {blocks.map(([b, label], i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <span style={{ background: 'rgba(255,255,255,.22)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 6px', borderRadius: 4, minWidth: 24, textAlign: 'center' }}>{b}</span>
                <span style={{ color: 'rgba(255,255,255,.8)', fontSize: 11 }}>{label}</span>
              </span>
            ))}
          </div>
        </div>
      )
    }

    /* ---------------- 交易 ---------------- */
    case 'goods': {
      const layout = p.layout ?? 'grid'
      const cols = Number(p.columns ?? 2)
      if (layout === 'row') {
        return (
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 12px' }} className="no-scrollbar">
            {items.map((it, i) => (
              <div key={i} style={{ width: 132, flexShrink: 0, background: T.cardBg ?? '#fff', borderRadius: 12, overflow: 'hidden' }}>
                <SmartImage src={it.image} g1={it._g1} g2={it._g2} ratio={1} radius={0}>
                  {it.tag ? (
                    <span style={{ position: 'absolute', left: 6, top: 6, background: T.secondary ?? '#ff6b35', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>{it.tag}</span>
                  ) : null}
                </SmartImage>
                <div style={{ padding: '7px 8px 9px' }}>
                  <div style={{ fontSize: 13, color: text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                  <div style={{ fontSize: 10, color: sub, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.desc}</div>
                  {p.showPrice !== false ? (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 5 }}>
                      <span style={{ color: T.secondary ?? '#ff6b35', fontWeight: 700, fontSize: 14 }}>
                        <span style={{ fontSize: 10 }}>¥</span>
                        {it.price}
                      </span>
                      {it.origin ? <span style={{ fontSize: 10, color: '#b9c0cc', textDecoration: 'line-through' }}>¥{it.origin}</span> : null}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )
      }
      if (layout === 'list') {
        return (
          <div style={{ background: T.cardBg ?? '#fff', borderRadius: 12, overflow: 'hidden' }}>
            {items.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: 10, borderBottom: i < items.length - 1 ? '1px solid #f2f4f7' : 'none' }}>
                <SmartImage src={it.image} g1={it._g1} g2={it._g2} width={86} height={86} radius={8} />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 14, color: text, fontWeight: 500 }}>{it.name}</div>
                  <div style={{ fontSize: 11, color: sub, marginTop: 4, lineHeight: 1.5 }}>{it.desc}</div>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    {p.showPrice !== false ? (
                      <span style={{ color: T.secondary ?? '#ff6b35', fontWeight: 700, fontSize: 15 }}>
                        <span style={{ fontSize: 11 }}>¥</span>
                        {it.price}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span style={{ fontSize: 10, color: '#b0b8c9' }}>{it.sales} 人已选</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
      return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10, padding: '4px 2px' }}>
          {items.map((it, i) => (
            <div key={i} style={{ background: T.cardBg ?? '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(16,24,40,.04)' }}>
              <SmartImage src={it.image} g1={it._g1} g2={it._g2} ratio={1} radius={0}>
                {it.tag ? (
                  <span style={{ position: 'absolute', left: 6, top: 6, background: T.secondary ?? '#ff6b35', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>{it.tag}</span>
                ) : null}
              </SmartImage>
              <div style={{ padding: '8px 9px 10px' }}>
                <div style={{ fontSize: 13, color: text, fontWeight: 500, lineHeight: 1.4, height: 36, overflow: 'hidden' }}>{it.name}</div>
                <div style={{ fontSize: 10, color: sub, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.desc}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
                  {p.showPrice !== false ? (
                    <span style={{ color: T.secondary ?? '#ff6b35', fontWeight: 700, fontSize: 15 }}>
                      <span style={{ fontSize: 11 }}>¥</span>
                      {it.price}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span style={{ fontSize: 10, color: '#b0b8c9' }}>{it.sales} 已售</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    case 'shop': {
      const [g1, g2] = paletteAt(seed)
      const tags: string[] = (p.tags ?? []) as string[]
      return (
        <div style={{ padding: 14 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <SmartImage src={p.logo} g1={g1} g2={g2} width={58} height={58} radius={10}>
              <Icon name="pin" size={22} color="rgba(255,255,255,.85)" />
            </SmartImage>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: text }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                <Stars value={5} size={12} />
                <span style={{ fontSize: 12, color: T.secondary ?? '#ff6b35', fontWeight: 600 }}>{p.rating}</span>
                <span style={{ fontSize: 11, color: sub }}>{p.desc}</span>
              </div>
              <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
                {tags.map((t, i) => (
                  <span key={i} style={{ fontSize: 10, color: primary, background: hexToRgba(primary, 0.1), padding: '2px 7px', borderRadius: 4 }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height: 1, background: '#f0f2f6', margin: '12px 0' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Icon name="pin" size={14} color={sub} />
            <span style={{ flex: 1, fontSize: 12, color: sub, lineHeight: 1.6 }}>{p.address}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
            <Icon name="clock" size={14} color={sub} />
            <span style={{ flex: 1, fontSize: 12, color: sub }}>营业时间 {p.hours}</span>
            <span style={{ fontSize: 12, color: primary, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Icon name="phone" size={13} color={primary} />
              {p.phone}
            </span>
          </div>
        </div>
      )
    }

    case 'cartBar': {
      const body = (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 14px',
            background: '#fff',
            borderTop: '1px solid #eef0f4',
            boxShadow: '0 -2px 12px rgba(16,24,40,.06)',
          }}
        >
          <div style={{ position: 'relative' }}>
            <Icon name="cart" size={24} color={primary} />
            {p.count ? (
              <span style={{ position: 'absolute', top: -4, right: -7, background: T.secondary ?? '#ff6b35', color: '#fff', fontSize: 9, minWidth: 15, height: 15, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                {p.count}
              </span>
            ) : null}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: text }}>
              {p.total}
              {p.tip ? <span style={{ fontSize: 10, color: T.secondary ?? '#ff6b35', fontWeight: 400, marginLeft: 6 }}>{p.tip}</span> : null}
            </div>
          </div>
          <div style={{ background: primary, color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 22px', borderRadius: 22 }}>{p.buttonText}</div>
        </div>
      )
      return p.fixed === false ? body : <div style={{ position: 'sticky', bottom: 0, zIndex: 20 }}>{body}</div>
    }

    case 'priceCard':
      return (
        <div style={{ display: 'flex', gap: 9, padding: '4px 2px' }}>
          {items.map((it, i) => {
            const feats = String(it.features ?? '').split('\n').filter(Boolean)
            const hi = !!it.highlight
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: hi ? `linear-gradient(170deg, ${hexToRgba(primary, 0.08)}, #fff 60%)` : T.cardBg ?? '#fff',
                  border: `1px solid ${hi ? primary : '#eef0f4'}`,
                  borderRadius: 12,
                  padding: '12px 10px',
                  position: 'relative',
                }}
              >
                {hi ? (
                  <span style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', background: primary, color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap' }}>
                    最受欢迎
                  </span>
                ) : null}
                <div style={{ fontSize: 13, color: hi ? primary : sub, textAlign: 'center', fontWeight: 500 }}>{it.name}</div>
                <div style={{ textAlign: 'center', marginTop: 8, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
                  <span style={{ fontSize: 13, color: text }}>¥</span>
                  <span style={{ fontSize: 24, fontWeight: 700, color: text, lineHeight: 1 }}>{it.price}</span>
                  <span style={{ fontSize: 10, color: sub }}>{it.period}</span>
                </div>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {feats.map((ftext: string, fi: number) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: sub }}>
                      <Icon name="check" size={11} color={hi ? primary : '#c3cad6'} />
                      <span style={{ lineHeight: 1.4 }}>{ftext}</span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    textAlign: 'center',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '7px 0',
                    borderRadius: 20,
                    background: hi ? primary : hexToRgba(primary, 0.08),
                    color: hi ? '#fff' : primary,
                  }}
                >
                  {it.btnText}
                </div>
              </div>
            )
          })}
        </div>
      )

    /* ---------------- 内容 ---------------- */
    case 'article':
      return (
        <div style={{ background: T.cardBg ?? '#fff', borderRadius: 12, overflow: 'hidden' }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: 12, borderBottom: i < items.length - 1 ? '1px solid #f2f4f7' : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: text, fontWeight: 500, lineHeight: 1.45 }}>{it.title}</div>
                <div style={{ fontSize: 11, color: sub, marginTop: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7, fontSize: 10, color: '#b0b8c9' }}>
                  <span>{it.author}</span>
                  <span>·</span>
                  <span>{it.date}</span>
                  <span>·</span>
                  <span>{it.views} 阅读</span>
                </div>
              </div>
              <SmartImage src={it.image} g1={it._g1} g2={it._g2} width={92} height={66} radius={8} />
            </div>
          ))}
        </div>
      )

    case 'comment': {
      const tagsOf = (v: any): string[] => (typeof v === 'string' ? v.split(/[,，]/).filter(Boolean) : (v ?? []) as string[])
      return (
        <div style={{ background: T.cardBg ?? '#fff', borderRadius: 12, padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px 10px' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: text }}>
              {p.title}
              <span style={{ fontSize: 11, color: sub, fontWeight: 400, marginLeft: 6 }}>({p.count})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Stars value={5} size={11} />
              <span style={{ fontSize: 13, color: T.secondary ?? '#ff6b35', fontWeight: 700 }}>{p.rating}</span>
            </div>
          </div>
          {items.map((it, i) => (
            <div key={i} style={{ padding: '10px 14px', borderTop: i === 0 ? '1px solid #f2f4f7' : '1px dashed #f2f4f7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SmartImage src={it.avatar} g1={it._g1} g2={it._g2} width={30} height={30} radius={15}>
                  <span style={{ color: '#fff', fontSize: 11 }}>{String(it.name ?? '').slice(0, 1)}</span>
                </SmartImage>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: text, fontWeight: 500 }}>{it.name}</div>
                </div>
                <Stars value={Number(it.rating ?? 5)} size={11} />
              </div>
              <div style={{ fontSize: 12, color: '#5b6472', lineHeight: 1.7, marginTop: 7 }}>{it.content}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7 }}>
                {tagsOf(it.tags).map((t: string, ti: number) => (
                  <span key={ti} style={{ fontSize: 10, color: sub, background: '#f4f6f9', padding: '2px 7px', borderRadius: 4 }}>
                    {t}
                  </span>
                ))}
                <span style={{ fontSize: 10, color: '#b0b8c9', marginLeft: 'auto' }}>{it.date}</span>
              </div>
            </div>
          ))}
        </div>
      )
    }

    case 'team': {
      const tagsOf = (v: any): string[] => (typeof v === 'string' ? v.split(/[,，]/).filter(Boolean) : (v ?? []) as string[])
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, background: T.cardBg ?? '#fff', borderRadius: 12, padding: 12, boxShadow: '0 1px 4px rgba(16,24,40,.04)' }}>
              <SmartImage src={it.avatar} g1={it._g1} g2={it._g2} width={62} height={62} radius={31}>
                <span style={{ color: '#fff', fontSize: 20, fontWeight: 600 }}>{String(it.name ?? '').slice(0, 1)}</span>
              </SmartImage>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: text }}>{it.name}</span>
                  <span style={{ fontSize: 11, color: primary, background: hexToRgba(primary, 0.1), padding: '1px 6px', borderRadius: 4 }}>{it.title}</span>
                </div>
                <div style={{ fontSize: 11, color: sub, marginTop: 5, lineHeight: 1.6 }}>{it.desc}</div>
                <div style={{ display: 'flex', gap: 5, marginTop: 7, flexWrap: 'wrap' }}>
                  {tagsOf(it.tags).map((t: string, ti: number) => (
                    <span key={ti} style={{ fontSize: 10, color: sub, border: '1px solid #eef0f4', padding: '1px 6px', borderRadius: 4 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    case 'faq':
      return (
        <div style={{ background: T.cardBg ?? '#fff', borderRadius: 12, overflow: 'hidden' }}>
          {items.map((it, i) => (
            <div key={i} style={{ padding: '12px 14px', borderBottom: i < items.length - 1 ? '1px solid #f2f4f7' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 18, height: 18, borderRadius: 5, background: hexToRgba(primary, 0.12), color: primary, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700 }}>
                  Q
                </span>
                <span style={{ flex: 1, fontSize: 13, color: text, fontWeight: 500 }}>{it.q}</span>
                <Icon name={i === 0 ? 'chevronDown' : 'chevronRight'} size={14} color="#c3cad6" />
              </div>
              {i === 0 ? <div style={{ fontSize: 12, color: sub, lineHeight: 1.75, marginTop: 7, paddingLeft: 26 }}>{it.a}</div> : null}
            </div>
          ))}
        </div>
      )

    case 'steps': {
      const row = p.direction !== 'column'
      if (row) {
        return (
          <div style={{ display: 'flex', padding: '6px 8px 10px' }}>
            {items.map((it, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {i > 0 ? <span style={{ position: 'absolute', top: 15, left: 0, width: '50%', height: 1, background: '#e6e9f0' }} /> : null}
                {i < items.length - 1 ? <span style={{ position: 'absolute', top: 15, left: '50%', width: '50%', height: 1, background: '#e6e9f0' }} /> : null}
                <div style={{ width: 30, height: 30, borderRadius: 15, background: hexToRgba(primary, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                  <Icon name={it.icon || 'check'} size={15} color={primary} />
                </div>
                <div style={{ fontSize: 12, color: text, fontWeight: 500, marginTop: 6, textAlign: 'center' }}>{it.title}</div>
                <div style={{ fontSize: 10, color: sub, marginTop: 3, textAlign: 'center', lineHeight: 1.4, padding: '0 2px' }}>{it.desc}</div>
              </div>
            ))}
          </div>
        )
      }
      return (
        <div style={{ padding: '8px 14px 12px' }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, position: 'relative', paddingBottom: i < items.length - 1 ? 14 : 0 }}>
              {i < items.length - 1 ? <span style={{ position: 'absolute', left: 12, top: 27, bottom: 0, width: 1, background: '#e6e9f0' }} /> : null}
              <div style={{ width: 25, height: 25, borderRadius: 13, background: hexToRgba(primary, 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 2, marginTop: 2 }}>
                <Icon name={it.icon || 'check'} size={13} color={primary} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: text, fontWeight: 500 }}>{it.title}</div>
                <div style={{ fontSize: 11, color: sub, marginTop: 3, lineHeight: 1.5 }}>{it.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    case 'stats': {
      const bg = p.background || `linear-gradient(120deg, ${primary} 0%, ${hexToRgba(primary, 0.68)} 100%)`
      return (
        <div style={{ margin: '0 0', background: bg, borderRadius: (node.style.radius ?? 14) || 12, padding: '14px 8px', display: 'flex' }}>
          {items.map((it, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, lineHeight: 1.2 }}>{it.value}</div>
              <div style={{ color: 'rgba(255,255,255,.82)', fontSize: 10, marginTop: 4 }}>{it.label}</div>
            </div>
          ))}
        </div>
      )
    }

    case 'timeline':
      return (
        <div style={{ background: T.cardBg ?? '#fff', borderRadius: 12, padding: '12px 14px' }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: i < items.length - 1 ? 16 : 0 }}>
              {i < items.length - 1 ? <span style={{ position: 'absolute', left: 3, top: 12, bottom: 0, width: 1, background: '#eef0f4' }} /> : null}
              <span style={{ width: 7, height: 7, borderRadius: 4, background: i === 0 ? primary : '#dfe3ea', marginTop: 5, flexShrink: 0, zIndex: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: primary, fontWeight: 600 }}>{it.time}</div>
                <div style={{ fontSize: 13, color: text, fontWeight: 500, marginTop: 3 }}>{it.title}</div>
                <div style={{ fontSize: 11, color: sub, marginTop: 3, lineHeight: 1.6 }}>{it.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )

    /* ---------------- 表单 ---------------- */
    case 'form': {
      const fields: any[] = (p.fields ?? []) as any[]
      return (
        <div style={{ background: T.cardBg ?? '#fff', borderRadius: 12, padding: '14px' }}>
          {p.title ? <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 10 }}>{p.title}</div> : null}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fields.map((fld: any, i: number) => (
              <div key={i}>
                <div style={{ fontSize: 12, color: sub, marginBottom: 5 }}>
                  {fld.required ? <span style={{ color: T.secondary ?? '#ff6b35', marginRight: 2 }}>*</span> : null}
                  {fld.label}
                </div>
                <div
                  style={{
                    minHeight: fld.type === 'textarea' ? 74 : 38,
                    borderRadius: 8,
                    border: '1px solid #eef0f4',
                    background: '#fafbfc',
                    padding: '9px 11px',
                    fontSize: 12,
                    color: '#b3bac6',
                    display: 'flex',
                    alignItems: fld.type === 'textarea' ? 'flex-start' : 'center',
                  }}
                >
                  {fld.placeholder}
                  {fld.type === 'date' || fld.type === 'picker' ? (
                    <span style={{ marginLeft: 'auto' }}>
                      <Icon name={fld.type === 'date' ? 'calendar' : 'chevronRight'} size={14} color="#c3cad6" />
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, background: primary, color: '#fff', textAlign: 'center', fontSize: 14, fontWeight: 600, padding: '11px 0', borderRadius: 24 }}>{p.submitText}</div>
          {p.tip ? <div style={{ fontSize: 10, color: '#b0b8c9', textAlign: 'center', marginTop: 8 }}>{p.tip}</div> : null}
        </div>
      )
    }

    case 'map': {
      const [g1, g2] = paletteAt(seed)
      return (
        <div style={{ background: T.cardBg ?? '#fff', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ position: 'relative', height: 132, background: `linear-gradient(135deg, ${hexToRgba(g1, 0.28)} 0%, ${hexToRgba(g2, 0.28)} 100%)` }}>
            <svg width="100%" height="132" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <pattern id={`grid-${node.id}`} width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M28 0H0V28" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="132" fill={`url(#grid-${node.id})`} />
              <path d="M-10 88 L140 40" stroke="rgba(255,255,255,.85)" strokeWidth="6" fill="none" />
              <path d="M40 -10 L70 150" stroke="rgba(255,255,255,.85)" strokeWidth="5" fill="none" />
              <path d="M-10 30 L200 70" stroke="rgba(255,255,255,.6)" strokeWidth="3" fill="none" />
              <rect x="20" y="18" width="42" height="30" rx="4" fill="rgba(255,255,255,.5)" />
              <rect x="180" y="80" width="56" height="34" rx="4" fill="rgba(255,255,255,.5)" />
            </svg>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ background: '#fff', borderRadius: 8, padding: '4px 8px', fontSize: 10, color: text, boxShadow: '0 2px 8px rgba(0,0,0,.12)', marginBottom: 4, whiteSpace: 'nowrap' }}>
                {p.title}
              </span>
              <Icon name="pin" size={26} color={T.secondary ?? '#ff6b35'} filled />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: text, fontWeight: 500 }}>{p.title}</div>
              <div style={{ fontSize: 11, color: sub, marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address}</div>
            </div>
            <span style={{ fontSize: 10, color: sub, flexShrink: 0 }}>{p.distance}</span>
            <span style={{ background: primary, color: '#fff', fontSize: 11, padding: '6px 12px', borderRadius: 18, flexShrink: 0 }}>{p.buttonText}</span>
          </div>
        </div>
      )
    }

    case 'contact':
      return (
        <div style={{ background: T.cardBg ?? '#fff', borderRadius: 12, overflow: 'hidden' }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: i < items.length - 1 ? '1px solid #f2f4f7' : 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: hexToRgba(primary, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={it.icon || 'phone'} size={15} color={primary} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: sub }}>{it.label}</div>
                <div style={{ fontSize: 13, color: text, marginTop: 2 }}>{it.value}</div>
              </div>
              {it.action ? (
                <span style={{ fontSize: 11, color: primary, border: `1px solid ${hexToRgba(primary, 0.3)}`, padding: '4px 10px', borderRadius: 16, flexShrink: 0 }}>{it.action}</span>
              ) : null}
            </div>
          ))}
        </div>
      )

    case 'serviceBar':
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: sub }}>
              <Icon name={it.icon || 'shield'} size={13} color={primary} />
              {it.text}
            </div>
          ))}
        </div>
      )

    case 'footer':
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#b0b8c9' }}>{p.text}</div>
          {p.links ? <div style={{ fontSize: 10, color: '#c3cad6', marginTop: 6 }}>{p.links}</div> : null}
        </div>
      )

    default:
      return <div style={{ fontSize: 12, color: '#c3cad6', textAlign: 'center', padding: '10px 0' }}>未识别组件：{node.type}</div>
  }
}

/* ------------------------------------------------------------------ */

function SwiperBlock({ items, height, radius, indicator, seed }: { items: any[]; height: number; radius: number; indicator: string; seed: number }) {
  const [a, b] = paletteAt(seed)
  const list = items.length ? items : [{ image: '', title: '', desc: '', _g1: a, _g2: b }]
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', borderRadius: radius }} className="no-scrollbar">
        {list.map((it, i) => (
          <div key={i} style={{ scrollSnapAlign: 'start', flex: '0 0 100%', position: 'relative' }}>
            <SmartImage src={it.image} g1={it._g1 ?? a} g2={it._g2 ?? b} height={height} radius={radius}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,.42), rgba(0,0,0,0) 55%)', borderRadius: radius }} />
              <div style={{ position: 'absolute', left: 16, bottom: 14, zIndex: 2, maxWidth: '78%' }}>
                <div style={{ color: '#fff', fontSize: 17, fontWeight: 700, textShadow: '0 1px 6px rgba(0,0,0,.25)' }}>{it.title}</div>
                {it.desc ? <div style={{ color: 'rgba(255,255,255,.9)', fontSize: 11, marginTop: 4 }}>{it.desc}</div> : null}
              </div>
            </SmartImage>
          </div>
        ))}
      </div>
      {indicator === 'dot' && list.length > 1 ? (
        <div style={{ position: 'absolute', bottom: 10, right: 14, display: 'flex', gap: 4 }}>
          {list.map((_, i) => (
            <span key={i} style={{ width: i === 0 ? 12 : 5, height: 5, borderRadius: 3, background: i === 0 ? '#fff' : 'rgba(255,255,255,.55)' }} />
          ))}
        </div>
      ) : null}
      {indicator === 'number' ? (
        <div style={{ position: 'absolute', bottom: 10, right: 14, background: 'rgba(0,0,0,.35)', color: '#fff', fontSize: 10, padding: '2px 7px', borderRadius: 10 }}>
          1/{list.length}
        </div>
      ) : null}
    </div>
  )
}

export { NodeChildren }
