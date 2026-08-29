import './jsdom-setup'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { TEMPLATES } from '../src/templates'
import { PhoneFrame } from '../src/ui/PhoneFrame'
import Home from '../src/ui/Home'
import Editor from '../src/ui/Editor'
import { useApp } from '../src/store/useApp'
import { generateCodeFiles, collectIcons } from '../src/export/mpgen'
import { buildDeployScripts } from '../src/export/deploy'
import { REGISTRY } from '../src/core/registry'
import { ICONS, ICON_KEYS } from '../src/core/icons'
import type { MpNode } from '../src/types'

let failed = 0
const check = (name: string, fn: () => void) => {
  try {
    fn()
    console.log(`  ok   ${name}`)
  } catch (e) {
    failed++
    console.log(`  FAIL ${name}\n       ${(e as Error).message.split('\n')[0]}`)
  }
}

/** 真实客户端渲染一段 React 树，返回 HTML */
function render(el: React.ReactElement): string {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  act(() => {
    root.render(el)
  })
  const html = host.innerHTML
  act(() => {
    root.unmount()
  })
  host.remove()
  return html
}

/* 1. 所有模板、所有页面渲染 */
let pageCount = 0
for (const tpl of TEMPLATES) {
  const project = { ...tpl.build(), id: 'smoke' }
  for (const page of project.pages) {
    pageCount++
    check(`${tpl.id}/${page.name}`, () => {
      const html = render(<PhoneFrame project={project} page={page} editable selectedId={null} />)
      if (html.length < 200) throw new Error('渲染结果过短')
      if (html.includes('未知组件')) throw new Error('存在未识别组件')
    })
  }
  check(`${tpl.id} 代码生成`, () => {
    const files = generateCodeFiles(project)
    const paths = files.map((f) => f.path)
    for (const p of project.pages) {
      for (const ext of ['js', 'wxml', 'wxss', 'json']) {
        if (!paths.includes(`${p.path}.${ext}`)) throw new Error(`缺少 ${p.path}.${ext}`)
      }
    }
    for (const ic of collectIcons(project)) {
      if (!ICONS[ic]) throw new Error(`图标未定义: ${ic}`)
    }
    const appJson = JSON.parse(String(files.find((f) => f.path === 'app.json')!.content))
    if (appJson.pages.length !== project.pages.length) throw new Error('app.json 页面数不一致')
    if (project.tabBar.enabled) {
      if (appJson.tabBar.list.length !== project.tabBar.items.length) throw new Error('tabBar 项数不一致')
      for (const it of project.tabBar.items) {
        if (!project.pages.some((p) => p.path === it.pagePath)) throw new Error(`tabBar 指向不存在的页面: ${it.pagePath}`)
        if (!ICON_KEYS.includes(it.icon)) throw new Error(`tabBar 图标未定义: ${it.icon}`)
      }
    } else if (appJson.tabBar) {
      throw new Error('未启用 tabBar 却生成了配置')
    }
    for (const f of files) {
      if (f.path.endsWith('.json')) JSON.parse(String(f.content))
      if (f.path.endsWith('.js')) {
        const src = String(f.content)
        // 语法检查
        try {
          new Function('require', 'module', 'exports', 'Page', 'wx', 'App', src)
        } catch (e) {
          throw new Error(`${f.path} 语法错误: ${(e as Error).message}`)
        }
        // 数据中不应出现 undefined 值
        if (f.path.startsWith('pages/') && /:\s*undefined|,\s*undefined\s*[,}]/.test(src)) {
          throw new Error(`${f.path} 含 undefined 值`)
        }
      }
    }
  })
}
console.log(`模板：${TEMPLATES.length} 套 / ${pageCount} 页全部渲染通过`)

/* 1.5 一键部署脚本生成 */
check('一键部署脚本生成', () => {
  const project = { ...TEMPLATES[0].build(), id: 'd1' }
  const deploy = buildDeployScripts(project)
  const paths = deploy.map((f) => f.path)
  for (const name of ['deploy.bat', 'deploy.sh', 'preview-qr.bat', 'preview-qr.sh', 'upload.bat', 'upload.sh', 'DEPLOY.txt']) {
    if (!paths.includes(name)) throw new Error(`缺少部署文件: ${name}`)
  }
  const bat = String(deploy.find((f) => f.path === 'deploy.bat')!.content)
  if (!/cli\b/.test(bat)) throw new Error('bat 未引用 cli')
  if (!/open --project/.test(bat)) throw new Error('bat 未包含 open 指令')
  if (!/chcp 65001/.test(bat)) throw new Error('bat 缺少 UTF-8 编码声明')
  // 关键：bat 绝不能有 BOM，必须以 @echo off 开头（否则中文 Windows 命令行会把首行当乱码）
  if (/^\uFEFF/.test(bat)) throw new Error('bat 带 BOM，会导致命令行首行乱码')
  if (!/^@echo off/.test(bat)) throw new Error('bat 首行不是 @echo off')
  const sh = String(deploy.find((f) => f.path === 'deploy.sh')!.content)
  if (!/cli\b/.test(sh)) throw new Error('sh 未引用 cli')
  if (!/open --project/.test(sh)) throw new Error('sh 未包含 open 指令')
  const upBat = String(deploy.find((f) => f.path === 'upload.bat')!.content)
  if (!/upload --project/.test(upBat)) throw new Error('上传 bat 未包含 upload 指令')
  if (!/--version/.test(upBat)) throw new Error('上传 bat 缺少版本号参数')
  const qrBat = String(deploy.find((f) => f.path === 'preview-qr.bat')!.content)
  if (!/preview --project/.test(qrBat)) throw new Error('二维码 bat 未包含 preview 指令')
  // 脚本应为纯 ASCII（微信开发者工具安装路径含中文，由 chcp 65001 解析，不在脚本字面量里显示）
  const ascii = (s: string) => [...s].every((c) => c.charCodeAt(0) < 128)
  for (const f of deploy) {
    if (f.path.endsWith('.bat') && !ascii(String(f.content))) {
      throw new Error(`部署脚本含非 ASCII 字符: ${f.path}`)
    }
  }
  const guide = String(deploy.find((f) => f.path === 'DEPLOY.txt')!.content)
  if (!/DevTools/.test(guide)) throw new Error('说明文档缺失关键信息')
  if (!/AppID/.test(guide)) throw new Error('说明文档未提及 AppID 说明')
  // 部署脚本与源码文件无冲突
  const code = generateCodeFiles(project)
  const codePaths = new Set(code.map((f) => f.path))
  for (const d of deploy) {
    if (codePaths.has(d.path)) throw new Error(`部署文件与源码重名: ${d.path}`)
  }
})

/* 2. 每个组件类型渲染一次 */
check('全部组件类型渲染', () => {
  const project = { ...TEMPLATES[0].build(), id: 'x' }
  const nodes: MpNode[] = Object.keys(REGISTRY).map((type, i) => ({
    id: `t_${i}`,
    type,
    props: { ...REGISTRY[type].defaultProps },
    style: { ...REGISTRY[type].defaultStyle },
    children: REGISTRY[type].container ? [] : undefined,
  }))
  const html = render(<PhoneFrame project={project} page={{ ...project.pages[0], nodes }} editable selectedId={null} />)
  if (html.includes('未知组件')) throw new Error('存在未识别组件')
})
console.log(`组件类型：${Object.keys(REGISTRY).length} 个全部渲染通过`)

/* 3. 首页 */
check('首页渲染', () => {
  const html = render(<Home />)
  if (!html.includes('小程序模板工坊')) throw new Error('首页标题缺失')
  if (!html.includes('使用此模板')) throw new Error('模板卡片缺失')
})

/* 4. 编辑器 */
let editorHtml = ''
check('编辑器渲染', () => {
  const project = { ...TEMPLATES[3].build(), id: 'e1' }
  act(() => {
    useApp.setState({
      project,
      view: 'editor',
      currentPageId: project.pages[0].id,
      selectedId: project.pages[0].nodes[2]?.id ?? null,
      rightTab: 'prop',
      leftTab: 'components',
    })
  })
  editorHtml = render(<Editor />)
  if (editorHtml.includes('正在加载项目')) throw new Error('项目未加载')
  if (!editorHtml.includes('组件属性')) throw new Error('属性面板缺失')
  if (!editorHtml.includes('一键部署')) throw new Error('一键部署按钮缺失')
  if (!editorHtml.includes('导出代码')) throw new Error('导出按钮缺失')
})
check('属性面板显示选中组件', () => {
  if (!editorHtml.includes('外观样式')) throw new Error('选中组件后未显示样式区')
})
check('主题面板', () => {
  act(() => useApp.setState({ rightTab: 'theme' }))
  const html = render(<Editor />)
  if (!html.includes('全局配色')) throw new Error('主题面板缺失')
  if (!html.includes('底部导航 TabBar')) throw new Error('TabBar 配置缺失')
  act(() => useApp.setState({ rightTab: 'prop' }))
})
check('图层面板', () => {
  act(() => useApp.setState({ leftTab: 'layers' }))
  const html = render(<Editor />)
  if (!html.includes('当前页面图层')) throw new Error('图层面板缺失')
  act(() => useApp.setState({ leftTab: 'components' }))
})
check('页面管理面板', () => {
  act(() => useApp.setState({ leftTab: 'pages' }))
  const html = render(<Editor />)
  if (!html.includes('新建页面')) throw new Error('页面面板缺失')
  act(() => useApp.setState({ leftTab: 'components' }))
})

/* 5. Store 增删改 + 撤销重做 */
check('Store 操作', () => {
  const before = () => useApp.getState().project!.pages[0].nodes.length
  const b = before()
  act(() => useApp.getState().addNode('title'))
  if (before() !== b + 1) throw new Error('新增组件失败')
  const nid = useApp.getState().project!.pages[0].nodes[b].id
  act(() => useApp.getState().updateNodeProps(nid, { content: '测试标题' }))
  if (useApp.getState().project!.pages[0].nodes.find((x) => x.id === nid)?.props.content !== '测试标题')
    throw new Error('更新属性失败')
  act(() => useApp.getState().undo())
  if (useApp.getState().project!.pages[0].nodes.find((x) => x.id === nid)?.props.content === '测试标题')
    throw new Error('撤销未回滚属性')
  act(() => useApp.getState().redo())
  if (useApp.getState().project!.pages[0].nodes.find((x) => x.id === nid)?.props.content !== '测试标题')
    throw new Error('重做失败')
  act(() => useApp.getState().removeNode(nid))
  if (before() !== b) throw new Error('删除失败')
  act(() => useApp.getState().updateTheme({ primary: '#123456' }))
  if (useApp.getState().project!.theme.primary !== '#123456') throw new Error('主题更新失败')
  const pages = useApp.getState().project!.pages.length
  act(() => useApp.getState().addPage())
  if (useApp.getState().project!.pages.length !== pages + 1) throw new Error('新增页面失败')
  check('新建页面可生成代码', () => {
    const files = generateCodeFiles(useApp.getState().project!)
    const appJson = JSON.parse(String(files.find((f) => f.path === 'app.json')!.content))
    if (appJson.pages.length !== pages + 1) throw new Error('新页面未写入 app.json')
  })
  const newId = useApp.getState().project!.pages[pages].id
  act(() => useApp.getState().removePage(newId))
  if (useApp.getState().project!.pages.length !== pages) throw new Error('删除页面失败')
})

/* 6. 持久化 */
check('本地持久化', () => {
  const raw = localStorage.getItem('mp-template-studio:v1')
  if (!raw) throw new Error('未写入 localStorage')
  const p = JSON.parse(raw)
  if (!p.pages?.length) throw new Error('存储内容不完整')
  act(() => useApp.setState({ project: null, view: 'home' }))
  if (!useApp.getState().restore()) throw new Error('恢复失败')
  if (!useApp.getState().project) throw new Error('恢复后项目为空')
})

console.log(failed === 0 ? '\n✅ 全部冒烟测试通过' : `\n❌ ${failed} 项失败`)
process.exit(failed === 0 ? 0 : 1)
