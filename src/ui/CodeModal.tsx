import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../store/useApp'
import { generateCodeFiles } from '../export/mpgen'
import { X, Copy, Download, Check, FileCode2 } from 'lucide-react'

export default function CodeModal() {
  const open = useApp((s) => s.codeOpen)
  const setOpen = useApp((s) => s.setCodeOpen)
  const project = useApp((s) => s.project)

  const files = useMemo(() => (open && project ? generateCodeFiles(project) : []), [open, project])
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setActive(0)
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  if (!open || !project) return null
  const file = files[active]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(file?.content ?? ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  const groups = files.reduce<Record<string, number[]>>((acc, f, i) => {
    const dir = f.path.includes('/') ? f.path.slice(0, f.path.lastIndexOf('/')) : '根目录'
    ;(acc[dir] = acc[dir] || []).push(i)
    return acc
  }, {})

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-2xl shadow-panel overflow-hidden flex flex-col" style={{ width: '100%', maxWidth: 1080, height: '86vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="h-14 border-b border-ink-100 flex items-center px-5 gap-3 flex-shrink-0">
          <FileCode2 size={17} className="text-brand-600" />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-ink-900 truncate">生成的小程序源码</div>
            <div className="text-[11.5px] text-ink-400">共 {files.length} 个文件 · 可直接导入微信开发者工具</div>
          </div>
          <button onClick={copy} className="h-8 px-3 rounded-lg border border-ink-200 text-ink-600 text-[12.5px] inline-flex items-center gap-1.5 hover:border-brand-400 hover:text-brand-600 transition">
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? '已复制' : '复制当前文件'}
          </button>
          <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg hover:bg-ink-100 text-ink-400 inline-flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 flex min-h-0">
          <div className="w-[248px] border-r border-ink-100 overflow-y-auto thin-scroll flex-shrink-0 py-2">
            {Object.entries(groups).map(([dir, idxs]) => (
              <div key={dir} className="mb-2">
                <div className="px-4 py-1.5 text-[10.5px] font-semibold text-ink-300 uppercase tracking-wide">{dir}</div>
                {idxs.map((i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`w-full text-left px-4 py-1.5 text-[12.5px] transition ${
                      i === active ? 'bg-brand-50 text-brand-700 font-medium' : 'text-ink-500 hover:bg-ink-50'
                    }`}
                  >
                    <span className="font-mono">{files[i].path.split('/').pop()}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-0 bg-[#0f1420] overflow-auto thin-scroll">
            <div className="sticky top-0 bg-[#151c2e] text-[#7dd3fc] text-[11.5px] px-5 py-2 font-mono border-b border-[#1e2740]">
              {file?.path}
            </div>
            <pre className="p-5 text-[12px] leading-[1.7] font-mono text-[#cdd6e6] whitespace-pre">
              {String(file?.content ?? '')}
            </pre>
          </div>
        </div>

        <div className="h-14 border-t border-ink-100 px-5 flex items-center justify-between flex-shrink-0">
          <div className="text-[11.5px] text-ink-400 leading-relaxed">
            提示：图片默认为渐变占位块。把数据里的 <code className="px-1 py-0.5 rounded bg-ink-100 font-mono text-[11px]">image / src / logo / avatar</code> 换成 https 图片地址即可显示真图。
          </div>
          <button onClick={() => setOpen(false)} className="h-8 px-4 rounded-lg border border-ink-200 text-ink-600 text-[12.5px] hover:bg-ink-50">
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
