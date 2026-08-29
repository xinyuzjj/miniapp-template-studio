import { useState } from 'react'
import { useApp } from '../store/useApp'
import { generateCodeFiles, collectIcons } from '../export/mpgen'
import { generateComponentIcons, generateTabIcons } from '../export/icons'
import { buildDeployScripts } from '../export/deploy'
import { buildZip, downloadBlob } from '../export/zip'
import { ArrowLeft, Undo2, Redo2, Code2, Download, Rocket, Loader2, Eye, EyeOff, CheckCircle2, X } from 'lucide-react'

export default function Topbar({ zen, setZen }: { zen: boolean; setZen: (v: boolean) => void }) {
  const project = useApp((s) => s.project)!
  const currentPageId = useApp((s) => s.currentPageId)
  const setPage = useApp((s) => s.setPage)
  const undo = useApp((s) => s.undo)
  const redo = useApp((s) => s.redo)
  const canUndo = useApp((s) => s.past.length > 0)
  const canRedo = useApp((s) => s.future.length > 0)
  const setCodeOpen = useApp((s) => s.setCodeOpen)
  const updateTheme = useApp((s) => s.updateTheme)
  const goHome = useApp((s) => s.goHome)

  const [busy, setBusy] = useState<'code' | 'zip' | 'deploy' | null>(null)
  const [toast, setToast] = useState('')
  const [showGuide, setShowGuide] = useState(false)

  const renameProject = (name: string) => {
    // 项目名存入 project.name（通过 updateTheme 之外的直接提交）
    useApp.setState((s) => {
      if (!s.project) return s
      const next = { ...s.project, name }
      localStorage.setItem('mp-template-studio:v1', JSON.stringify(next))
      return { project: next }
    })
  }

  const flash = (t: string) => {
    setToast(t)
    setTimeout(() => setToast(''), 2600)
  }

  const doExport = async () => {
    if (busy) return
    setBusy('zip')
    try {
      const icons = await generateComponentIcons(project, collectIcons(project))
      const { files: tabFiles, names } = await generateTabIcons(project)
      const files = generateCodeFiles(project, names)
      const blob = await buildZip([...files, ...icons, ...tabFiles])
      downloadBlob(blob, `${project.name || 'miniapp'}.zip`)
      flash(`已导出 ${files.length + icons.length + tabFiles.length} 个文件`)
    } catch (e) {
      flash('导出失败，请重试')
    } finally {
      setBusy(null)
    }
  }

  const doDeploy = async () => {
    if (busy) return
    setBusy('deploy')
    try {
      const icons = await generateComponentIcons(project, collectIcons(project))
      const { files: tabFiles, names } = await generateTabIcons(project)
      const files = generateCodeFiles(project, names)
      const deploy = buildDeployScripts(project)
      const blob = await buildZip([...files, ...icons, ...tabFiles, ...deploy])
      downloadBlob(blob, `${project.name || 'miniapp'}-deploy.zip`)
      flash('已下载部署包，解压后双击「一键部署」即可')
      setShowGuide(true)
    } catch (e) {
      flash('部署包生成失败，请重试')
    } finally {
      setBusy(null)
    }
  }

  return (
    <header className="h-14 border-b border-ink-100 bg-white flex items-center px-4 gap-3 flex-shrink-0 relative">
      <button onClick={goHome} className="h-8 px-2.5 rounded-lg text-ink-500 hover:bg-ink-50 inline-flex items-center gap-1.5 text-[13px] flex-shrink-0">
        <ArrowLeft size={15} /> 模板库
      </button>
      <div className="w-px h-5 bg-ink-100" />
      <input
        value={project.name}
        onChange={(e) => renameProject(e.target.value)}
        className="text-[14px] font-semibold text-ink-900 w-[168px] px-2 py-1 rounded-lg border border-transparent hover:border-ink-200 focus:border-brand-400 outline-none transition"
      />

      <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar px-2">
        {project.pages.map((p) => (
          <button
            key={p.id}
            onClick={() => setPage(p.id)}
            className={`h-8 px-3 rounded-lg text-[12.5px] whitespace-nowrap transition ${
              p.id === currentPageId ? 'bg-brand-50 text-brand-700 font-medium' : 'text-ink-500 hover:bg-ink-50'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => setZen(!zen)}
          title={zen ? '显示编辑面板' : '进入全屏预览'}
          className="h-8 w-8 rounded-lg text-ink-400 hover:bg-ink-50 hover:text-ink-700 inline-flex items-center justify-center"
        >
          {zen ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button
          onClick={undo}
          disabled={!canUndo}
          title="撤销"
          className="h-8 w-8 rounded-lg text-ink-400 hover:bg-ink-50 hover:text-ink-700 disabled:opacity-30 inline-flex items-center justify-center"
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="重做"
          className="h-8 w-8 rounded-lg text-ink-400 hover:bg-ink-50 hover:text-ink-700 disabled:opacity-30 inline-flex items-center justify-center"
        >
          <Redo2 size={15} />
        </button>
        <button
          onClick={() => setCodeOpen(true)}
          className="h-8 px-3 rounded-lg border border-ink-200 text-ink-600 text-[12.5px] inline-flex items-center gap-1.5 hover:border-brand-400 hover:text-brand-600 transition"
        >
          <Code2 size={14} /> 查看源码
        </button>
        <button
          onClick={doExport}
          disabled={busy === 'zip'}
          className="h-8 px-3 rounded-lg border border-ink-200 text-ink-600 text-[12.5px] inline-flex items-center gap-1.5 hover:border-brand-400 hover:text-brand-600 transition disabled:opacity-60"
        >
          {busy === 'zip' ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          导出代码
        </button>
        <button
          onClick={doDeploy}
          disabled={busy === 'deploy'}
          className="h-8 px-3.5 rounded-lg bg-brand-600 text-white text-[12.5px] font-medium inline-flex items-center gap-1.5 hover:bg-brand-700 transition disabled:opacity-60"
        >
          {busy === 'deploy' ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}
          一键部署
        </button>
      </div>

      {toast ? (
        <div className="absolute top-16 right-4 z-50 px-3.5 py-2 rounded-xl bg-ink-900 text-white text-[12.5px] shadow-panel inline-flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-400" />
          {toast}
        </div>
      ) : null}

      {showGuide ? <DeployGuide onClose={() => setShowGuide(false)} /> : null}
    </header>
  )
}

function DeployGuide({ onClose }: { onClose: () => void }) {
  const steps = [
    { t: '下载部署包', d: '点「一键部署」已自动下载一个 zip，里面是完整小程序代码 + 部署脚本。' },
    { t: '解压并双击', d: '把 zip 解压到任意文件夹，双击里面的「一键部署.bat」（Mac 用「一键部署.sh」）。' },
    { t: '自动打开工具', d: '脚本会自动找到微信开发者工具并打开项目；登录后左侧就是手机预览。' },
    { t: '预览 / 上传', d: '点「预览」生成真机二维码；点「上传」填版本号提交审核。正式发布需替换为你的 AppID。' },
  ]
  return (
    <div className="fixed inset-0 z-[60] bg-ink-900/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-[440px] max-w-full bg-white rounded-2xl shadow-panel overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-ink-100">
          <h3 className="text-[15px] font-semibold text-ink-900 flex items-center gap-2">
            <Rocket size={16} className="text-brand-600" /> 一键部署怎么用
          </h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg text-ink-400 hover:bg-ink-50 inline-flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-brand-600 text-white text-[12px] font-semibold flex-shrink-0 inline-flex items-center justify-center mt-0.5">
                {i + 1}
              </div>
              <div>
                <div className="text-[13.5px] font-medium text-ink-900">{s.t}</div>
                <div className="text-[12.5px] text-ink-500 leading-relaxed">{s.d}</div>
              </div>
            </div>
          ))}
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-3.5 py-2.5 text-[12px] text-amber-700 leading-relaxed">
            提示：预览用测试号即可；<b>上传 / 正式发布</b>需要你自己的小程序 AppID（微信公众平台注册）。把
            <code className="px-1">project.config.json</code> 里的 <code className="px-1">appid</code> 换掉再用「上传体验版」脚本即可。
          </div>
          <button
            onClick={onClose}
            className="w-full h-9 rounded-xl bg-brand-600 text-white text-[13px] font-medium hover:bg-brand-700 transition"
          >
            明白了
          </button>
        </div>
      </div>
    </div>
  )
}
