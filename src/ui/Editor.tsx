import { useState, useEffect } from 'react'
import { useApp, useCurrentPage } from '../store/useApp'
import Topbar from './Topbar'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import CodeModal from './CodeModal'
import { PhoneFrame } from './PhoneFrame'
import { Minus, Plus, Smartphone } from 'lucide-react'
import { shouldAutoTour, startGuidedTour } from './Tutorial'

export default function Editor() {
  const project = useApp((s) => s.project)
  const page = useCurrentPage()
  const setPage = useApp((s) => s.setPage)
  const select = useApp((s) => s.select)
  const selectedId = useApp((s) => s.selectedId)
  const [zen, setZen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [preview, setPreview] = useState(false)

  // 退出专注模式（由教程引导触发，确保左右面板可见）
  useEffect(() => {
    const off = () => setZen(false)
    window.addEventListener('mp:exit-zen', off)
    return () => window.removeEventListener('mp:exit-zen', off)
  }, [])

  // 首次进入编辑器自动播放引导
  useEffect(() => {
    if (shouldAutoTour()) {
      const t = setTimeout(() => startGuidedTour(), 450)
      return () => clearTimeout(t)
    }
  }, [])

  if (!project || !page) {
    return (
      <div className="h-screen flex items-center justify-center text-ink-400 text-sm">正在加载项目…</div>
    )
  }

  /* 键盘快捷键：删除 / 复制 / 粘贴 / 撤销重做 / 复制副本 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      const mod = e.metaKey || e.ctrlKey
      const s = useApp.getState()
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) s.redo()
        else s.undo()
        return
      }
      if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        s.redo()
        return
      }
      if (typing) return
      if (!s.selectedId) return
      if (mod && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        s.duplicateNode(s.selectedId)
      } else if (mod && e.key.toLowerCase() === 'c') {
        e.preventDefault()
        s.copyNode(s.selectedId)
      } else if (mod && e.key.toLowerCase() === 'v') {
        e.preventDefault()
        s.pasteNode(s.selectedId)
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        s.removeNode(s.selectedId)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        s.moveNode(s.selectedId, -1)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        s.moveNode(s.selectedId, 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const switchByPath = (path: string) => {
    const p = project.pages.find((x) => x.path === path)
    if (p) setPage(p.id)
  }

  return (
    <div className="h-screen flex flex-col bg-[#eef1f6]">
      <Topbar zen={zen} setZen={setZen} />

      <div className="flex-1 flex min-h-0">
        {!zen ? <LeftPanel /> : null}

        <main id="tour-canvas" className="flex-1 min-w-0 flex flex-col min-h-0">
          <div className="h-11 flex items-center justify-between px-5 flex-shrink-0">
            <div className="flex items-center gap-2 text-[12px] text-ink-500">
              <Smartphone size={14} className="text-ink-400" />
              <span className="font-medium text-ink-700">{page.name}</span>
              <span className="text-ink-300">·</span>
              <span className="font-mono text-[11px] text-ink-400">{page.navTitle}</span>
              <span className="text-ink-300">·</span>
              <span>375 × 760</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center rounded-lg bg-ink-100/70 p-0.5 mr-1">
                <button
                  onClick={() => setPreview(false)}
                  className={`h-7 px-2.5 rounded-md text-[12px] font-medium transition ${
                    !preview ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-500 hover:text-ink-700'
                  }`}
                >
                  编辑
                </button>
                <button
                  onClick={() => setPreview(true)}
                  className={`h-7 px-2.5 rounded-md text-[12px] font-medium transition ${
                    preview ? 'bg-white text-brand-600 shadow-sm' : 'text-ink-500 hover:text-ink-700'
                  }`}
                >
                  体验
                </button>
              </div>
              <button
                onClick={() => setZoom(Math.max(0.6, +(zoom - 0.1).toFixed(2)))}
                className="w-7 h-7 rounded-lg bg-white border border-ink-100 text-ink-500 inline-flex items-center justify-center hover:border-brand-300"
              >
                <Minus size={13} />
              </button>
              <span className="w-11 text-center text-[11.5px] text-ink-500">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(1.2, +(zoom + 0.1).toFixed(2)))}
                className="w-7 h-7 rounded-lg bg-white border border-ink-100 text-ink-500 inline-flex items-center justify-center hover:border-brand-300"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <div
            className="flex-1 min-h-0 overflow-auto thin-scroll flex items-start justify-center px-8 pb-10"
            onClick={() => select(null)}
          >
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', marginBottom: (zoom - 1) * 760 }}>
              <div onClick={(e) => e.stopPropagation()}>
                <PhoneFrame
                  project={project}
                  page={page}
                  editable={!preview}
                  selectedId={selectedId}
                  onSelect={(id) => select(id)}
                  onSwitchPage={switchByPath}
                  onNavigate={preview ? switchByPath : undefined}
                />
              </div>
            </div>
          </div>
        </main>

        {!zen ? <RightPanel /> : null}
      </div>

      <CodeModal />
    </div>
  )
}
