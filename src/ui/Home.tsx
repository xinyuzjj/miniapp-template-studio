import { useEffect, useMemo, useState } from 'react'
import { TEMPLATES } from '../templates'
import type { MpProject, TemplateDef } from '../types'
import { useApp } from '../store/useApp'
import { PhoneFrame } from './PhoneFrame'
import { Icon } from '../render/primitives'
import { Sparkles, Boxes, Download, MonitorSmartphone, X, Search } from 'lucide-react'

const STORAGE_KEY = 'mp-template-studio:v1'

export default function Home() {
  const createFromTemplate = useApp((s) => s.createFromTemplate)
  const restore = useApp((s) => s.restore)
  const [q, setQ] = useState('')
  const [industry, setIndustry] = useState('全部')
  const [preview, setPreview] = useState<{ tpl: TemplateDef; project: MpProject } | null>(null)
  const [hasDraft, setHasDraft] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const p = JSON.parse(raw)
        setHasDraft(!!p?.pages?.length)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const industries = useMemo(() => ['全部', ...Array.from(new Set(TEMPLATES.map((t) => t.industry)))], [])

  const list = useMemo(
    () =>
      TEMPLATES.filter((t) => {
        const okIndustry = industry === '全部' || t.industry === industry
        const kw = q.trim().toLowerCase()
        const okQ = !kw || t.name.toLowerCase().includes(kw) || t.industry.includes(kw) || t.desc.toLowerCase().includes(kw) || t.tags.some((x) => x.toLowerCase().includes(kw))
        return okIndustry && okQ
      }),
    [q, industry],
  )

  const openPreview = (tpl: TemplateDef) => {
    const built = tpl.build()
    setPreview({ tpl, project: { ...built, id: 'preview' } })
  }

  return (
    <div className="min-h-full">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1b2340 0%,#2a3a86 55%,#3459f7 100%)' }}>
        <div className="max-w-[1240px] mx-auto px-8 py-14">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15">
              <Sparkles size={14} /> 可视化搭建 · 一键导出源码
            </span>
          </div>
          <h1 className="text-white text-[38px] leading-tight font-bold tracking-tight">小程序模板工坊</h1>
          <p className="mt-3 text-white/75 text-[15px] max-w-2xl leading-relaxed">
            覆盖 15 大行业的微信小程序模板库。选中模板 → 可视化改内容 → 实时预览 →
            一键导出可直接导入微信开发者工具的完整源码。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {hasDraft ? (
              <button
                onClick={() => restore()}
                className="px-5 h-11 rounded-xl bg-white text-brand-700 font-semibold text-sm inline-flex items-center gap-2 hover:bg-white/90 transition"
              >
                <MonitorSmartphone size={16} /> 继续编辑上次项目
              </button>
            ) : null}
            <button
              onClick={() => document.getElementById('tpl-list')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 h-11 rounded-xl bg-white/12 border border-white/25 text-white font-medium text-sm inline-flex items-center gap-2 hover:bg-white/20 transition"
            >
              <Boxes size={16} /> 浏览 {TEMPLATES.length} 套行业模板
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { k: `${TEMPLATES.length}`, v: '套行业模板', d: '覆盖电商到本地生活' },
              { k: '30+', v: '种业务组件', d: '自由拖拽组合' },
              { k: '60', v: '个预置页面', d: '开箱即用' },
              { k: '1 键', v: '导出完整源码', d: '可导入开发者工具' },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl bg-white/8 border border-white/12 px-5 py-4 backdrop-blur">
                <div className="text-white text-2xl font-bold">{s.k}</div>
                <div className="text-white/90 text-[13px] mt-1">{s.v}</div>
                <div className="text-white/50 text-[11px] mt-0.5">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 列表 */}
      <div id="tpl-list" className="max-w-[1240px] mx-auto px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索模板名称、行业或功能，如「餐饮」「预约」「商城」"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-ink-200 bg-white text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {industries.map((it) => (
              <button
                key={it}
                onClick={() => setIndustry(it)}
                className={`h-9 px-3.5 rounded-lg text-[13px] whitespace-nowrap transition border ${
                  industry === it ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-ink-600 border-ink-200 hover:border-brand-300'
                }`}
              >
                {it}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="py-20 text-center text-ink-400 text-sm">没有匹配的模板，换个关键词试试</div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((t) => {
            const built = getBuilt(t)
            return (
              <div
                key={t.id}
                className="group rounded-2xl bg-white border border-ink-100 shadow-card hover:shadow-panel hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
              >
                <div className="h-32 relative overflow-hidden" style={{ background: t.cover }}>
                  <div className="absolute inset-0 opacity-90" style={{ backgroundImage: 'radial-gradient(circle at 88% 18%, rgba(255,255,255,.35), transparent 46%)' }} />
                  <div className="absolute left-5 bottom-4 text-white">
                    <div className="text-[11px] opacity-85">{t.industry}</div>
                    <div className="text-xl font-bold mt-0.5 tracking-tight">{t.name}</div>
                  </div>
                  <div className="absolute right-4 top-4 bg-black/20 backdrop-blur rounded-lg px-2 py-1 text-white text-[11px]">
                    {built.pages.length} 个页面
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-[13px] text-ink-500 leading-relaxed line-clamp-2">{t.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {t.tags.map((tag) => (
                      <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-ink-50 text-ink-500 border border-ink-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-5 pt-4 border-t border-ink-100">
                    <button
                      onClick={() => createFromTemplate(t.id)}
                      className="flex-1 h-9 rounded-lg bg-brand-600 text-white text-[13px] font-medium hover:bg-brand-700 transition"
                    >
                      使用此模板
                    </button>
                    <button
                      onClick={() => openPreview(t)}
                      className="h-9 px-3.5 rounded-lg border border-ink-200 text-ink-600 text-[13px] hover:border-brand-400 hover:text-brand-600 transition"
                    >
                      预览
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 工作原理 */}
        <div className="mt-14 rounded-2xl border border-ink-100 bg-white p-8">
          <h2 className="text-lg font-bold text-ink-900">它是怎么工作的</h2>
          <div className="grid md:grid-cols-4 gap-6 mt-6">
            {[
              { icon: Boxes, t: '选模板', d: '15 套行业模板，每套含 4 个完整页面与真实业务文案' },
              { icon: MonitorSmartphone, t: '改内容', d: '点选组件即可编辑文案、图片、列表、价格与样式' },
              { icon: Sparkles, t: '实时预览', d: '手机壳内 1:1 预览，含导航栏、TabBar 与滚动效果' },
              { icon: Download, t: '导出源码', d: '一键导出 zip，导入微信开发者工具即可真机预览' },
            ].map((s, i) => (
              <div key={s.t} className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                  <s.icon size={17} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-800">
                    {i + 1}. {s.t}
                  </div>
                  <div className="text-[12.5px] text-ink-500 mt-1 leading-relaxed">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {preview ? (
        <PreviewModal
          project={preview.project}
          name={preview.tpl.name}
          onClose={() => setPreview(null)}
          onUse={() => createFromTemplate(preview.tpl.id)}
        />
      ) : null}
    </div>
  )
}

/** 轻量缓存，避免重复 build 模板 */
const cache = new Map<string, MpProject>()
function getBuilt(t: TemplateDef): MpProject {
  if (!cache.has(t.id)) cache.set(t.id, { ...t.build(), id: t.id })
  return cache.get(t.id)!
}

function PreviewModal({
  project,
  name,
  onClose,
  onUse,
}: {
  project: MpProject
  name: string
  onClose: () => void
  onUse: () => void
}) {
  const [pageIdx, setPageIdx] = useState(0)
  const page = project.pages[pageIdx] ?? project.pages[0]
  const scale = 0.72

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/55 backdrop-blur-sm p-6" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-panel overflow-hidden flex"
        style={{ maxWidth: 940, width: '100%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 bg-ink-50 flex items-center justify-center p-8">
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
            <PhoneFrame project={project} page={page} />
          </div>
        </div>
        <div className="w-[320px] border-l border-ink-100 p-6 flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] text-ink-400">模板预览</div>
              <h3 className="text-lg font-bold text-ink-900 mt-1">{name}</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-ink-100 flex items-center justify-center text-ink-400">
              <X size={16} />
            </button>
          </div>
          <div className="mt-5 space-y-1.5 flex-1 overflow-auto thin-scroll">
            {project.pages.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setPageIdx(i)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition flex items-center gap-2.5 ${
                  i === pageIdx ? 'border-brand-400 bg-brand-50' : 'border-ink-100 hover:border-ink-200'
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] ${i === pageIdx ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500'}`}>
                  {i + 1}
                </span>
                <span className="text-[13px] text-ink-700">{p.name}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-4 border-t border-ink-100">
            <button onClick={onUse} className="flex-1 h-10 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition">
              使用此模板
            </button>
            <button onClick={onClose} className="h-10 px-4 rounded-xl border border-ink-200 text-ink-600 text-sm hover:bg-ink-50 transition">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
