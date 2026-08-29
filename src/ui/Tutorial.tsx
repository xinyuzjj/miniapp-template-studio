import { useEffect, useState } from 'react'
import { useApp } from '../store/useApp'
import { BookOpen, Sparkles, GraduationCap, Rocket, HelpCircle, X, ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react'

/* ------------------------------------------------------------------ */
/* 事件派发：让 Topbar / Home / Editor 都能唤起教程，而不必层层传 props */
/* ------------------------------------------------------------------ */

export function openTutorialCenter() {
  window.dispatchEvent(new CustomEvent('mp:open-tutorial'))
}

export function startGuidedTour() {
  window.dispatchEvent(new CustomEvent('mp:start-tour'))
}

const TOUR_DONE_KEY = 'mp-tour-done'

/* ------------------------------------------------------------------ */
/* 教程中心（选项卡式图文教程）                                          */
/* ------------------------------------------------------------------ */

type Tab = 'start' | 'editor' | 'appid' | 'faq'

const TABS: { k: Tab; label: string; icon: any }[] = [
  { k: 'start', label: '上手三步', icon: GraduationCap },
  { k: 'editor', label: '编辑器全景', icon: BookOpen },
  { k: 'appid', label: '零 AppID 部署', icon: Rocket },
  { k: 'faq', label: '常见问题', icon: HelpCircle },
]

function TutorialCenter({ onClose, onStartTour }: { onClose: () => void; onStartTour: () => void }) {
  const [tab, setTab] = useState<Tab>('start')

  return (
    <div className="fixed inset-0 z-[70] bg-ink-900/45 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-[760px] max-w-full max-h-[88vh] bg-white rounded-2xl shadow-panel overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-ink-100 flex-shrink-0">
          <h3 className="text-[15px] font-semibold text-ink-900 flex items-center gap-2">
            <Sparkles size={16} className="text-brand-600" /> 新手教程
          </h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg text-ink-400 hover:bg-ink-50 inline-flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="flex border-b border-ink-100 flex-shrink-0">
          {TABS.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`flex-1 h-11 text-[12.5px] font-medium inline-flex items-center justify-center gap-1.5 transition ${
                tab === t.k ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/40' : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto thin-scroll px-6 py-5">
          {tab === 'start' ? <StartTab /> : null}
          {tab === 'editor' ? <EditorTab /> : null}
          {tab === 'appid' ? <AppIdTab /> : null}
          {tab === 'faq' ? <FaqTab /> : null}
        </div>

        <div className="flex items-center justify-between px-5 h-16 border-t border-ink-100 flex-shrink-0">
          <button
            onClick={onStartTour}
            className="h-9 px-4 rounded-xl border border-brand-200 text-brand-600 text-[12.5px] font-medium inline-flex items-center gap-1.5 hover:bg-brand-50 transition"
          >
            <Sparkles size={14} /> 重新看一遍引导
          </button>
          <button onClick={onClose} className="h-9 px-5 rounded-xl bg-brand-600 text-white text-[13px] font-medium hover:bg-brand-700 transition">
            开始使用
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-[12px] font-semibold inline-flex items-center justify-center flex-shrink-0">{n}</span>
        <h4 className="text-[14px] font-semibold text-ink-900">{title}</h4>
      </div>
      <div className="text-[12.5px] text-ink-500 leading-relaxed pl-[34px] space-y-1.5">{children}</div>
    </div>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-ink-100 text-ink-600 text-[11px] font-mono">{children}</span>
}

function StartTab() {
  return (
    <div>
      <p className="text-[13px] text-ink-600 leading-relaxed mb-5">
        用本工具做一个小程序，全程不需要写代码、不需要登录、也不需要 AppID。四步就能拿到可运行的成品：
      </p>
      <Section n={1} title="选模板">
        <p>首页有 <b>15 套行业模板</b>（电商、餐饮、美业、企业、教育…），每套自带 4 个完整页面和真实业务文案。点「使用此模板」即可进入编辑器。</p>
      </Section>
      <Section n={2} title="改内容">
        <p>在中间手机里 <b>点选任意组件</b>，右侧就会出现它的属性面板，直接改文字、图片、价格、列表数据即可。</p>
        <p>想加功能？从左侧「组件」面板点一下，组件就出现在页面上。</p>
      </Section>
      <Section n={3} title="换风格">
        <p>右侧切到「主题与页面」，改一个主色，整站按钮、图标、选中态全部联动变色；还能调圆角、底部导航与导航栏标题。</p>
      </Section>
      <Section n={4} title="导出 / 部署">
        <p>点右上角 <Pill>导出代码</Pill> 拿到 zip；或点 <Pill>一键部署</Pill> 下载一个自带脚本的包，解压后双击 deploy.bat 即可在微信开发者工具里打开。</p>
      </Section>
    </div>
  )
}

function EditorTab() {
  return (
    <div>
      <p className="text-[13px] text-ink-600 leading-relaxed mb-5">编辑器是三栏布局，各司其职：</p>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {[
          { t: '左侧 · 组件 / 图层 / 页面', d: '组件库点一下加组件；图层树管理层级与顺序；页面里新建、复制、排序、设首页、加底部导航。' },
          { t: '中间 · 手机画布', d: '1:1 实时预览，点选组件即选中；顶部切换页面、缩放。所见即所得。' },
          { t: '右侧 · 属性 / 主题', d: '选中组件改内容与外观；主题面板一次改完全站配色、圆角、TabBar 与导航栏。' },
        ].map((c) => (
          <div key={c.t} className="rounded-xl border border-ink-100 p-3.5">
            <div className="text-[12.5px] font-semibold text-brand-700 mb-1.5">{c.t}</div>
            <div className="text-[12px] text-ink-500 leading-relaxed">{c.d}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-ink-50 border border-ink-100 p-4 text-[12.5px] text-ink-600 leading-relaxed">
        <b className="text-ink-800">💡 快捷键</b>：选中组件后，<Pill>Ctrl/Cmd+D</Pill> 复制、<Pill>Ctrl/Cmd+C/V</Pill> 跨页复制粘贴、<Pill>↑/↓</Pill> 上下移动、<Pill>Delete</Pill> 删除、<Pill>Ctrl/Cmd+Z</Pill> 撤销。
      </div>
    </div>
  )
}

function AppIdTab() {
  return (
    <div>
      <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 mb-5 text-[13px] text-emerald-700 leading-relaxed">
        <b>好消息：预览完全不需要 AppID。</b> 光是用本工具在浏览器里搭建 + 网页内手机预览，就已经是零安装、零账号、零 AppID。只有在「真机扫码」和「正式发布」时才涉及微信开发者工具与个人微信。
      </div>

      <Section n={1} title="网页内预览（零操作）">
        <p>在本工具里点选、编辑、缩放，手机壳里实时出效果。<b>不需要装任何东西，不需要 AppID</b>。</p>
      </Section>
      <Section n={2} title="开发者工具模拟器预览（免 AppID）">
        <p>点「一键部署」下载的包，默认 appid 是 <Pill>touristappid</Pill>（微信测试号）。双击 deploy.bat / deploy.sh 自动打开项目，<b>不用填 AppID</b>，左侧模拟器直接出画面。</p>
      </Section>
      <Section n={3} title="真机扫码（免 AppID，仅需登录）">
        <p>解压包里新增 preview-qr.bat / preview-qr.sh，双击后自动生成二维码图片并打开，<b>用手机微信扫码即可看真机效果</b>。唯一前提：你本人在开发者工具里登录过个人微信（免费，不是 AppID）——这是微信平台的登录要求，无法绕开。</p>
      </Section>
      <Section n={4} title="正式发布上线（唯一需要 AppID 的环节）">
        <p>微信公众平台规则所限，<b>上传 / 发布必须用自己的小程序 AppID</b>，这一步没法零操作。</p>
        <p>最顺滑的做法：在本工具右侧「主题与页面 → 发布设置」里填好你的 AppID，再点「一键部署」后双击 upload.bat 脚本即可；或直接改导出包里 <Pill>project.config.json</Pill> 的 <Pill>appid</Pill> 字段。</p>
      </Section>
    </div>
  )
}

function FaqTab() {
  const faqs = [
    ['导出的图片显示不出来？', '默认用渐变占位块，不依赖网络，可离线预览。把数据里的 image / src / logo / avatar 换成真实 https 图片地址即可显示真图。'],
    ['提示「未检测到微信开发者工具」？', '请先安装微信开发者工具（developers.weixin.qq.com/miniprogram/dev/devtools/download.html），装好重新双击脚本即可。'],
    ['域名校验报错？', '开发者工具右上角「详情」→「本地设置」→ 勾选「不校验合法域名」。'],
    ['想接自己的后端 / 接口？', '在导出包的 utils/handlers.js 里（如 onSubmit）调用 wx.request 即可。'],
    ['数据会传到服务器吗？', '不会。整个工具跑在浏览器里，导出用 JSZip 在本地打包，项目数据只存在你本机 localStorage。'],
  ]
  return (
    <div className="space-y-4">
      {faqs.map(([q, a]) => (
        <div key={q}>
          <div className="text-[13px] font-semibold text-ink-900 flex items-start gap-2">
            <span className="text-brand-600 mt-0.5">Q</span>
            {q}
          </div>
          <div className="text-[12.5px] text-ink-500 leading-relaxed pl-6 mt-1">{a}</div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 引导高亮（首次进入编辑器自动播放）                                    */
/* ------------------------------------------------------------------ */

interface Step {
  sel: string
  title: string
  body: string
  side: 'left' | 'right' | 'bottom'
}

const STEPS: Step[] = [
  {
    sel: '#tour-left',
    title: '① 组件库（左侧）',
    body: '这里有 34 个业务组件，分基础 / 导航 / 营销 / 交易 / 内容 / 表单六组。点一下组件就会加到当前页面；选中某个容器组件后再点，则加进容器里。',
    side: 'right',
  },
  {
    sel: '#tour-canvas',
    title: '② 手机画布（中间）',
    body: '在手机里点任意组件即可选中它；点空白处取消选中。顶部可切换页面、缩放预览。所见即所得，和导出到微信里看到的几乎一致。',
    side: 'bottom',
  },
  {
    sel: '#tour-right',
    title: '③ 属性面板（右侧）',
    body: '选中组件后，在这里改文字、图片、列表、价格等数据；下方「外观样式」调间距、圆角、背景。切到「主题与页面」可一次改完全站配色和 TabBar。',
    side: 'left',
  },
  {
    sel: '#tour-actions',
    title: '④ 一键导出 / 部署',
    body: '改满意后，点「导出代码」拿到 zip；或点「一键部署」下载一个自带脚本的包，解压后双击 deploy.bat 即可在微信开发者工具里打开——免 AppID、免命令行。',
    side: 'bottom',
  },
]

function rectOf(sel: string): DOMRect | null {
  const el = document.querySelector(sel)
  return el ? el.getBoundingClientRect() : null
}

function GuidedTour({ onClose, onOpenCenter }: { onClose: () => void; onOpenCenter: () => void }) {
  const [i, setI] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const step = STEPS[i]
  const last = i === STEPS.length - 1

  const measure = () => setRect(rectOf(step.sel))
  useEffect(() => {
    measure()
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i])

  // 进入引导前，确保左右面板可见、处于组件/属性视图
  useEffect(() => {
    useApp.getState().setLeftTab('components')
    useApp.getState().setRightTab('prop')
    window.dispatchEvent(new CustomEvent('mp:exit-zen'))
  }, [])

  const finish = () => {
    try {
      localStorage.setItem(TOUR_DONE_KEY, '1')
    } catch {
      /* ignore */
    }
    onClose()
  }

  // 计算提示卡位置
  const cardW = 320
  let cardStyle: React.CSSProperties = {}
  if (rect) {
    const gap = 16
    if (step.side === 'right') {
      cardStyle = { left: Math.min(rect.right + gap, window.innerWidth - cardW - 12), top: Math.max(12, rect.top) }
    } else if (step.side === 'left') {
      cardStyle = { left: Math.max(12, rect.left - cardW - gap), top: Math.max(12, rect.top) }
    } else {
      const cx = rect.left + rect.width / 2
      cardStyle = { left: Math.min(Math.max(12, cx - cardW / 2), window.innerWidth - cardW - 12), top: Math.min(rect.bottom + gap, window.innerHeight - 220) }
    }
  }

  return (
    <div className="fixed inset-0 z-[80]">
      {/* 透明遮挡层：阻止操作页面 */}
      <div className="absolute inset-0" onClick={() => {}} />

      {/* 高亮挖空：透明中部 + 巨幅阴影把外部压暗 */}
      {rect ? (
        <div
          className="absolute pointer-events-none"
          style={{
            left: rect.left - 6,
            top: rect.top - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            borderRadius: 14,
            boxShadow: '0 0 0 9999px rgba(15,23,42,.58)',
            border: '2px solid #ffffff',
          }}
        />
      ) : null}

      {/* 提示卡 */}
      <div
        className="absolute w-[320px] bg-white rounded-2xl shadow-panel overflow-hidden"
        style={{ ...cardStyle, pointerEvents: 'auto' }}
      >
        <div className="flex items-center justify-between px-4 h-12 border-b border-ink-100">
          <span className="text-[13.5px] font-semibold text-ink-900">{step.title}</span>
          <button onClick={finish} className="h-7 w-7 rounded-lg text-ink-400 hover:bg-ink-50 inline-flex items-center justify-center">
            <X size={15} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-[12.5px] text-ink-500 leading-relaxed">{step.body}</p>
        </div>
        <div className="flex items-center justify-between px-4 h-14 border-t border-ink-100">
          <div className="flex items-center gap-1.5">
            {STEPS.map((_, k) => (
              <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-5 bg-brand-600' : 'w-1.5 bg-ink-200'}`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onOpenCenter} className="text-[12px] text-ink-400 hover:text-brand-600 inline-flex items-center gap-1">
              教程中心 <ArrowRight size={12} />
            </button>
            {i > 0 ? (
              <button
                onClick={() => setI((v) => v - 1)}
                className="h-8 px-3 rounded-lg border border-ink-200 text-ink-600 text-[12.5px] inline-flex items-center gap-1 hover:border-brand-300 transition"
              >
                <ChevronLeft size={14} /> 上一步
              </button>
            ) : null}
            {last ? (
              <button onClick={finish} className="h-8 px-4 rounded-lg bg-brand-600 text-white text-[12.5px] font-medium inline-flex items-center gap-1 hover:bg-brand-700 transition">
                <CheckCircle2 size={14} /> 完成
              </button>
            ) : (
              <button
                onClick={() => setI((v) => v + 1)}
                className="h-8 px-3 rounded-lg bg-brand-600 text-white text-[12.5px] font-medium inline-flex items-center gap-1 hover:bg-brand-700 transition"
              >
                下一步 <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 根组件：监听事件，统一渲染两种教程 UI                                 */
/* ------------------------------------------------------------------ */

export function TutorialRoot() {
  const [center, setCenter] = useState(false)
  const [tour, setTour] = useState(false)

  useEffect(() => {
    const open = () => setCenter(true)
    const start = () => setTour(true)
    window.addEventListener('mp:open-tutorial', open)
    window.addEventListener('mp:start-tour', start)
    return () => {
      window.removeEventListener('mp:open-tutorial', open)
      window.removeEventListener('mp:start-tour', start)
    }
  }, [])

  return (
    <>
      {center ? (
        <TutorialCenter onClose={() => setCenter(false)} onStartTour={() => { setCenter(false); startGuidedTour() }} />
      ) : null}
      {tour ? <GuidedTour onClose={() => setTour(false)} onOpenCenter={() => { setTour(false); setCenter(true) }} /> : null}
    </>
  )
}

/** 供 Editor 判断是否需要首次引导 */
export function shouldAutoTour(): boolean {
  try {
    return localStorage.getItem(TOUR_DONE_KEY) !== '1'
  } catch {
    return true
  }
}
