import { useEffect, useRef, useState } from 'react'
import type { MpProject } from '../types'
import { PhoneFrame } from './PhoneFrame'
import { runSelfCheck, type SelfCheckResult } from '../export/selfcheck'
import { captureNode } from '../export/domCapture'
import JSZip from 'jszip'
import { downloadBlob } from '../export/zip'
import { CheckCircle2, AlertTriangle, XCircle, Download, Loader2, X } from 'lucide-react'

export default function SelfCheckModal({ project, onClose }: { project: MpProject; onClose: () => void }) {
  const [result, setResult] = useState<SelfCheckResult | null>(null)
  const [shots, setShots] = useState<Record<string, string>>({})
  const [capturing, setCapturing] = useState(true)
  const refs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    setResult(runSelfCheck(project))
  }, [project])

  useEffect(() => {
    if (!result) return
    let alive = true
    const t = setTimeout(async () => {
      const next: Record<string, string> = {}
      for (const pg of project.pages) {
        const el = refs.current[pg.id]
        if (!el) continue
        const url = await captureNode(el)
        if (url && alive) next[pg.id] = url
      }
      if (alive) {
        setShots(next)
        setCapturing(false)
      }
    }, 220)
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [result, project])

  const downloadAll = async () => {
    const zip = new JSZip()
    for (const pg of project.pages) {
      const d = shots[pg.id]
      if (d) zip.file(`${pg.name || pg.path}.png`, d.split(',')[1], { base64: true })
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    downloadBlob(blob, `${project.name || 'miniapp'}-预览截图.zip`)
  }

  return (
    <div className="fixed inset-0 z-[60] bg-ink-900/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-[860px] max-w-full max-h-[88vh] bg-white rounded-2xl shadow-panel overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-ink-100 flex-shrink-0">
          <h3 className="text-[15px] font-semibold text-ink-900 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-brand-600" /> 导出前自检
          </h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg text-ink-400 hover:bg-ink-50 inline-flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto thin-scroll min-h-0 grid grid-cols-2">
          {/* 左：代码校验 */}
          <div className="p-4 border-r border-ink-100">
            <div className="text-[12.5px] font-semibold text-ink-700 mb-3">代码校验（ESLint / 一致性）</div>
            {!result ? (
              <div className="text-[12px] text-ink-400">检测中…</div>
            ) : (
              <div className="space-y-1.5">
                {result.items.map((it, i) => (
                  <div key={i} className="flex items-start gap-2 text-[12px] leading-snug">
                    {it.level === 'ok' ? (
                      <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    ) : it.level === 'warn' ? (
                      <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <span className="text-ink-400">{it.scope}：</span>
                      <span className={it.level === 'error' ? 'text-red-600' : it.level === 'warn' ? 'text-amber-600' : 'text-ink-700'}>
                        {it.message}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* 右：预览截图 */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[12.5px] font-semibold text-ink-700">预览截图自检</div>
              <button
                onClick={downloadAll}
                disabled={capturing || Object.keys(shots).length === 0}
                className="h-7 px-2.5 rounded-lg border border-ink-200 text-ink-600 text-[11.5px] inline-flex items-center gap-1 hover:border-brand-300 hover:text-brand-600 disabled:opacity-40 transition"
              >
                <Download size={12} /> 下载全部
              </button>
            </div>
            {capturing ? (
              <div className="text-[12px] text-ink-400 inline-flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> 正在生成各页面截图…
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {project.pages.map((pg) => (
                  <div key={pg.id} className="rounded-xl border border-ink-100 overflow-hidden">
                    <div className="px-2 py-1 bg-ink-50 text-[11px] text-ink-500 truncate">{pg.name}</div>
                    {shots[pg.id] ? (
                      <div className="relative">
                        <img src={shots[pg.id]} alt={pg.name} className="w-full block" />
                        <a
                          href={shots[pg.id]}
                          download={`${pg.name}.png`}
                          className="absolute bottom-1 right-1 h-6 w-6 rounded-lg bg-ink-900/60 text-white inline-flex items-center justify-center hover:bg-ink-900"
                        >
                          <Download size={12} />
                        </a>
                      </div>
                    ) : (
                      <div className="h-24 flex items-center justify-center text-[11px] text-ink-400">截图不可用</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="px-5 py-3 border-t border-ink-100 flex items-center justify-between flex-shrink-0">
          <div className="text-[11.5px] text-ink-400">
            {result ? (result.ok ? '✅ 校验通过，可以放心导出' : '⚠️ 存在错误，建议先修正再导出') : '检测中…'}
          </div>
          <button onClick={onClose} className="h-9 px-4 rounded-xl bg-brand-600 text-white text-[13px] font-medium hover:bg-brand-700 transition">
            知道了
          </button>
        </div>
      </div>

      {/* 离屏渲染层：用于截图 */}
      <div style={{ position: 'fixed', left: -9999, top: 0 }} aria-hidden>
        {project.pages.map((pg) => (
          <div key={pg.id} ref={(el) => (refs.current[pg.id] = el)} style={{ width: 375, height: 760 }}>
            <PhoneFrame project={project} page={pg} editable={false} />
          </div>
        ))}
      </div>
    </div>
  )
}
