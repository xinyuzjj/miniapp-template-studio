import type { Backend, MpNode, MpProject, NodeStyle, Theme } from '../types'
import { paletteAt } from '../core/palette'
import { RENDER_WXML, RENDER_WXSS } from './wxml'
import { appJs, storeJs, cloudFiles } from './cloud'

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



/* 隐私授权：首次进入引导阅读隐私政策（微信平台强制要求，否则审核不过） */
const PRIVACY_JS = `function ensurePrivacy(cb) {
  cb = cb || function () {}
  if (!wx.requirePrivacyAuthorize) { cb(); return }
  wx.requirePrivacyAuthorize({
    success: function () { cb() },
    fail: function () { cb() },
  })
}
module.exports = { ensurePrivacy: ensurePrivacy }
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

  /** 表单提交：真落库（cloud → form 云函数 / api → POST /api/form / local → 本地留档） */
  onSubmit: function () {
    var store = null
    try { store = require('./store.js') } catch (e) {}
    if (!store) { wx.showToast({ title: '提交成功', icon: 'success' }); return }
    var form = (this.data && this.data.form) || {}
    if (!Object.keys(form).length) { wx.showToast({ title: '请先填写内容', icon: 'none' }); return }
    var self = this
    wx.showLoading({ title: '提交中' })
    store.submitForm(form, function (err) {
      wx.hideLoading()
      if (err) { wx.showToast({ title: '提交失败，请重试', icon: 'none' }); return }
      wx.showToast({ title: '提交成功', icon: 'success' })
      self.setData({ form: {} })
      // 提交后引导订阅消息（未配置模板 ID 时静默跳过）
      store.subscribe(function () {})
      store.track('form_submit', { page: self.route })
    })
  },

  /** 引导订阅消息：组件上绑 catchtap="onSubscribe" 即可使用，需先在公众平台申请模板 ID */
  onSubscribe: function () {
    var store = null
    try { store = require('./store.js') } catch (e) {}
    if (!store) { wx.showToast({ title: '数据层缺失', icon: 'none' }); return }
    store.subscribe(function (err) {
      if (err) wx.showToast({ title: '未配置订阅消息模板 ID', icon: 'none' })
      else wx.showToast({ title: '订阅成功', icon: 'success' })
    })
  },

  /** 我的订单：组件上绑 catchtap="onOrders" 即可查看（local 读本地，cloud / api 查后端） */
  onOrders: function () {
    var store = null
    try { store = require('./store.js') } catch (e) {}
    if (!store) { wx.showToast({ title: '数据层缺失', icon: 'none' }); return }
    wx.showLoading({ title: '加载中' })
    store.getOrders(function (err, list) {
      wx.hideLoading()
      if (err || !list || !list.length) { wx.showToast({ title: '暂无订单', icon: 'none' }); return }
      var STATUS = { unpaid: '待支付', paid: '已支付', done: '已完成', closed: '已关闭' }
      var text = list.slice(0, 5).map(function (o) {
        var d = new Date(o.createdAt || Date.now())
        var day = (d.getMonth() + 1) + '/' + d.getDate()
        return day + '  ¥' + (((o.amount || 0) / 100).toFixed(2)) + '  ' + (STATUS[o.status] || '待支付') + '\\n' + (o.orderNo || '')
      }).join('\\n')
      wx.showModal({ title: '最近 ' + Math.min(list.length, 5) + ' 笔订单', content: text, showCancel: false })
      store.track('view_orders', { count: list.length })
    })
  },

  /** 搜索：顶部搜索框输入即筛选当前页的商品 / 文章（清空关键词自动还原） */
  onSearchInput: function (e) {
    this.setData({ kw: e.detail.value })
    if (!e.detail.value) this._mpFilter('')
  },

  onSearch: function (e) {
    this._mpFilter((e && e.detail && e.detail.value) || this.data.kw || '')
  },

  _mpFilter: function (kw) {
    kw = String(kw || '').trim()
    var self = this
    if (!kw) {
      if (this.data._rawNodes) this.setData({ nodes: this.data._rawNodes })
      return
    }
    if (!this.data._rawNodes) this.setData({ _rawNodes: this.data.nodes })
    var raw = this.data._rawNodes || this.data.nodes
    var lower = kw.toLowerCase()
    var hit = function (s) { return String(s === undefined || s === null ? '' : s).toLowerCase().indexOf(lower) >= 0 }
    var LISTS = ['items', 'list']
    var clone = []
    try { clone = JSON.parse(JSON.stringify(raw)) } catch (e) { clone = raw }
    var matched = 0
    clone.forEach(function (n) {
      if (!n.props) return
      LISTS.forEach(function (k) {
        if (!Array.isArray(n.props[k])) return
        n.props[k] = n.props[k].filter(function (it) {
          return hit(it.name) || hit(it.title) || hit(it.desc) || hit(it.text) || hit(it.tag)
        })
        matched += n.props[k].length
      })
    })
    this.setData({ nodes: clone })
    wx.showToast({ title: matched ? '找到 ' + matched + ' 条' : '没有匹配结果', icon: 'none' })
    try { require('./store.js').track('search', { kw: kw, hits: matched }) } catch (e) {}
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

  /** 通用点击：有目标页则跳转，否则按语义给出示例反馈（可在此接入后端 / 支付 / 本地缓存） */
  onTap: function (e) {
    var d = e.currentTarget.dataset
    if (d.page) { this._mpJump(d.page); return }
    var action = d.action
    if (action === 'search') { wx.showToast({ title: '搜索需接入后端接口', icon: 'none' }); return }
    if (action === 'claim') { wx.showToast({ title: '已领取（示例）', icon: 'success' }); return }
    if (action === 'fav') {
      try {
        var fid = d.id || d.tip || 'item'
        var fav = require('./store.js').toggleFav(fid)
        wx.showToast({ title: fav.indexOf(fid) >= 0 ? '已收藏' : '已取消收藏', icon: 'none' })
      } catch (err) { wx.showToast({ title: '收藏失败', icon: 'none' }) }
      return
    }
    if (action === 'buy') {
      try {
        var store = require('./store.js')
        var item = { id: d.id || ('g_' + Date.now()), name: d.name || '商品', price: Number(d.price) || 0, img: d.img || '' }
        store.addCart(item)
        store.syncBadge((this.data && this.data.cartIndex) || 0)
        wx.showToast({ title: '已加入购物车', icon: 'success' })
      } catch (err) { wx.showToast({ title: '加入失败', icon: 'none' }) }
      return
    }
    if (action === 'checkout') { this.onPay(e); return }
    wx.showToast({ title: d.tip || '示例按钮 · 在编辑器为组件绑定跳转后即可跳转', icon: 'none' })
  },

  /** 同步购物车角标（tabBar 上购物车页的红点数量，来自本地缓存） */
  syncCartBadge: function () {
    var idx = (this.data && this.data.cartIndex) || 0
    try { require('./store.js').syncBadge(idx) } catch (e) {}
  },

  /**
   * 下单 + 支付闭环
   *  1) store.createOrder 落库拿订单号（local 存本地 / cloud 走 order 云函数 / api 走接口）
   *  2) 非 local 模式调 pay 拿支付参数 → wx.requestPayment 拉起收银台
   *     后端未配商户号时会明确弹窗提示，不静默失败
   */
  onPay: function () {
    var store = null
    try { store = require('./store.js') } catch (e) {}
    if (!store) { wx.showToast({ title: '数据层缺失', icon: 'none' }); return }
    var self = this
    var cart = store.getCart()
    if (!cart.length) {
      wx.showModal({ title: '购物车是空的', content: '先点商品卡片加入购物车，再来结算。', showCancel: false })
      return
    }
    wx.showLoading({ title: '下单中' })
    store.createOrder({ items: cart }, function (err, res) {
      wx.hideLoading()
      if (err || !res || !res.ok) {
        wx.showModal({
          title: '下单失败',
          content: (err && err.message) || (res && res.msg) || '请检查网络或后端配置',
          showCancel: false,
        })
        return
      }
      if (store.MODE !== 'local') {
        store.call('pay', { orderNo: res.orderNo, amount: res.amount }, function (perr, pres) {
          if (perr || !pres || !pres.ok || !pres.payParams) {
            wx.showModal({
              title: '支付未就绪',
              content: (pres && pres.msg) || '请在后端配置商户号后再发起支付',
              showCancel: false,
            })
            return
          }
          var params = pres.payParams
          params.success = function () {
            wx.showToast({ title: '支付成功', icon: 'success' })
            store.clearCart()
            if (self.syncCartBadge) self.syncCartBadge()
          }
          params.fail = function () { wx.showToast({ title: '已取消支付', icon: 'none' }) }
          wx.requestPayment(params)
        })
        return
      }
      // local 模式：订单已落本地，给出接入指引
      wx.showModal({
        title: '订单已生成（本地）',
        content: '订单号 ' + res.orderNo + '，金额 ¥' + (((res.amount || 0) / 100).toFixed(2)) +
          '。当前是本地缓存模式未接入支付；把数据后端换成「微信云开发 / 自有接口」重新导出即可打通真实收款。',
        showCancel: false,
      })
      store.track('order_local', { orderNo: res.orderNo })
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

function pageJs(
  page: { path: string; navTitle: string },
  nodes: any[],
  tabPaths: string[],
  cartIndex: number,
  up: string,
  route: string,
): string {
  const data = JSON.stringify(nodes, null, 2).split('\n').join('\n  ')
  const tabData = JSON.stringify(tabPaths)
  return `// ${page.path}.js
const T = require('${up}utils/theme.js')
const H = require('${up}utils/handlers.js')

const NODES = ${data}

Page(Object.assign({}, H, {
  data: {
    T: T,
    nodes: NODES,
    form: {},
    tabPages: ${tabData},
    cartIndex: ${cartIndex}
  },
  onLoad: function () {
    wx.setNavigationBarTitle({ title: ${JSON.stringify(page.navTitle)} })
    var self = this
    // 静态兜底：先用打包好的 NODES 渲染，再由数据层拉真实数据覆盖
    // （local 模式不拉取，保证离线也能看；cloud / api 模式会自动变活）
    try {
      require('${up}utils/store.js').fetchPage(this.route, function (err, nodes) {
        if (!err && nodes && nodes.length) self.setData({ nodes: nodes })
      })
    } catch (e) {}
    try { require('${up}utils/store.js').track('page_view', { route: self.route }) } catch (e) {}
  },
  onShow: function () {
    // 同步购物车角标：每次进入页面都从本地缓存刷新角标数量
    if (this.syncCartBadge) this.syncCartBadge()
  },
  onShareAppMessage: function () {
    // 带参分享：把用户标识带出去，别人点开即可归因（local 模式为本地匿名 ID）
    var uid = ''
    try { uid = getApp().globalData.openid || '' } catch (e) {}
    return { title: ${JSON.stringify(page.navTitle)}, path: '/${route}' + (uid ? '?from=' + uid : '') }
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
      // 云开发模式才声明云函数根目录，否则会让开发者工具多一个空目录
      cloudfunctionRoot: p.backend?.mode === 'cloud' ? 'cloudfunctions/' : undefined,
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
utils/handlers.js               页面公共交互（表单、导航、拨号、加购、跳转等）
utils/store.js                  统一数据层（购物车 / 收藏 / 订单 / 表单 / 埋点）
utils/privacy.js                隐私授权（微信平台强制要求，否则审核不过）
${p.backend?.mode === 'cloud' ? 'cloudfunctions/               云函数：login / order / pay / form / cms\ncloudfunctions/README.md       数据库集合、权限与部署步骤' : ''}
${p.backend?.subpackage ? 'sub/pages/                     分包页面（主包只留首页与 tabBar 页）' : ''}
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

## 数据后端：${p.backend?.mode === 'cloud' ? '微信云开发' : p.backend?.mode === 'api' ? '自有接口' : '本地缓存'}

${p.backend?.mode === 'cloud' ? [
  '- 环境 ID：\`' + (p.backend.envId || '（未填写，请回到编辑器补齐）') + '\`',
  '- **首次运行三步**：① 开发者工具顶部「云开发」开通 → ② 把环境 ID 填回编辑器重新导出 → ③ 右键 \`cloudfunctions/\` 下每个目录选「上传并部署：云端安装依赖」',
  '- 数据库集合 / 权限 / 索引见 \`cloudfunctions/README.md\`，照着建即可',
  '- 登录（openid）、下单、支付签名、表单入库、内容管理（cms）**已全部打通**，页面代码零改动',
].join('\n')
  : p.backend?.mode === 'api' ? [
  '- 接口根地址：\`' + (p.backend.apiBase || '（未填写，请回到编辑器补齐）') + '\`',
  '- 需提供 5 个接口，统一返回 \`{ ok: true, data: ... }\`：\`POST /api/login\`、\`/api/order\`、\`/api/form\`、\`/api/page\`、\`/api/track\`',
  '- 记得在微信公众平台把接口域名加进 **request 合法域名**（开发期可勾「不校验合法域名」）',
].join('\n')
  : [
  '- 购物车 / 收藏 / 订单 / 表单全部存在用户手机本地（\`wx.setStorageSync\`），**零后端、零费用**，导入即可跑通完整交互',
  '- 换设备或清缓存会丢；想跨设备 / 真实收款，改 \`utils/store.js\` 顶部的 \`MODE\` 一行（\`cloud\` 或 \`api\`），或回到编辑器切换「数据后端」重新导出',
].join('\n')}
${p.backend?.subpackage ? '\n> 已开启**分包**：主包只保留首页与 tabBar 页，其余页面在 \`sub/\`，可规避主包 2MB 限制。' : ''}

## 运行期数据：静态兜底 + 云端覆盖

页面先渲染打包好的静态 \`NODES\`（离线也有完整画面），\`onLoad\` 再调 \`store.fetchPage()\` 拉真实数据覆盖。
${p.backend?.mode === 'local' ? '本地模式不拉取，保持静态。' : '有数据即自动变活，拉不到就静默沿用静态兜底，不会白屏。'}

## 隐私授权（已内置）

\`app.js\` 启动即调用 \`utils/privacy.js\` 的 \`ensurePrivacy()\`，按微信要求弹出隐私协议授权
（不接会被审核打回）。隐私政策链接在「微信公众平台 → 设置 → 服务内容 → 用户隐私指引」配置。

## 如何接入支付（必须走服务端）

微信支付**必须**由你的服务端发起：① 前端下单 → ② 服务端调微信「统一下单」拿 \`prepay_id\`
→ ③ 服务端用 \`nonceStr / timeStamp / signType / paySign\` 二次签名回传 → ④ 前端 \`wx.requestPayment\`。
纯前端无法完成，任何模板都绕不过。

${p.backend?.mode === 'cloud' ? '**本包已按云开发搭好**：在 \`cloudfunctions/pay/index.js\` 顶部填好 \`MCHID / MCHKEY / APPID / NOTIFY_URL\`（推荐配成云函数环境变量，别进代码库），点「去结算」即可拉起真实收银台。未配置时前端会**明确弹窗提示**，不会静默失败。' : ''}
${p.backend?.mode === 'api' ? '**本包前端已接好**：点「去结算」会依次请求 \`/api/order\` 下单、\`pay\` 取支付参数，再由前端 \`wx.requestPayment\`。你只需在服务端实现这两个接口并做签名。' : ''}
${p.backend?.mode === 'local' ? '**当前是本地模式**：点「去结算」会生成一张本地订单并弹出接入指引。把数据后端切成「微信云开发 / 自有接口」重新导出，即可拿到含支付签名的完整链路。' : ''}

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
  const be = p.backend as Backend | undefined
  const mode: Backend['mode'] = be?.mode ?? 'local'
  const hasTab = p.tabBar.enabled && p.tabBar.items.length > 0
  const pagePaths = p.pages.map((x) => x.path)
  const tabPaths = p.tabBar.enabled ? p.tabBar.items.map((i) => i.pagePath) : []
  // 购物车页在 tabBar 中的位置（用于同步角标），找不到则为 -1
  const cartIndex = p.tabBar.enabled
    ? p.tabBar.items.findIndex((it) => /cart|购物|购/.test(it.pagePath + '|' + it.text))
    : -1

  /* 分包（可选）：主包只保留首页与 tabBar 页，其余页面进 sub/，规避主包 2MB 限制 */
  const mainSet = new Set<string>([pagePaths[0], ...tabPaths])
  const subPaths = be?.subpackage ? pagePaths.filter((x) => !mainSet.has(x)) : []
  const subSet = new Set(subPaths)
  const routeOf = (path: string) => (subSet.has(path) ? `sub/${path}` : path)
  const dirOf = (path: string) => (subSet.has(path) ? `sub/${path}` : path)
  const upOf = (path: string) => (subSet.has(path) ? '../../../' : '../../')
  // 跳转目标若落在分包，路由要带上分包前缀
  const remapLinks = (nodes: any[]) => {
    nodes.forEach((n: any) => {
      if (n._link && subSet.has(n._link)) n._link = routeOf(n._link)
      if (n.children) remapLinks(n.children)
    })
  }

  files.push({ path: 'app.js', content: appJs(be) })
  files.push({ path: 'app.wxss', content: APP_WXSS })
  files.push({
    path: 'app.json',
    content: JSON.stringify(
      {
        pages: pagePaths.filter((x) => !subSet.has(x)),
        ...(subPaths.length ? { subpackages: [{ root: 'sub', name: 'sub', pages: subPaths }] } : {}),
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
  files.push({ path: 'utils/store.js', content: storeJs(be) })
  files.push({ path: 'utils/privacy.js', content: PRIVACY_JS })
  files.push({ path: 'templates/render.wxml', content: RENDER_WXML })
  files.push({ path: 'templates/render.wxss', content: RENDER_WXSS })

  // 云开发模式：附带云函数包（login / order / pay / form / cms）
  if (mode === 'cloud') {
    for (const f of cloudFiles()) files.push(f)
  }

  p.pages.forEach((pg) => {
    const nodes = compileNodes(pg.nodes)
    remapLinks(nodes)
    const dir = dirOf(pg.path)
    const up = upOf(pg.path)
    const route = routeOf(pg.path)
    files.push({ path: `${dir}.js`, content: pageJs(pg, nodes, tabPaths, cartIndex, up, route) })
    files.push({ path: `${dir}.wxml`, content: pageWxml() })
    files.push({ path: `${dir}.wxss`, content: pageWxss(pg.background) })
    files.push({ path: `${dir}.json`, content: pageJson(pg) })
  })

  files.push({ path: 'README.md', content: readme(p) })
  return files
}
