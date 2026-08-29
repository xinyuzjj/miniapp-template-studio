import { useState } from 'react'
import { useApp, useCurrentPage, useSelectedNode } from '../store/useApp'
import { COMPONENTS_BY_GROUP, REGISTRY } from '../core/registry'
import { Icon } from '../render/primitives'
import type { MpNode } from '../types'
import { Blocks, Layers, FileStack, Plus, Trash2, Copy, ChevronRight, ChevronDown, Eye, Search, ArrowUp, ArrowDown, Home } from 'lucide-react'

/* ---------------- 组件库 ---------------- */

function ComponentLib() {
  const addNode = useApp((s) => s.addNode)
  const selNode = useSelectedNode()
  const parentId = selNode && REGISTRY[selNode.type]?.container ? selNode.id : null
  const [q, setQ] = useState('')

  const groups = q.trim()
    ? COMPONENTS_BY_GROUP.map((g) => ({
        group: g.group,
        items: g.items.filter((c) => c.name.includes(q.trim()) || c.desc.includes(q.trim()) || c.type.includes(q.trim())),
      })).filter((g) => g.items.length > 0)
    : COMPONENTS_BY_GROUP

  return (
    <div className="p-3">
      <div className="relative mb-3">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-300" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索组件，如 商品 / 表单"
          className="w-full h-8 pl-8 pr-2 rounded-lg border border-ink-200 bg-white text-[12px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
      </div>
      {parentId ? (
        <div className="mb-3 px-2.5 py-2 rounded-lg bg-brand-50 border border-brand-100 text-[11.5px] text-brand-700 leading-snug">
          新组件将添加到选中的「{REGISTRY[selNode!.type].name}」容器内
        </div>
      ) : (
        <div className="mb-3 px-2.5 py-2 rounded-lg bg-ink-50 text-[11.5px] text-ink-500 leading-snug">
          点击组件添加到页面末尾
        </div>
      )}

      {groups.map((g) => (
        <div key={g.group} className="mb-4">
          <div className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide px-1 mb-2">{g.group}</div>
          <div className="grid grid-cols-2 gap-1.5">
            {g.items.map((c) => (
              <button
                key={c.type}
                onClick={() => addNode(c.type, parentId)}
                title={c.desc}
                className="group flex items-center gap-2 px-2.5 py-2 rounded-xl border border-ink-100 bg-white hover:border-brand-300 hover:bg-brand-50/50 transition text-left"
              >
                <span className="w-6 h-6 rounded-lg bg-ink-50 text-ink-500 group-hover:bg-brand-100 group-hover:text-brand-600 flex items-center justify-center flex-shrink-0 transition">
                  <Icon name={c.icon} size={13} />
                </span>
                <span className="text-[12px] text-ink-700 truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------- 图层树 ---------------- */

function LayerRow({ node, depth, pageId }: { node: MpNode; depth: number; pageId: string }) {
  const selectedId = useApp((s) => s.selectedId)
  const select = useApp((s) => s.select)
  const [open, setOpen] = useState(true)
  const def = REGISTRY[node.type]
  const hasChildren = !!node.children?.length
  const active = selectedId === node.id

  return (
    <div>
      <div
        onClick={() => select(node.id)}
        style={{ paddingLeft: 8 + depth * 14 }}
        className={`group flex items-center gap-1.5 h-8 pr-2 rounded-lg cursor-pointer transition ${
          active ? 'bg-brand-50 text-brand-700' : 'hover:bg-ink-50 text-ink-600'
        }`}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setOpen(!open)
            }}
            className="w-4 h-4 flex items-center justify-center text-ink-300 flex-shrink-0"
          >
            {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}
        <span className={`w-4 h-4 flex items-center justify-center flex-shrink-0 ${active ? 'text-brand-600' : 'text-ink-400'}`}>
          <Icon name={def?.icon ?? 'layout'} size={12} />
        </span>
        <span className="text-[12px] truncate flex-1">{def?.name ?? node.type}</span>
        <span className="text-[10.5px] text-ink-300 truncate max-w-[92px]">
          {String(node.props?.content ?? node.props?.title ?? node.props?.text ?? node.props?.name ?? '')}
        </span>
      </div>
      {hasChildren && open ? (
        <div>
          {node.children!.map((c) => (
            <LayerRow key={c.id} node={c} depth={depth + 1} pageId={pageId} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function LayerTree() {
  const page = useCurrentPage()
  const selectedId = useApp((s) => s.selectedId)
  const duplicateNode = useApp((s) => s.duplicateNode)
  const removeNode = useApp((s) => s.removeNode)
  const moveNode = useApp((s) => s.moveNode)

  if (!page) return null
  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">当前页面图层</span>
        <span className="text-[11px] text-ink-300">{page.nodes.length} 个顶层组件</span>
      </div>
      <div className="space-y-0.5">
        {page.nodes.map((n) => (
          <LayerRow key={n.id} node={n} depth={0} pageId={page.id} />
        ))}
      </div>
      {selectedId ? (
        <div className="mt-4 pt-3 border-t border-ink-100 flex gap-1.5">
          <button onClick={() => moveNode(selectedId, -1)} className="flex-1 h-8 rounded-lg border border-ink-200 text-ink-500 text-[11.5px] inline-flex items-center justify-center gap-1 hover:border-brand-300 hover:text-brand-600 transition">
            <ArrowUp size={12} /> 上移
          </button>
          <button onClick={() => moveNode(selectedId, 1)} className="flex-1 h-8 rounded-lg border border-ink-200 text-ink-500 text-[11.5px] inline-flex items-center justify-center gap-1 hover:border-brand-300 hover:text-brand-600 transition">
            <ArrowDown size={12} /> 下移
          </button>
          <button onClick={() => duplicateNode(selectedId)} className="flex-1 h-8 rounded-lg border border-ink-200 text-ink-500 text-[11.5px] inline-flex items-center justify-center gap-1 hover:border-brand-300 hover:text-brand-600 transition">
            <Copy size={12} /> 复制
          </button>
          <button onClick={() => removeNode(selectedId)} className="flex-1 h-8 rounded-lg border border-ink-200 text-ink-500 text-[11.5px] inline-flex items-center justify-center gap-1 hover:border-red-300 hover:text-red-500 transition">
            <Trash2 size={12} /> 删除
          </button>
        </div>
      ) : null}
    </div>
  )
}

/* ---------------- 页面管理 ---------------- */

function PageList() {
  const project = useApp((s) => s.project)!
  const currentPageId = useApp((s) => s.currentPageId)
  const setPage = useApp((s) => s.setPage)
  const addPage = useApp((s) => s.addPage)
  const removePage = useApp((s) => s.removePage)
  const duplicatePage = useApp((s) => s.duplicatePage)
  const movePage = useApp((s) => s.movePage)
  const setHomePage = useApp((s) => s.setHomePage)
  const updatePage = useApp((s) => s.updatePage)
  const updateTabBar = useApp((s) => s.updateTabBar)

  const inTab = (path: string) => project.tabBar.items.some((i) => i.pagePath === path)

  return (
    <div className="p-3">
      <button
        onClick={addPage}
        className="w-full h-9 mb-3 rounded-xl border border-dashed border-ink-200 text-ink-500 text-[12.5px] inline-flex items-center justify-center gap-1.5 hover:border-brand-400 hover:text-brand-600 transition"
      >
        <Plus size={14} /> 新建页面
      </button>
      <div className="space-y-1.5">
        {project.pages.map((p, i) => {
          const active = p.id === currentPageId
          return (
            <div
              key={p.id}
              className={`rounded-xl border transition ${active ? 'border-brand-400 bg-brand-50/50' : 'border-ink-100 hover:border-ink-200'}`}
            >
              <div className="flex items-center gap-2 p-2.5">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] flex-shrink-0 ${active ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <input
                    value={p.name}
                    onChange={(e) => updatePage(p.id, { name: e.target.value })}
                    className="w-full text-[12.5px] font-medium text-ink-800 bg-transparent outline-none border-b border-transparent focus:border-brand-300"
                  />
                  <div className="text-[10.5px] text-ink-300 font-mono truncate mt-0.5">{p.path}</div>
                </div>
                <button
                  onClick={() => setPage(p.id)}
                  title="编辑此页"
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'text-brand-600 bg-brand-100' : 'text-ink-300 hover:text-ink-600 hover:bg-ink-100'}`}
                >
                  <Eye size={13} />
                </button>
              </div>
              <div className="flex items-center gap-1 px-2.5 pb-2.5">
                <button
                  onClick={() => movePage(p.id, -1)}
                  disabled={i === 0}
                  title="上移"
                  className="flex-1 h-6.5 rounded-lg text-[11px] border border-ink-100 text-ink-400 hover:border-brand-300 hover:text-brand-600 flex items-center justify-center gap-1 disabled:opacity-30 transition"
                  style={{ height: 26 }}
                >
                  <ArrowUp size={12} /> 上移
                </button>
                <button
                  onClick={() => movePage(p.id, 1)}
                  disabled={i === project.pages.length - 1}
                  title="下移"
                  className="flex-1 h-6.5 rounded-lg text-[11px] border border-ink-100 text-ink-400 hover:border-brand-300 hover:text-brand-600 flex items-center justify-center gap-1 disabled:opacity-30 transition"
                  style={{ height: 26 }}
                >
                  <ArrowDown size={12} /> 下移
                </button>
                <button
                  onClick={() => duplicatePage(p.id)}
                  title="复制页面"
                  className="w-7 h-6.5 rounded-lg text-[11px] border border-ink-100 text-ink-400 hover:border-brand-300 hover:text-brand-600 flex items-center justify-center transition"
                  style={{ height: 26 }}
                >
                  <Copy size={12} />
                </button>
                <button
                  onClick={() => removePage(p.id)}
                  disabled={project.pages.length <= 1}
                  title="删除页面"
                  className="w-7 h-6.5 rounded-lg text-ink-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition disabled:opacity-30"
                  style={{ height: 26 }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
              {i === 0 ? (
                <div className="px-2.5 pb-2.5">
                  <span className="inline-flex items-center gap-1 text-[10.5px] text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">🏠 首页（启动页）</span>
                </div>
              ) : (
                <div className="px-2.5 pb-2.5">
                  <button
                    onClick={() => setHomePage(p.id)}
                    className="w-full h-6.5 rounded-lg text-[11px] border border-ink-100 text-ink-400 hover:border-brand-300 hover:text-brand-600 flex items-center justify-center gap-1 transition"
                    style={{ height: 26 }}
                  >
                    <Home size={12} /> 设为首页
                  </button>
                </div>
              )}
              <div className="px-2.5 pb-2.5">
                <button
                  onClick={() => {
                    if (inTab(p.path)) {
                      updateTabBar({ items: project.tabBar.items.filter((it) => it.pagePath !== p.path) })
                    } else {
                      if (project.tabBar.items.length >= 5) return
                      updateTabBar({
                        enabled: true,
                        items: [...project.tabBar.items, { pagePath: p.path, text: p.name, icon: 'home' }],
                      })
                    }
                  }}
                  className={`w-full h-6.5 rounded-lg text-[11px] border transition ${
                    inTab(p.path) ? 'border-brand-200 bg-white text-brand-600' : 'border-ink-100 text-ink-400 hover:border-brand-300'
                  }`}
                  style={{ height: 26 }}
                >
                  {inTab(p.path) ? '✓ 已在底部导航中' : '+ 加入底部导航'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 px-1 text-[11px] text-ink-400 leading-relaxed">
        底部导航最多 5 项，最少 2 项。TabBar 页面必须使用页面路径作为跳转目标。
      </div>
    </div>
  )
}

/* ---------------- 主面板 ---------------- */

export default function LeftPanel() {
  const leftTab = useApp((s) => s.leftTab)
  const setLeftTab = useApp((s) => s.setLeftTab)

  const tabs = [
    { k: 'components' as const, label: '组件', icon: Blocks },
    { k: 'layers' as const, label: '图层', icon: Layers },
    { k: 'pages' as const, label: '页面', icon: FileStack },
  ]

  return (
    <aside id="tour-left" className="w-[286px] border-r border-ink-100 bg-white flex flex-col min-h-0">
      <div className="flex border-b border-ink-100 flex-shrink-0">
        {tabs.map((t) => (
          <button
            key={t.k}
            onClick={() => setLeftTab(t.k)}
            className={`flex-1 h-11 text-[13px] font-medium inline-flex items-center justify-center gap-1.5 transition ${
              leftTab === t.k ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/40' : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto thin-scroll min-h-0">
        {leftTab === 'components' ? <ComponentLib /> : leftTab === 'layers' ? <LayerTree /> : <PageList />}
      </div>
    </aside>
  )
}
