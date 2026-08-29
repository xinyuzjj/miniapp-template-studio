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
import { runSelfCheck } from '../src/export/selfcheck'
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

/* 7. 组件联动（点击跳转） */
check('组件联动：属性面板设置跳转目标', () => {
  const project = { ...TEMPLATES[2].build(), id: 'nav1' }
  const target = project.pages[1].path
  useApp.setState({ project, currentPageId: project.pages[0].id })
  act(() => useApp.getState().updateNodeLink(project.pages[0].nodes[0].id, target))
  const ln = useApp.getState().project!.pages[0].nodes.find((n) => n.id === project.pages[0].nodes[0].id)?.link
  if (!ln || ln.to !== target) throw new Error('updateNodeLink 未写入 link')
})

check('组件联动：导出生成 onJump + mp-link 包裹', () => {
  const project = { ...TEMPLATES[2].build(), id: 'nav2' }
  const target = project.pages[1].path
  useApp.setState({ project, currentPageId: project.pages[0].id })
  act(() => useApp.getState().updateNodeLink(project.pages[0].nodes[0].id, target))
  const p = useApp.getState().project!
  const files = generateCodeFiles(p)
  const renderWxml = String(files.find((f) => f.path === 'templates/render.wxml')!.content)
  if (!renderWxml.includes('onJump')) throw new Error('render.wxml 未生成 onJump 绑定')
  if (!renderWxml.includes('class="mp-link"')) throw new Error('render.wxml 未包裹 mp-link 容器')
  const pageWxml = String(files.find((f) => f.path === `${p.pages[0].path}.wxml`)!.content)
  if (!pageWxml.includes('template is="mp-node"')) throw new Error('页面 wxml 未引用 mp-node 模板')
  if (!pageWxml.includes('import src="/templates/render.wxml"')) throw new Error('页面 wxml 未引入 render.wxml')
  const pageJs = String(files.find((f) => f.path === `${p.pages[0].path}.js`)!.content)
  if (!pageJs.includes('tabPages:')) throw new Error('页面 js 未注入 tabPages')
})

check('组件联动：tabBar 跳转用 switchTab', () => {
  const project = { ...TEMPLATES[0].build(), id: 'nav3' }
  if (!project.tabBar.enabled) return
  const files = generateCodeFiles(project)
  const handlers = String(files.find((f) => f.path === 'utils/handlers.js')!.content)
  if (!handlers.includes('onJump:')) throw new Error('handlers.js 未生成 onJump 处理器')
  if (!handlers.includes('switchTab')) throw new Error('handlers.js 未使用 switchTab')
})

check('组件联动：通用点击 onTap 绑定到所有 CTA', () => {
  const project = { ...TEMPLATES[3].build(), id: 'tap1' }
  const files = generateCodeFiles(project)
  const handlers = String(files.find((f) => f.path === 'utils/handlers.js')!.content)
  if (!handlers.includes('onTap:')) throw new Error('handlers.js 缺少 onTap 处理器')
  if (!handlers.includes('onPay:')) throw new Error('handlers.js 缺少 onPay 支付接入点')
  const wxml = String(files.find((f) => f.path === 'templates/render.wxml')!.content)
  if (!wxml.includes('catchtap="onTap"')) throw new Error('render.wxml 未给 CTA 绑定 onTap')
  if (!wxml.includes('data-action="checkout"')) throw new Error('cartBar 未绑定结算动作')
  if (!wxml.includes('data-action="claim"')) throw new Error('coupon 未绑定领取动作')
})

check('P0 本地数据层：导出 store.js / privacy.js 并接入', () => {
  const project = { ...TEMPLATES[0].build(), id: 'p0a' }
  const files = generateCodeFiles(project)
  const paths = files.map((f) => f.path)
  if (!paths.includes('utils/store.js')) throw new Error('未生成 utils/store.js')
  if (!paths.includes('utils/privacy.js')) throw new Error('未生成 utils/privacy.js')
  const appJs = String(files.find((f) => f.path === 'app.js')!.content)
  if (!appJs.includes('require(\'./utils/privacy.js\')')) throw new Error('app.js 未调用隐私授权')
  const handlers = String(files.find((f) => f.path === 'utils/handlers.js')!.content)
  if (!handlers.includes('syncCartBadge')) throw new Error('handlers.js 未包含同步角标')
  if (!handlers.includes('addCart')) throw new Error('handlers.js 未调用 addCart')
})

check('P0 本地数据层：购物车角标索引注入页面 + 商品加购绑定', () => {
  const cartTpl = TEMPLATES.find((t) => {
    const p = t.build()
    return p.tabBar.enabled && p.tabBar.items.some((it) => /cart|购物|购/.test(it.pagePath + '|' + it.text))
  })
  if (!cartTpl) return // 无购物车 tab 的模板跳过
  const project = { ...cartTpl.build(), id: 'p0c' }
  const files = generateCodeFiles(project)
  const pageJs = String(files.find((f) => f.path === `${project.pages[0].path}.js`)!.content)
  if (!pageJs.includes('cartIndex:')) throw new Error('页面 js 未注入 cartIndex')
  if (!pageJs.includes('onShow:')) throw new Error('页面 js 未注入 onShow 同步角标')
  const wxml = String(files.find((f) => f.path === 'templates/render.wxml')!.content)
  if (!wxml.includes('data-action="buy"')) throw new Error('商品组件未绑定加购动作')
})

check('导出自检：正常项目通过', () => {
  const project = { ...TEMPLATES[4].build(), id: 'sc1' }
  const r = runSelfCheck(project)
  if (!r.ok) throw new Error('正常项目自检未通过：' + r.items.filter((i) => i.level === 'error').map((i) => i.message).join('；'))
  if (r.fileCount < 5) throw new Error('文件数异常')
})

check('导出自检：捕获非法跳转目标', () => {
  const project = { ...TEMPLATES[0].build(), id: 'sc2' }
  project.pages[0].nodes[0].link = { to: 'pages/does-not-exist/index' }
  const r = runSelfCheck(project)
  if (r.ok) throw new Error('未捕获非法跳转目标')
  if (!r.items.some((i) => i.level === 'error' && i.message.includes('跳转目标不存在')))
    throw new Error('未报告跳转目标错误')
})

/* 8. 自定义组件区块 */
check('自定义区块：保存为可复用区块', () => {
  const project = { ...TEMPLATES[3].build(), id: 'blk1' }
  useApp.setState({ project, currentPageId: project.pages[0].id })
  const before = useApp.getState().blocks.length
  const nodeId = project.pages[0].nodes[3]?.id ?? project.pages[0].nodes[0].id
  act(() => useApp.getState().saveBlock('我的区块', nodeId))
  const after = useApp.getState().blocks.length
  if (after !== before + 1) throw new Error('保存区块失败')
  const blk = useApp.getState().blocks[after - 1]
  if (!blk.nodes?.length) throw new Error('区块内容为空')
  if (blk.name !== '我的区块') throw new Error('区块名称不对')
})

check('自定义区块：插入与删除', () => {
  const project = { ...TEMPLATES[3].build(), id: 'blk2' }
  useApp.setState({ project, currentPageId: project.pages[0].id })
  act(() => useApp.getState().saveBlock('测试区块', project.pages[0].nodes[0].id))
  const bid = useApp.getState().blocks[useApp.getState().blocks.length - 1].id
  const before = useApp.getState().project!.pages[0].nodes.length
  act(() => useApp.getState().insertBlock(bid))
  const inserted = useApp.getState().project!.pages[0].nodes.length
  if (inserted !== before + 1) throw new Error('插入区块失败')
  const bbefore = useApp.getState().blocks.length
  act(() => useApp.getState().deleteBlock(bid))
  if (useApp.getState().blocks.length !== bbefore - 1) throw new Error('删除区块失败')
})

console.log(failed === 0 ? '\n✅ 全部冒烟测试通过' : `\n❌ ${failed} 项失败`)
process.exit(failed === 0 ? 0 : 1)
