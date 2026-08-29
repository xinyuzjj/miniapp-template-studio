import type { MpNode, MpProject, NodeStyle, Theme } from '../types'
import { paletteAt } from '../core/palette'
import { RENDER_WXML, RENDER_WXSS } from './wxml'

export interface GenFile {
  path: string
  content: string | Uint8Array
}

/* ------------------------------------------------------------------ */
/* 主题派生                                                            */
/* ------------------------------------------------------------------ */

function hexToRgba(hex: string, a: number): string {
  const h = (hex || '#000000').replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16) || 0
  return `rgba(${(num >> 16) & 255},${(num >> 8) & 255},${num & 255},${a})`
}

export function themeTokens(t: Theme) {
  return {
    primary: t.primary,
    primaryLight: t.primaryLight,
    secondary: t.secondary,
    accent: t.accent,
    text: t.text,
    subText: t.subText,
    background: t.background,
    cardBg: t.cardBg,
    _pri72: hexToRgba(t.primary, 0.72),
    _pri08: `linear-gradient(170deg, ${hexToRgba(t.primary, 0.08)}, #ffffff 60%)`,
    _pri12: hexToRgba(t.primary, 0.12),
    _pri30: hexToRgba(t.primary, 0.3),
    _priGrad: `linear-gradient(120deg, ${t.primary} 0%, ${hexToRgba(t.primary, 0.72)} 100%)`,
    _sec25: hexToRgba(t.secondary, 0.25),
    _sec35: hexToRgba(t.secondary, 0.35),
    _grayBg: '#f4f6f9',
  }
}

/* ------------------------------------------------------------------ */
/* 节点编译                                                            */
/* ------------------------------------------------------------------ */

function styleStr(s: NodeStyle = {}): string {
  const parts: string[] = []
  const rp = (v?: number) => `${(v ?? 0) * 2}rpx`
  if (s.marginTop) parts.push(`margin-top:${rp(s.marginTop)}`)
  if (s.marginBottom) parts.push(`margin-bottom:${rp(s.marginBottom)}`)
  if (s.paddingTop) parts.push(`padding-top:${rp(s.paddingTop)}`)
  if (s.paddingBottom) parts.push(`padding-bottom:${rp(s.paddingBottom)}`)
  const padL = s.paddingLeft ?? 0
  const padR = s.paddingRight ?? padL
  if (padL) parts.push(`padding-left:${rp(padL)}`)
  if (padR) parts.push(`padding-right:${rp(padR)}`)
  if (s.radius) parts.push(`border-radius:${rp(s.radius)}`)
  if (s.background && s.background !== 'transparent') parts.push(`background:${s.background}`)
  if (s.borderWidth) parts.push(`border:${(s.borderWidth ?? 1) * 2}rpx solid ${s.borderColor || '#eef0f4'}`)
  if (s.shadow === 1) parts.push('box-shadow:0 2rpx 10rpx rgba(16,24,40,.06)')
  if (s.shadow === 2) parts.push('box-shadow:0 8rpx 28rpx rgba(16,24,40,.12)')
  return parts.join(';')
}

function splitTags(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v.map(String)
  return String(v).split(/[,，]/).map((s) => s.trim()).filter(Boolean)
}

export function compileNodes(nodes: MpNode[], seed = { n: 0 }): any[] {
  return nodes.map((node) => {
    const props: Record<string, any> = JSON.parse(JSON.stringify(node.props ?? {}))

    // 列表项：补渐变与派生字段
    for (const key of ['items', 'list', 'fields', 'links']) {
      const arr = props[key]
      if (!Array.isArray(arr)) continue
      props[key] = arr.map((it: any, i: number) => {
        const [g1, g2] = paletteAt(i + seed.n)
        const out: any = { ...it, _i: i, _g1: g1, _g2: g2 }
        if (typeof it.features === 'string') out._features = it.features.split('\n').filter(Boolean)
        if (out._features === undefined) out._features = []
        if (it.tags !== undefined) out._tags = splitTags(it.tags)
        if (it.avatar !== undefined || it.name !== undefined) out._initial = String(it.name ?? 'U').slice(0, 1)
        if (it.rating !== undefined) out._stars = Array.from({ length: Math.max(0, Math.min(5, Number(it.rating) || 5)) }, (_, k) => k)
        return out
      })
      seed.n += arr.length
    }

    // 单图字段占位渐变
    const [g1, g2] = paletteAt(seed.n)
    props._g1 = g1
    props._g2 = g2
    seed.n += 1

    // 地图占位背景
    if (node.type === 'map') {
      props._mapBg = `linear-gradient(135deg, ${hexToRgba(g1, 0.3)} 0%, ${hexToRgba(g2, 0.3)} 100%)`
    }

    const out: any = {
      id: node.id,
      type: node.type,
      props,
      _s: styleStr(node.style),
      _r: node.style?.radius ?? 12,
      _link: node.link?.to || '',
    }
    if (node.children && node.children.length) out.children = compileNodes(node.children, seed)
    return out
  })
}

/* ------------------------------------------------------------------ */
/* 扫描用到的图标                                                       */
/* ------------------------------------------------------------------ */

export function collectIcons(project: MpProject): Set<string> {
  const set = new Set<string>()
  const walk = (nodes: MpNode[]) => {
    nodes.forEach((n) => {
      const p = n.props ?? {}
      if (typeof p.icon === 'string' && p.icon) set.add(p.icon)
      for (const key of ['items', 'list', 'fields']) {
        const arr = (p as any)[key]
        if (Array.isArray(arr)) arr.forEach((it: any) => it && typeof it.icon === 'string' && it.icon && set.add(it.icon))
      }
      if (n.children) walk(n.children)
    })
  }
  project.pages.forEach((p) => walk(p.nodes))
  set.add('chevronRight')
  return set
}

/* ------------------------------------------------------------------ */
/* 各文件内容                                                          */
/* ------------------------------------------------------------------ */

const APP_JS = `App({
  globalData: {},
  onLaunch: function () {
    // 可在此处放置登录、获取定位等初始化逻辑
  }
})
`

const APP_WXSS = `page {
  background: #f5f6f9;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Helvetica, sans-serif;
  color: #1a1d28;
  -webkit-font-smoothing: antialiased;
}
view, text, image, input, textarea, scroll-view, swiper, swiper-item {
  box-sizing: border-box;
}
button::after { border: none; }
::-webkit-scrollbar { width: 0; height: 0; color: transparent; }
`

const HANDLERS_JS = `/**
 * 页面公共交互
 * 所有事件只做最小可用的示例实现，方便你按需替换为真实接口。
 */
module.exports = {
  onInput: function (e) {
    this.setData({ ['form.' + e.currentTarget.dataset.i]: e.detail.value })
  },

  onDate: function (e) {
    var i = e.currentTarget.dataset.i
    this.setData({ ['form.' + i]: e.detail.value })
  },

  onPick: function (e) {
    var i = e.currentTarget.dataset.i
    this.setData({ ['form.' + i]: e.detail.value })
  },

  onSubmit: function () {
    wx.showToast({ title: '提交成功', icon: 'success' })
  },

  onFab: function (e) {
    var action = e.currentTarget.dataset.action || 'none'
    var phone = e.currentTarget.dataset.phone || ''
    if (action === 'call' && phone) {
      wx.makePhoneCall({ phoneNumber: phone.replace(/[^0-9\\-]/g, ''), fail: function () {} })
    } else if (action === 'top') {
      wx.pageScrollTo({ scrollTop: 0, duration: 300 })
    } else if (action === 'share') {
      wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'], fail: function () {} })
    } else {
      wx.showToast({ title: '更多功能开发中', icon: 'none' })
    }
  },

  onNavigate: function (e) {
    var d = e.currentTarget.dataset
    if (typeof d.lat === 'undefined' || d.lat === '') return
    wx.openLocation({
      latitude: Number(d.lat),
      longitude: Number(d.lng),
      name: d.name || '',
      address: d.addr || '',
      scale: 16
    })
  },

  onContact: function (e) {
    var v = e.currentTarget.dataset.v || ''
    var a = e.currentTarget.dataset.a || ''
    if (a === '拨打') {
      wx.makePhoneCall({ phoneNumber: v.replace(/[^0-9\\-]/g, ''), fail: function () {} })
    } else if (a === '复制') {
      wx.setClipboardData({ data: v })
    } else if (a === '导航') {
      wx.showToast({ title: '已复制地址', icon: 'none' })
      wx.setClipboardData({ data: v })
    }
  },

  /** 统一跳转：tabBar 页面 switchTab，其余 navigateTo */
  _mpJump: function (p) {
    if (!p) return
    var tabs = (this.data && this.data.tabPages) || []
    if (tabs.indexOf(p) >= 0) {
      wx.switchTab({ url: '/' + p, fail: function () {} })
    } else {
      wx.navigateTo({ url: '/' + p, fail: function () { wx.showToast({ title: '页面不存在', icon: 'none' }) } })
    }
  },

  onJump: function (e) {
    this._mpJump(e.currentTarget.dataset.page)
  },

  /** 通用点击：有目标页则跳转，否则按语义给出示例反馈（可在此接入后端 / 支付） */
  onTap: function (e) {
    var d = e.currentTarget.dataset
    if (d.page) { this._mpJump(d.page); return }
    var action = d.action
    if (action === 'search') { wx.showToast({ title: '搜索需接入后端接口', icon: 'none' }); return }
    if (action === 'claim') { wx.showToast({ title: '已领取（示例）', icon: 'success' }); return }
    if (action === 'buy' || action === 'checkout') { this.onPay(e); return }
    wx.showToast({ title: d.tip || '示例按钮 · 在编辑器为组件绑定跳转后即可跳转', icon: 'none' })
  },

  /**
   * 支付能力接入点（示意，需自行实现后端）
   * 微信支付必须走你的服务端：前端下单 → 服务端调用微信「统一下单」拿到 prepay_id →
   * 返回 nonceStr / timeStamp / signType / paySign 给前端 → 调 wx.requestPayment。
   * 完整步骤见导出包 README 的「如何接入支付 / 后端」一节。
   */
  onPay: function () {
    wx.showModal({
      title: '支付接入提示',
      content: '本模板未内置支付。请接入你的后端：① 服务端调用微信「统一下单」获取 prepay_id；② 用返回的 nonceStr / timeStamp / signType / paySign 调 wx.requestPayment。详见导出包 README。',
      showCancel: false,
    })
  }
}
`

const SITEMAP = `{
  "desc": "关于本文件的更多信息，请参考文档 https://developers.weixin.qq.com/miniprogram/dev/framework/sitemap.html",
  "rules": [{
    "action": "allow",
    "page": "*"
  }]
}
`

function themeJs(t: Theme): string {
  const tk = themeTokens(t)
  return `/**
 * 全局主题变量
 * 修改这里即可一次性调整整站配色，页面 WXML 通过 T.xxx 引用。
 */
function hexToRgba(hex, a) {
  var h = String(hex || '#000000').replace('#', '')
  if (h.length === 3) h = h.split('').map(function (c) { return c + c }).join('')
  var num = parseInt(h, 16) || 0
  return 'rgba(' + ((num >> 16) & 255) + ',' + ((num >> 8) & 255) + ',' + (num & 255) + ',' + a + ')'
}

var primary = ${JSON.stringify(tk.primary)}
var secondary = ${JSON.stringify(tk.secondary)}

module.exports = {
  primary: primary,
  primaryLight: ${JSON.stringify(tk.primaryLight)},
  secondary: secondary,
  accent: ${JSON.stringify(tk.accent)},
  text: ${JSON.stringify(tk.text)},
  subText: ${JSON.stringify(tk.subText)},
  background: ${JSON.stringify(tk.background)},
  cardBg: ${JSON.stringify(tk.cardBg)},
  _pri72: hexToRgba(primary, 0.72),
  _pri08: 'linear-gradient(170deg,' + hexToRgba(primary, 0.08) + ',#ffffff 60%)',
  _pri12: hexToRgba(primary, 0.12),
  _pri30: hexToRgba(primary, 0.3),
  _priGrad: 'linear-gradient(120deg,' + primary + ' 0%,' + hexToRgba(primary, 0.72) + ' 100%)',
  _sec25: hexToRgba(secondary, 0.25),
  _sec35: hexToRgba(secondary, 0.35),
  _grayBg: '#f4f6f9'
}
`
}

function pageJs(page: { path: string; navTitle: string }, nodes: any[], tabPaths: string[]): string {
  const data = JSON.stringify(nodes, null, 2).split('\n').join('\n  ')
  const tabData = JSON.stringify(tabPaths)
  return `// ${page.path}.js
const T = require('../../utils/theme.js')
const H = require('../../utils/handlers.js')

const NODES = ${data}

Page(Object.assign({}, H, {
  data: {
    T: T,
    nodes: NODES,
    form: {},
    tabPages: ${tabData}
  },
  onLoad: function () {
    wx.setNavigationBarTitle({ title: ${JSON.stringify(page.navTitle)} })
  },
  onShareAppMessage: function () {
    return { title: ${JSON.stringify(page.navTitle)}, path: '/${page.path}/index' }
  }
}))
`
}

function pageWxml(): string {
  return `<import src="/templates/render.wxml" />

<view class="page">
  <block wx:for="{{nodes}}" wx:for-item="node" wx:key="id">
    <template is="mp-node" data="{{node: node, T: T}}" />
  </block>
</view>
`
}

function pageWxss(bg: string): string {
  return `@import "/templates/render.wxss";

.page {
  min-height: 100vh;
  background: ${bg};
  padding-bottom: env(safe-area-inset-bottom);
}
`
}

function pageJson(p: { navTitle: string; navBg: string; navText: string }): string {
  return JSON.stringify(
    {
      navigationBarTitleText: p.navTitle,
      navigationBarBackgroundColor: p.navBg,
      navigationBarTextStyle: p.navText,
      backgroundTextStyle: 'light',
      enablePullDownRefresh: false,
      usingComponents: {},
    },
    null,
    2,
  )
}

function projectConfig(p: MpProject): string {
  return JSON.stringify(
    {
      description: p.description || '由「小程序模板工坊」自动生成',
      packOptions: { ignore: [], include: [] },
      setting: {
        urlCheck: false,
        es6: true,
        enhance: true,
        postcss: true,
        minified: true,
        newFeature: true,
        coverView: true,
        nodeModules: false,
        autoAudits: false,
        showShadowRootInWxmlPanel: true,
        scopeDataCheck: false,
        checkSiteMap: true,
        uploadWithSourceMap: true,
        useMultiFrameRuntime: true,
        useApiHook: true,
        useApiHostProcess: true,
        babelSetting: { ignore: [], disablePlugins: [], outputPath: '' },
        enableEngineNative: false,
        useIsolateContext: true,
        packNpmManually: false,
        packNpmRelationList: [],
        minifyWXSS: true,
        minifyWXML: true,
      },
      compileType: 'miniprogram',
      libVersion: '3.0.0',
      appid: p.appid || 'touristappid',
      projectname: p.name || 'miniapp',
      simulatorType: 'wechat',
      condition: {},
    },
    null,
    2,
  )
}

function readme(p: MpProject): string {
  const pages = p.pages.map((x) => `| \`${x.path}\` | ${x.name} |`).join('\n')
  return `# ${p.name}

${p.description || '由「小程序模板工坊」自动生成的小程序项目'}

## 如何运行

### 方式一：一键部署（推荐，零命令）

1. 解压本文件夹到任意目录
2. Windows 双击 **\`deploy.bat\`**，Mac 运行 **\`deploy.sh\`**
3. 脚本自动定位微信开发者工具并打开项目，登录后左侧即为手机预览
4. **真机扫码（免 AppID）**：双击 **\`preview-qr.bat / .sh\`**，自动生成二维码图片，用手机微信扫码即可预览（前提：你本人在开发者工具登录过个人微信）
5. 想发布：点工具顶部「上传」填版本号提交审核（需正式 AppID）

> 想直接上传体验版，双击 **\`upload.bat / .sh\`** 即可。
> 本项目默认 appid 为测试号 \`touristappid\`，**预览无需 AppID**；正式发布才需替换为你的 AppID。
> 详细步骤见压缩包内的 **\`DEPLOY.txt\`**。

### 方式二：手动导入

1. 打开 **微信开发者工具** → 导入项目
2. 目录选择当前文件夹根目录（含 \`project.config.json\`）
3. AppID 处选择「测试号」或填入你自己的 AppID
4. 点击导入，即可预览

> 若图片提示域名不合法：右上角「详情」→「本地设置」→ 勾选 **不校验合法域名**。
> 本项目默认使用渐变占位图，不依赖任何外链图片，可离线预览。

## 页面结构

| 路径 | 说明 |
| --- | --- |
${pages}

## 目录说明

\`\`\`
app.js / app.json / app.wxss    小程序全局配置
pages/<name>/index.*            各页面（wxml / js / wxss / json）
templates/render.wxml           通用组件渲染模板（递归渲染页面数据）
templates/render.wxss           通用组件样式
utils/theme.js                  全局主题变量，改这里可一键换色
utils/handlers.js               页面公共交互（表单、导航、拨号等）
images/icons/                   组件图标（p_ 主色 / s_ 灰色 / w_ 白色）
images/tabbar/                  底部导航图标
deploy.bat / .sh              自动打开项目的部署脚本
preview-qr.bat / .sh            生成真机预览二维码（免 AppID）
upload.bat / .sh               一键上传体验版（需正式 AppID）
DEPLOY.txt                     傻瓜式部署图文步骤
\`\`\`

## 二次开发建议

- **改内容**：编辑 \`pages/xxx/index.js\` 中的 \`NODES\`，数据结构直观，改完即时生效。
- **改配色**：编辑 \`utils/theme.js\`。
- **加交互**：在页面 js 中新增函数，或在 \`utils/handlers.js\` 中扩展公共行为。
- **接后端**：在 \`utils/handlers.js\` 的 \`onSubmit\` 等方法里调用 \`wx.request\`。

## 说明

本模板中的图片默认为渐变占位块。将数据结构中的 \`image\`、\`src\`、\`logo\`、\`avatar\`
字段替换为真实图片地址（\`https://...\`）即可自动渲染为真实图片。
`
}

/* ------------------------------------------------------------------ */
/* 主入口                                                              */
/* ------------------------------------------------------------------ */

export function generateCodeFiles(p: MpProject, tabIcons?: Set<string>): GenFile[] {
  const files: GenFile[] = []
  const hasTab = p.tabBar.enabled && p.tabBar.items.length > 0
  const pagePaths = p.pages.map((x) => x.path)
  const tabPaths = p.tabBar.enabled ? p.tabBar.items.map((i) => i.pagePath) : []

  files.push({ path: 'app.js', content: APP_JS })
  files.push({ path: 'app.wxss', content: APP_WXSS })
  files.push({
    path: 'app.json',
    content: JSON.stringify(
      {
        pages: pagePaths,
        window: {
          backgroundTextStyle: 'light',
          navigationBarBackgroundColor: p.pages[0]?.navBg || '#ffffff',
          navigationBarTitleText: p.name,
          navigationBarTextStyle: p.pages[0]?.navText || 'black',
          backgroundColor: p.theme.background,
        },
        tabBar: hasTab
          ? {
              color: p.tabBar.color,
              selectedColor: p.tabBar.selectedColor,
              backgroundColor: p.tabBar.background,
              borderStyle: p.tabBar.borderStyle,
              list: p.tabBar.items.map((it) => {
                const hasIcon = !tabIcons || tabIcons.has(it.icon)
                return {
                  pagePath: it.pagePath,
                  text: it.text,
                  ...(hasIcon
                    ? {
                        iconPath: `images/tabbar/${it.icon}.png`,
                        selectedIconPath: `images/tabbar/${it.icon}_on.png`,
                      }
                    : {}),
                }
              }),
            }
          : undefined,
        style: 'v2',
        sitemapLocation: 'sitemap.json',
      },
      null,
      2,
    ),
  })
  files.push({ path: 'sitemap.json', content: SITEMAP })
  files.push({ path: 'project.config.json', content: projectConfig(p) })
  files.push({ path: 'utils/theme.js', content: themeJs(p.theme) })
  files.push({ path: 'utils/handlers.js', content: HANDLERS_JS })
  files.push({ path: 'templates/render.wxml', content: RENDER_WXML })
  files.push({ path: 'templates/render.wxss', content: RENDER_WXSS })

  p.pages.forEach((pg) => {
    const nodes = compileNodes(pg.nodes)
    const dir = pg.path.replace(/^pages\//, 'pages/')
    files.push({ path: `${dir}.js`, content: pageJs(pg, nodes, tabPaths) })
    files.push({ path: `${dir}.wxml`, content: pageWxml() })
    files.push({ path: `${dir}.wxss`, content: pageWxss(pg.background) })
    files.push({ path: `${dir}.json`, content: pageJson(pg) })
  })

  files.push({ path: 'README.md', content: readme(p) })
  return files
}
