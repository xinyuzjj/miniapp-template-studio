import type { MpPage, MpProject } from '../types'
import { NodeRenderer, ThemeProvider, SelectProvider } from '../render/NodeRenderer'
import { Icon } from '../render/primitives'
import { decorate } from '../core/palette'

function StatusBar({ dark }: { dark: boolean }) {
  const c = dark ? '#111' : '#fff'
  return (
    <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 22px 6px', flexShrink: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: c, letterSpacing: 0.3, width: 44 }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill={c}>
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" opacity="0.35" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke={c} strokeWidth="1.4">
          <path d="M1 3.6a9 9 0 0 1 13 0" strokeLinecap="round" />
          <path d="M3.4 6.2a5.6 5.6 0 0 1 8.2 0" strokeLinecap="round" />
          <circle cx="7.5" cy="9" r="1.3" fill={c} stroke="none" />
        </svg>
        <div style={{ width: 22, height: 11, border: `1px solid ${c}`, borderRadius: 3, opacity: 0.9, position: 'relative', padding: 1.5 }}>
          <div style={{ width: '68%', height: '100%', background: c, borderRadius: 1.5 }} />
          <div style={{ position: 'absolute', right: -3, top: 3.5, width: 1.5, height: 4, background: c, opacity: 0.6, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  )
}

function NavBar({ title, bg, textStyle }: { title: string; bg: string; textStyle: 'black' | 'white' }) {
  const dark = textStyle !== 'white'
  return (
    <div
      style={{
        height: 44,
        background: bg || '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        position: 'relative',
        flexShrink: 0,
        borderBottom: '1px solid rgba(0,0,0,.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 1, width: 78 }}>
        <Icon name="chevronRight" size={16} color={dark ? '#1a1d28' : '#fff'} />
        <div style={{ width: 26, height: 26, border: `1px solid ${dark ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.35)'}`, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="home" size={13} color={dark ? '#1a1d28' : '#fff'} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 15, fontWeight: 500, color: dark ? '#1a1d28' : '#fff', pointerEvents: 'none' }}>
        {title}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
        <div
          style={{
            height: 30,
            width: 78,
            border: `1px solid ${dark ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,.3)'}`,
            borderRadius: 15,
            background: dark ? 'rgba(247,247,247,.85)' : 'rgba(0,0,0,.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            position: 'relative',
          }}
        >
          <span style={{ display: 'flex', gap: 3 }}>
            <span style={{ width: 4, height: 4, borderRadius: 2, background: dark ? '#1a1d28' : '#fff' }} />
            <span style={{ width: 4, height: 4, borderRadius: 2, background: dark ? '#1a1d28' : '#fff' }} />
            <span style={{ width: 4, height: 4, borderRadius: 2, background: dark ? '#1a1d28' : '#fff' }} />
          </span>
          <span style={{ width: 1, height: 16, background: dark ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,.25)' }} />
          <span style={{ width: 14, height: 14, borderRadius: 7, border: `1.5px solid ${dark ? '#1a1d28' : '#fff'}` }} />
        </div>
      </div>
    </div>
  )
}

function TabBarView({ project, activePath, onSwitch }: { project: MpProject; activePath: string; onSwitch?: (path: string) => void }) {
  const tb = project.tabBar
  if (!tb.enabled || !tb.items.length) return null
  return (
    <div
      style={{
        height: 58,
        background: tb.background,
        borderTop: `1px solid ${tb.borderStyle === 'black' ? '#e6e8ee' : '#f0f1f4'}`,
        display: 'flex',
        paddingBottom: 6,
        flexShrink: 0,
      }}
    >
      {tb.items.map((it) => {
        const active = it.pagePath === activePath
        const color = active ? tb.selectedColor : tb.color
        return (
          <div
            key={it.pagePath + it.text}
            onClick={() => onSwitch?.(it.pagePath)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, cursor: onSwitch ? 'pointer' : 'default' }}
          >
            <Icon name={it.icon} size={22} color={color} filled={active} strokeWidth={active ? 2 : 1.8} />
            <span style={{ fontSize: 10, color, lineHeight: 1 }}>{it.text}</span>
          </div>
        )
      })}
    </div>
  )
}

export function PhoneFrame({
  project,
  page,
  width = 375,
  height = 760,
  editable = false,
  selectedId,
  onSelect,
  onSwitchPage,
}: {
  project: MpProject
  page: MpPage
  width?: number
  height?: number
  editable?: boolean
  selectedId?: string | null
  onSelect?: (id: string) => void
  onSwitchPage?: (path: string) => void
}) {
  const nodes = decorate(page.nodes)
  return (
    <ThemeProvider value={project.theme}>
      <SelectProvider value={{ selectedId, onSelect }}>
        <div className="phone-shell" style={{ width, height }}>
          <div className="phone-notch" />
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 34,
              overflow: 'hidden',
              background: page.background || project.theme.background,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <StatusBar dark={page.navText !== 'white'} />
            <NavBar title={page.navTitle} bg={page.navBg} textStyle={page.navText} />
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 12 }} className="thin-scroll">
              {nodes.map((n, i) => (
                <NodeRenderer key={n.id} node={n} editable={editable} isLast={i === nodes.length - 1} />
              ))}
            </div>
            <TabBarView project={project} activePath={page.path} onSwitch={onSwitchPage} />
          </div>
        </div>
      </SelectProvider>
    </ThemeProvider>
  )
}
