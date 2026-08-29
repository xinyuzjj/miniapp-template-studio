import { useState } from 'react'
import { useApp, useSelectedNode, useCurrentPage } from '../store/useApp'
import { REGISTRY } from '../core/registry'
import { FieldControl } from './fields'
import { Icon } from '../render/primitives'
import { ICON_KEYS } from '../core/icons'
import type { MpNode, NodeStyle } from '../types'
import { Layers, Palette, Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react'

/* ---------------- 属性面板 ---------------- */

const STYLE_FIELDS: { key: keyof NodeStyle; label: string; max: number }[] = [
  { key: 'marginTop', label: '上外边距', max: 100 },
  { key: 'marginBottom', label: '下外边距', max: 100 },
  { key: 'paddingTop', label: '上内边距', max: 60 },
  { key: 'paddingBottom', label: '下内边距', max: 60 },
  { key: 'paddingLeft', label: '左右内边距', max: 40 },
  { key: 'radius', label: '圆角', max: 40 },
]

function NodeProps({ node }: { node: MpNode }) {
  const updateNodeProps = useApp((s) => s.updateNodeProps)
  const updateNodeStyle = useApp((s) => s.updateNodeStyle)
  const updateNodeLink = useApp((s) => s.updateNodeLink)
  const pages = useApp((s) => s.project?.pages ?? [])
  const setPage = useApp((s) => s.setPage)
  const saveBlock = useApp((s) => s.saveBlock)
  const [saving, setSaving] = useState(false)
  const [blkName, setBlkName] = useState('')
  const def = REGISTRY[node.type]

  if (!def) {
    return <div className="p-5 text-[13px] text-ink-400">未注册的组件类型：{node.type}</div>
  }

  const linkTo = node.link?.to || ''
  const testJump = () => {
    if (!linkTo) return
    const target = pages.find((p) => p.path === linkTo)
    if (target) setPage(target.id)
  }
  const confirmSave = () => {
    saveBlock(blkName.trim(), node.id)
    setSaving(false)
    setBlkName('')
  }

  return (
    <div className="p-4">
      <div className="flex items-start gap-2.5 pb-3 mb-3 border-b border-ink-100">
        <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
          <Icon name={def.icon} size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-ink-800">{def.name}</div>
          <div className="text-[11px] text-ink-400 mt-0.5 leading-snug">{def.desc}</div>
        </div>
      </div>

      {def.fields.map((f) => (
        <FieldControl key={f.key} field={f} value={node.props[f.key]} onChange={(v) => updateNodeProps(node.id, { [f.key]: v })} />
      ))}

      <div className="mt-5 pt-4 border-t border-ink-100">
        <div className="text-[11.5px] font-semibold text-ink-600 mb-3">外观样式</div>
        <div className="grid grid-cols-2 gap-x-2.5">
          {STYLE_FIELDS.map((s) => (
            <label key={String(s.key)} className="block mb-2.5">
              <span className="block text-[11px] text-ink-500 mb-1">{s.label}</span>
              <input
                type="number"
                min={0}
                max={s.max}
                value={(node.style[s.key] as number) ?? 0}
                onChange={(e) => updateNodeStyle(node.id, { [s.key]: Number(e.target.value) || 0 } as NodeStyle)}
                className="w-full h-8 px-2.5 rounded-lg border border-ink-200 bg-white text-[12.5px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </label>
          ))}
        </div>
        <label className="block mb-2.5">
          <span className="block text-[11px] text-ink-500 mb-1">背景色（留空为透明）</span>
          <div className="flex gap-1.5">
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(node.style.background || '') ? node.style.background! : '#ffffff'}
              onChange={(e) => updateNodeStyle(node.id, { background: e.target.value })}
              className="w-8 h-8 rounded-lg cursor-pointer flex-shrink-0"
            />
            <input
              value={node.style.background ?? ''}
              onChange={(e) => updateNodeStyle(node.id, { background: e.target.value })}
              placeholder="transparent / #ffffff"
              className="flex-1 h-8 px-2.5 rounded-lg border border-ink-200 bg-white text-[12.5px] outline-none focus:border-brand-400"
            />
          </div>
        </label>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] text-ink-500">阴影</span>
          <div className="flex gap-1">
            {[
              { v: 0, t: '无' },
              { v: 1, t: '轻' },
              { v: 2, t: '重' },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => updateNodeStyle(node.id, { shadow: o.v as 0 | 1 | 2 })}
                className={`px-2.5 h-7 rounded-lg text-[11.5px] border transition ${
                  (node.style.shadow ?? 0) === o.v ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-ink-500 border-ink-200 hover:border-brand-300'
                }`}
              >
                {o.t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 交互：页面跳转 */}
      <div className="mt-5 pt-4 border-t border-ink-100">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11.5px] font-semibold text-ink-600">页面跳转</div>
          {linkTo ? (
            <button onClick={testJump} className="text-[11px] text-brand-600 hover:text-brand-700 inline-flex items-center gap-0.5">
              ↗ 测试跳转
            </button>
          ) : null}
        </div>
        <select
          value={linkTo}
          onChange={(e) => updateNodeLink(node.id, e.target.value)}
          className="w-full h-8 px-2.5 rounded-lg border border-ink-200 bg-white text-[12.5px] text-ink-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        >
          <option value="">不跳转（纯展示）</option>
          {pages.map((p) => (
            <option key={p.id} value={p.path}>
              {p.name}
            </option>
          ))}
        </select>
        <div className="text-[11px] text-ink-400 mt-2 leading-relaxed">
          选择目标页后，真机与导出代码中点击该组件即可跳转；导出为小程序原生 navigate / switchTab。
        </div>
      </div>

      {/* 自定义区块 */}
      <div className="mt-5 pt-4 border-t border-ink-100">
        <div className="text-[11.5px] font-semibold text-ink-600 mb-3">保存为可复用区块</div>
        {!saving ? (
          <button
            onClick={() => setSaving(true)}
            className="w-full h-8 rounded-lg border border-dashed border-ink-200 text-ink-500 text-[11.5px] inline-flex items-center justify-center gap-1.5 hover:border-brand-300 hover:text-brand-600 transition"
          >
            <Copy size={12} /> 存为区块（含子组件组合）
          </button>
        ) : (
          <div className="space-y-2">
            <input
              autoFocus
              value={blkName}
              onChange={(e) => setBlkName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmSave()
                if (e.key === 'Escape') {
                  setSaving(false)
                  setBlkName('')
                }
              }}
              placeholder={`区块名称，如「${def.name}组合」`}
              className="w-full h-8 px-2.5 rounded-lg border border-brand-300 bg-white text-[12.5px] outline-none focus:ring-2 focus:ring-brand-100"
            />
            <div className="flex gap-1.5">
              <button
                onClick={confirmSave}
                className="flex-1 h-8 rounded-lg bg-brand-600 text-white text-[12px] font-medium hover:bg-brand-700 transition"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setSaving(false)
                  setBlkName('')
                }}
                className="flex-1 h-8 rounded-lg border border-ink-200 text-ink-500 text-[12px] hover:border-ink-300 transition"
              >
                取消
              </button>
            </div>
            <div className="text-[11px] text-ink-400 leading-relaxed">
              保存后可在左侧「区块」面板一键插入到任意页面，跨页面复用你的组合。
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- 主题面板 ---------------- */

function ThemePanel() {
  const project = useApp((s) => s.project)!
  const updateTheme = useApp((s) => s.updateTheme)
  const updateTabBar = useApp((s) => s.updateTabBar)
  const updateProject = useApp((s) => s.updateProject)
  const updatePage = useApp((s) => s.updatePage)
  const page = useCurrentPage()
  const t = project.theme
  const be = project.backend ?? { mode: 'local' as const }
  const mode = be.mode
  const inputCls =
    'w-full h-8 px-2.5 rounded-lg border border-ink-200 bg-white text-[12.5px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

  const colors: { key: keyof typeof t; label: string }[] = [
    { key: 'primary', label: '主色（按钮/图标）' },
    { key: 'primaryLight', label: '主色浅底' },
    { key: 'secondary', label: '强调色（价格）' },
    { key: 'accent', label: '点缀色' },
    { key: 'text', label: '主文字' },
    { key: 'subText', label: '次要文字' },
    { key: 'background', label: '页面背景' },
    { key: 'cardBg', label: '卡片背景' },
  ]

  return (
    <div className="p-4">
      <div className="text-[11.5px] font-semibold text-ink-600 mb-3">全局配色</div>
      {colors.map((c) => (
        <div key={String(c.key)} className="flex items-center justify-between mb-2">
          <span className="text-[11.5px] text-ink-500">{c.label}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10.5px] text-ink-300 font-mono">{String(t[c.key])}</span>
            <input type="color" value={String(t[c.key])} onChange={(e) => updateTheme({ [c.key]: e.target.value } as any)} className="w-7 h-7 rounded-lg cursor-pointer" />
          </div>
        </div>
      ))}

      <div className="mt-5 pt-4 border-t border-ink-100">
        <div className="text-[11.5px] font-semibold text-ink-600 mb-3">圆角</div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={28}
            value={t.radius}
            onChange={(e) => updateTheme({ radius: Number(e.target.value) })}
            className="flex-1 accent-brand-600"
          />
          <span className="text-[11.5px] text-ink-500 w-9 text-right">{t.radius}px</span>
        </div>
        <div className="flex gap-1.5 mt-2">
          {[0, 8, 14, 20, 26].map((r) => (
            <button
              key={r}
              onClick={() => updateTheme({ radius: r })}
              className={`flex-1 h-7 rounded-lg text-[11px] border transition ${
                t.radius === r ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-ink-500 border-ink-200 hover:border-brand-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-ink-100">
        <div className="text-[11.5px] font-semibold text-ink-600 mb-3">底部导航 TabBar</div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11.5px] text-ink-500">显示 TabBar</span>
          <button
            onClick={() => updateTabBar({ enabled: !project.tabBar.enabled })}
            className={`w-10 h-[22px] rounded-full transition relative ${project.tabBar.enabled ? 'bg-brand-600' : 'bg-ink-200'}`}
          >
            <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all ${project.tabBar.enabled ? 'left-[21px]' : 'left-[3px]'}`} />
          </button>
        </div>
        {project.tabBar.enabled ? (
          <div className="space-y-2.5">
            {['color', 'selectedColor', 'background'].map((k) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-[11.5px] text-ink-500">
                  {k === 'color' ? '未选中' : k === 'selectedColor' ? '选中' : '背景'}
                </span>
                <input
                  type="color"
                  value={String((project.tabBar as any)[k])}
                  onChange={(e) => updateTabBar({ [k]: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer"
                />
              </div>
            ))}
            <div className="pt-2 space-y-2">
              {project.tabBar.items.map((it, i) => (
                <div key={i} className="rounded-lg border border-ink-100 p-2.5">
                  <div className="flex gap-1.5 mb-2">
                    <input
                      value={it.text}
                      onChange={(e) => {
                        const items = [...project.tabBar.items]
                        items[i] = { ...it, text: e.target.value }
                        updateTabBar({ items })
                      }}
                      className="w-20 h-7 px-2 rounded-lg border border-ink-200 text-[12px] outline-none focus:border-brand-400"
                    />
                    <select
                      value={it.icon}
                      onChange={(e) => {
                        const items = [...project.tabBar.items]
                        items[i] = { ...it, icon: e.target.value }
                        updateTabBar({ items })
                      }}
                      className="flex-1 h-7 px-2 rounded-lg border border-ink-200 text-[12px] outline-none focus:border-brand-400 bg-white"
                    >
                      {ICON_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                    <div className="w-7 h-7 rounded-lg bg-ink-50 flex items-center justify-center text-brand-600">
                      <Icon name={it.icon} size={14} />
                    </div>
                  </div>
                  <select
                    value={it.pagePath}
                    onChange={(e) => {
                      const items = [...project.tabBar.items]
                      items[i] = { ...it, pagePath: e.target.value }
                      updateTabBar({ items })
                    }}
                    className="w-full h-7 px-2 rounded-lg border border-ink-200 text-[12px] outline-none focus:border-brand-400 bg-white"
                  >
                    {project.pages.map((p) => (
                      <option key={p.id} value={p.path}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {page ? (
        <div className="mt-5 pt-4 border-t border-ink-100">
          <div className="text-[11.5px] font-semibold text-ink-600 mb-3">当前页面设置</div>
          <label className="block mb-2.5">
            <span className="block text-[11px] text-ink-500 mb-1">导航标题</span>
            <input value={page.navTitle} onChange={(e) => updatePage(page.id, { navTitle: e.target.value })} className="w-full h-8 px-2.5 rounded-lg border border-ink-200 text-[12.5px] outline-none focus:border-brand-400" />
          </label>
          <label className="block mb-2.5">
            <span className="block text-[11px] text-ink-500 mb-1">页面名称（编辑器内）</span>
            <input value={page.name} onChange={(e) => updatePage(page.id, { name: e.target.value })} className="w-full h-8 px-2.5 rounded-lg border border-ink-200 text-[12.5px] outline-none focus:border-brand-400" />
          </label>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11.5px] text-ink-500">导航栏背景</span>
            <input type="color" value={page.navBg} onChange={(e) => updatePage(page.id, { navBg: e.target.value })} className="w-7 h-7 rounded-lg cursor-pointer" />
          </div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11.5px] text-ink-500">导航栏文字</span>
            <div className="flex gap-1">
              {(['black', 'white'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => updatePage(page.id, { navText: v })}
                  className={`px-2.5 h-7 rounded-lg text-[11.5px] border transition ${
                    page.navText === v ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-ink-500 border-ink-200 hover:border-brand-300'
                  }`}
                >
                  {v === 'black' ? '深色' : '白色'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] text-ink-500">页面背景</span>
            <input type="color" value={page.background} onChange={(e) => updatePage(page.id, { background: e.target.value })} className="w-7 h-7 rounded-lg cursor-pointer" />
          </div>
        </div>
      ) : null}

      <div className="mt-5 pt-4 border-t border-ink-100">
        <div className="text-[11.5px] font-semibold text-ink-600 mb-3">发布设置（AppID）</div>
        <label className="block mb-2.5">
          <span className="block text-[11px] text-ink-500 mb-1">AppID（可选）</span>
          <input
            value={project.appid === 'touristappid' ? '' : project.appid}
            onChange={(e) => updateProject({ appid: e.target.value.trim() })}
            placeholder="留空 = 测试号（免 AppID 预览）"
            className="w-full h-8 px-2.5 rounded-lg border border-ink-200 bg-white text-[12.5px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <div className="text-[11px] text-ink-400 leading-relaxed">
          预览 / 真机扫码用测试号即可，<b className="text-ink-500">无需 AppID</b>。仅正式发布需填你自己的小程序 AppID。
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-ink-100">
        <div className="text-[11.5px] font-semibold text-ink-600 mb-1">数据后端</div>
        <div className="text-[11px] text-ink-400 mb-3 leading-relaxed">
          决定导出包的购物车 / 订单 / 表单「存在哪」。切换后重新导出即可，页面代码不用改。
        </div>
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          {([
            ['local', '本地缓存'],
            ['cloud', '微信云开发'],
            ['api', '自有接口'],
          ] as const).map(([v, label]) => (
            <button
              key={v}
              onClick={() => updateProject({ backend: { ...be, mode: v } })}
              className={`h-7 rounded-lg text-[11.5px] border transition ${
                mode === v
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-ink-500 border-ink-200 hover:border-brand-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === 'local' ? (
          <div className="text-[11px] text-ink-400 leading-relaxed">
            数据存用户手机本地（<code className="text-ink-500">wx.setStorageSync</code>），
            <b className="text-ink-500">零后端、零费用</b>，导入即可跑通加购 / 下单 / 表单。换设备或清缓存会丢。
          </div>
        ) : null}

        {mode === 'cloud' ? (
          <label className="block mb-2.5">
            <span className="block text-[11px] text-ink-500 mb-1">云环境 ID</span>
            <input
              value={be.envId || ''}
              onChange={(e) => updateProject({ backend: { ...be, envId: e.target.value.trim() } })}
              placeholder="cloud1-8gxxxxxxxx"
              className={inputCls}
            />
            <span className="block text-[10.5px] text-ink-400 mt-1 leading-relaxed">
              开发者工具顶部「云开发」开通后可见。导出包会带 login / order / pay / form / cms 五个云函数，
              上传后即可真实落库与收款。
            </span>
          </label>
        ) : null}

        {mode === 'api' ? (
          <label className="block mb-2.5">
            <span className="block text-[11px] text-ink-500 mb-1">接口根地址</span>
            <input
              value={be.apiBase || ''}
              onChange={(e) => updateProject({ backend: { ...be, apiBase: e.target.value.trim() } })}
              placeholder="https://api.example.com"
              className={inputCls}
            />
            <span className="block text-[10.5px] text-ink-400 mt-1 leading-relaxed">
              需提供 <code className="text-ink-500">/api/login</code>、<code className="text-ink-500">/api/order</code>、
              <code className="text-ink-500">/api/form</code> 等接口，返回 <code className="text-ink-500">{`{ ok: true, data }`}</code>；
              域名要加进公众平台的 request 合法域名。
            </span>
          </label>
        ) : null}

        {mode !== 'local' ? (
          <label className="block mb-2.5">
            <span className="block text-[11px] text-ink-500 mb-1">订阅消息模板 ID（可选）</span>
            <input
              value={be.tmplIds || ''}
              onChange={(e) => updateProject({ backend: { ...be, tmplIds: e.target.value } })}
              placeholder="多个用英文逗号分隔"
              className={inputCls}
            />
            <span className="block text-[10.5px] text-ink-400 mt-1">
              在微信公众平台申请；填了之后表单提交完会引导用户订阅。
            </span>
          </label>
        ) : null}

        <div className="flex items-center justify-between mt-1">
          <span className="text-[11.5px] text-ink-500">开启埋点上报</span>
          <button
            onClick={() => updateProject({ backend: { ...be, track: !be.track } })}
            className={`w-10 h-5 rounded-full transition relative ${be.track ? 'bg-brand-600' : 'bg-ink-200'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${be.track ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-[11.5px] text-ink-500">非首页页面放进分包</span>
          <button
            onClick={() => updateProject({ backend: { ...be, subpackage: !be.subpackage } })}
            className={`w-10 h-5 rounded-full transition relative ${be.subpackage ? 'bg-brand-600' : 'bg-ink-200'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${be.subpackage ? 'left-5' : 'left-0.5'}`} />
          </button>
        </div>
        <div className="text-[10.5px] text-ink-400 mt-1.5 leading-relaxed">
          分包把主包只留首页与 tabBar 页，规避主包 2MB 限制；埋点在云开发 / 自有接口模式下才真正上报。
        </div>
      </div>
    </div>
  )
}

/* ---------------- 主面板 ---------------- */

export default function RightPanel() {
  const rightTab = useApp((s) => s.rightTab)
  const setRightTab = useApp((s) => s.setRightTab)
  const node = useSelectedNode()
  const selectedId = useApp((s) => s.selectedId)
  const duplicateNode = useApp((s) => s.duplicateNode)
  const removeNode = useApp((s) => s.removeNode)
  const moveNode = useApp((s) => s.moveNode)
  const copyNode = useApp((s) => s.copyNode)
  const pasteNode = useApp((s) => s.pasteNode)
  const hasClipboard = useApp((s) => s.hasClipboard())

  return (
    <aside id="tour-right" className="w-[330px] border-l border-ink-100 bg-white flex flex-col min-h-0">
      <div className="flex border-b border-ink-100 flex-shrink-0">
        <button
          onClick={() => setRightTab('prop')}
          className={`flex-1 h-11 text-[13px] font-medium inline-flex items-center justify-center gap-1.5 transition ${
            rightTab === 'prop' ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/40' : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          <Layers size={14} /> 组件属性
        </button>
        <button
          onClick={() => setRightTab('theme')}
          className={`flex-1 h-11 text-[13px] font-medium inline-flex items-center justify-center gap-1.5 transition ${
            rightTab === 'theme' ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/40' : 'text-ink-500 hover:text-ink-700'
          }`}
        >
          <Palette size={14} /> 主题与页面
        </button>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll min-h-0">
        {rightTab === 'theme' ? (
          <ThemePanel />
        ) : node ? (
          <>
            <NodeProps node={node} />
            <div className="px-4 pb-6 pt-3 border-t border-ink-100 flex gap-1.5">
              <button onClick={() => moveNode(node.id, -1)} className="flex-1 h-8 rounded-lg border border-ink-200 text-ink-500 text-[11.5px] inline-flex items-center justify-center gap-1 hover:border-brand-300 hover:text-brand-600 transition">
                <ArrowUp size={12} /> 上移
              </button>
              <button onClick={() => moveNode(node.id, 1)} className="flex-1 h-8 rounded-lg border border-ink-200 text-ink-500 text-[11.5px] inline-flex items-center justify-center gap-1 hover:border-brand-300 hover:text-brand-600 transition">
                <ArrowDown size={12} /> 下移
              </button>
              <button onClick={() => copyNode(node.id)} title="复制" className="h-8 px-2.5 rounded-lg border border-ink-200 text-ink-500 inline-flex items-center justify-center hover:border-brand-300 hover:text-brand-600 transition">
                <Copy size={12} />
              </button>
              <button onClick={() => duplicateNode(node.id)} title="创建副本" className="h-8 px-2.5 rounded-lg border border-ink-200 text-ink-500 inline-flex items-center justify-center hover:border-brand-300 hover:text-brand-600 transition">
                <span className="text-[12px]">⧉</span>
              </button>
              <button onClick={() => removeNode(node.id)} className="h-8 px-2.5 rounded-lg border border-ink-200 text-ink-500 inline-flex items-center justify-center hover:border-red-300 hover:text-red-500 transition">
                <Trash2 size={12} />
              </button>
            </div>
            <div className="px-4 pb-6 -mt-3">
              <button
                onClick={() => pasteNode(node.id)}
                disabled={!hasClipboard}
                className="w-full h-8 rounded-lg border border-dashed border-ink-200 text-ink-500 text-[11.5px] inline-flex items-center justify-center gap-1.5 hover:border-brand-300 hover:text-brand-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Copy size={12} /> 粘贴到此处下方
              </button>
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-ink-50 text-ink-300 flex items-center justify-center mx-auto mb-3">
              <Layers size={20} />
            </div>
            <div className="text-[13px] text-ink-500">在中间预览区点选任意组件</div>
            <div className="text-[11.5px] text-ink-400 mt-1.5 leading-relaxed">
              选中后可编辑文案、图片、列表数据与外观样式
            </div>
            {!selectedId ? <div className="text-[11.5px] text-ink-300 mt-3">或从左侧「组件」面板添加新组件</div> : null}
          </div>
        )}
      </div>
    </aside>
  )
}
