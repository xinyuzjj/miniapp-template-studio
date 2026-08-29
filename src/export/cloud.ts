/**
 * 数据后端相关代码生成
 *
 * 三种模式共用一套「统一数据层」store.js，靠 MODE 常量切换：
 *   local —— wx.setStorageSync 本地缓存（默认，零后端）
 *   cloud —— 微信云开发（wx.cloud.database + 云函数）
 *   api   —— 自有后端（wx.request 打 HTTPS 接口）
 *
 * 页面/组件只调 store 的方法，不直接碰 wx.*，因此换后端时页面代码零改动。
 */
import type { Backend } from '../types'
import type { GenFile } from './mpgen'

function b(b2?: Backend) {
  return {
    mode: b2?.mode ?? 'local',
    envId: b2?.envId ?? '',
    apiBase: b2?.apiBase ?? '',
    tmplIds: b2?.tmplIds ?? '',
    subpackage: !!b2?.subpackage,
    track: !!b2?.track,
  }
}

/* ------------------------------------------------------------------ */
/* app.js                                                              */
/* ------------------------------------------------------------------ */

export function appJs(backend?: Backend): string {
  const o = b(backend)
  return `var MODE = ${JSON.stringify(o.mode)}
var ENV_ID = ${JSON.stringify(o.envId)}
var API_BASE = ${JSON.stringify(o.apiBase)}

App({
  globalData: {
    mode: MODE,
    openid: '',
    user: null
  },

  onLaunch: function () {
    // 隐私授权（微信强制要求，不接会被审核打回）
    try { require('./utils/privacy.js').ensurePrivacy() } catch (e) {}

    // 云开发初始化（仅 cloud 模式）
    if (MODE === 'cloud' && wx.cloud) {
      try { wx.cloud.init({ env: ENV_ID, traceUser: true }) } catch (e) {}
    }
    this.login()
  },

  /**
   * 登录：wx.login 拿 code → 换 openid
   *   cloud 模式：调云函数 login
   *   api   模式：POST {API_BASE}/api/login
   *   local 模式：只写本地匿名标识，不联网
   */
  login: function () {
    var self = this
    if (MODE === 'local') {
      var uid = ''
      try { uid = wx.getStorageSync('mp_uid_v1') } catch (e) {}
      if (!uid) {
        uid = 'u_' + Date.now() + Math.floor(Math.random() * 10000)
        try { wx.setStorageSync('mp_uid_v1', uid) } catch (e) {}
      }
      self.globalData.openid = uid
      return
    }
    wx.login({
      success: function (r) {
        var code = r && r.code
        if (!code) return
        if (MODE === 'cloud' && wx.cloud && wx.cloud.callFunction) {
          wx.cloud.callFunction({
            name: 'login',
            data: { code: code },
            success: function (res) {
              var d = res && res.result
              if (d && d.openid) {
                self.globalData.openid = d.openid
                self.globalData.user = d.user || null
                try { require('./utils/store.js').track('login', {}) } catch (e) {}
              }
            },
            fail: function () {}
          })
        } else if (MODE === 'api' && API_BASE) {
          wx.request({
            url: API_BASE + '/api/login',
            method: 'POST',
            data: { code: code },
            success: function (res) {
              var d = res && res.data && res.data.data
              if (d && d.openid) {
                self.globalData.openid = d.openid
                self.globalData.user = d.user || null
              }
            },
            fail: function () {}
          })
        }
      },
      fail: function () {}
    })
  }
})
`
}

/* ------------------------------------------------------------------ */
/* utils/store.js —— 统一数据层                                         */
/* ------------------------------------------------------------------ */

export function storeJs(backend?: Backend): string {
  const o = b(backend)
  const tmplIds = o.tmplIds
    .split(/[,，\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
  return `/**
 * 统一数据层 —— 页面与组件只跟这里打交道，不直接碰 wx.*
 *
 * 当前模式：${o.mode}${o.mode === 'cloud' ? '（云环境 ID：' + (o.envId || '未填写') + '）' : ''}${o.mode === 'api' ? '（接口根地址：' + (o.apiBase || '未填写') + '）' : ''}
 * 想换后端？改下面 MODE 一行即可，页面代码零改动：
 *   local  本地缓存 wx.setStorageSync  零后端零成本，换设备即丢
 *   cloud  微信云开发 wx.cloud.database 免服务器，需填 ENV_ID 并上传 cloudfunctions/
 *   api    自有后端 wx.request         需填 API_BASE 并配 request 合法域名
 */
var MODE = ${JSON.stringify(o.mode)}
var ENV_ID = ${JSON.stringify(o.envId)}
var API_BASE = ${JSON.stringify(o.apiBase)}
var TRACK = ${o.track ? 'true' : 'false'}
var TMPL_IDS = ${JSON.stringify(tmplIds)}

var CART_KEY = 'mp_cart_v1'
var FAV_KEY = 'mp_fav_v1'
var ORDER_KEY = 'mp_order_v1'
var FORM_KEY = 'mp_form_v1'

function read(k, d) { try { var v = wx.getStorageSync(k); return v || d } catch (e) { return d } }
function write(k, v) { try { wx.setStorageSync(k, v) } catch (e) {} }
function noop() {}
function done(cb, err, data) { if (cb) cb(err || null, data) }

/* ---------------- 云开发 ---------------- */
function db() {
  try { return (wx.cloud && wx.cloud.database) ? wx.cloud.database() : null } catch (e) { return null }
}
function call(name, data, cb) {
  if (MODE !== 'cloud' || !wx.cloud || !wx.cloud.callFunction) { done(cb, new Error('not-cloud-mode')); return }
  wx.cloud.callFunction({
    name: name,
    data: data || {},
    success: function (r) { done(cb, null, r && r.result) },
    fail: function (e) { done(cb, e) }
  })
}

/* ---------------- 自有接口 ---------------- */
function request(path, data, cb) {
  if (MODE !== 'api' || !API_BASE) { done(cb, new Error('not-api-mode')); return }
  wx.request({
    url: API_BASE + path,
    method: 'POST',
    data: data || {},
    success: function (r) {
      var d = r && r.data
      if (d && d.ok === false) done(cb, new Error(d.msg || 'api-error'))
      else done(cb, null, d && d.data)
    },
    fail: function (e) { done(cb, e) }
  })
}

/* ---------------- 购物车 ---------------- */
function getCart() { return read(CART_KEY, []) }
function addCart(item) {
  var list = getCart()
  var hit = null
  list.forEach(function (x) { if (x.id === item.id) hit = x })
  if (hit) hit.qty = (hit.qty || 1) + 1
  else list.push({ id: item.id, name: item.name, price: item.price, img: item.img, qty: 1 })
  write(CART_KEY, list)
  return list
}
function removeCart(id) { var l = getCart().filter(function (x) { return x.id !== id }); write(CART_KEY, l); return l }
function clearCart() { write(CART_KEY, []); return [] }
function cartCount() { return getCart().reduce(function (s, x) { return s + (x.qty || 1) }, 0) }

function syncBadge(index) {
  var n = cartCount()
  try { if (n > 0) wx.setTabBarBadge({ index: index, text: String(n) }); else wx.removeTabBarBadge({ index: index }) } catch (e) {}
}

/* ---------------- 收藏 ---------------- */
function getFav() { return read(FAV_KEY, []) }
function toggleFav(id) {
  var l = getFav()
  if (l.indexOf(id) >= 0) l = l.filter(function (x) { return x !== id })
  else l.push(id)
  write(FAV_KEY, l)
  return l
}
function hasFav(id) { return getFav().indexOf(id) >= 0 }

/* ---------------- 订单 ---------------- */
/** 订单列表：local 读本地缓存，cloud / api 查后端（结果按创建时间倒序） */
function getOrders(cb) {
  if (MODE === 'cloud') {
    call('order', { action: 'list' }, function (err, res) { done(cb, err, res && res.list) })
    return
  }
  if (MODE === 'api') { request('/api/orders', {}, function (err, list) { done(cb, err, list) }); return }
  done(cb, null, read(ORDER_KEY, []))
}
function createOrder(order, cb) {
  order = order || {}
  if (!order.items || !order.items.length) order.items = getCart()
  if (MODE === 'cloud') { call('order', { items: order.items, remark: order.remark || '' }, cb); return }
  if (MODE === 'api') { request('/api/order', { items: order.items, remark: order.remark || '' }, cb); return }
  // local：本地生成订单，状态 unpaid（支付需接后端）
  var list = getOrders()
  var od = {
    orderNo: 'OD' + Date.now() + Math.floor(Math.random() * 1000),
    items: order.items,
    // 金额统一用「分」，避免浮点误差；展示时 /100
    amount: Math.round(order.items.reduce(function (s, x) { return s + (Number(x.price) || 0) * (Number(x.qty) || 1) }, 0) * 100),
    status: 'unpaid',
    createdAt: Date.now()
  }
  list.unshift(od)
  write(ORDER_KEY, list)
  done(cb, null, { ok: true, orderNo: od.orderNo, amount: od.amount, local: true })
}

/* ---------------- 表单落库 ---------------- */
function submitForm(form, cb) {
  var payload = { form: form || {}, page: '' }
  try { payload.page = getCurrentPages()[getCurrentPages().length - 1].route } catch (e) {}
  if (MODE === 'cloud') { call('form', payload, cb); return }
  if (MODE === 'api') { request('/api/form', payload, cb); return }
  var list = read(FORM_KEY, [])
  list.unshift({ form: payload.form, page: payload.page, createdAt: Date.now() })
  write(FORM_KEY, list.slice(0, 50))
  done(cb, null, { ok: true, local: true })
}

/* ---------------- 页面数据：静态兜底 + 运行时覆盖 ---------------- */
/**
 * local 模式直接回调空（页面继续用打包好的静态 NODES，离线也有东西看）；
 * cloud / api 模式会去拉真实数据，拉到就 setData 覆盖。
 */
function fetchPage(route, cb) {
  if (MODE === 'cloud') {
    var d = db()
    if (!d) { done(cb, new Error('no-cloud')); return }
    d.collection('pages').where({ route: route }).limit(1).get({
      success: function (r) { done(cb, null, r && r.data && r.data[0] && r.data[0].nodes) },
      fail: function (e) { done(cb, e) }
    })
    return
  }
  if (MODE === 'api') { request('/api/page', { route: route }, cb); return }
  done(cb, null, null)
}

/* ---------------- 订阅消息 ---------------- */
function subscribe(cb) {
  if (!TMPL_IDS.length || !wx.requestSubscribeMessage) { done(cb, new Error('no-tmpl')); return }
  wx.requestSubscribeMessage({
    tmplIds: TMPL_IDS,
    success: function (r) { done(cb, null, r) },
    fail: function (e) { done(cb, e) }
  })
}

/* ---------------- 埋点 ---------------- */
function track(event, data) {
  if (!TRACK) return
  var payload = { event: event, data: data || {}, ts: Date.now() }
  if (MODE === 'cloud') {
    var d = db()
    if (d) { try { d.collection('logs').add({ data: payload }) } catch (e) {} }
    return
  }
  if (MODE === 'api') { request('/api/track', payload, noop); return }
  if (typeof console !== 'undefined' && console.log) console.log('[track]', event, payload.data)
}

/* ---------------- 通用 KV ---------------- */
function kvGet(k, d) { return read(k, d) }
function kvSet(k, v) { write(k, v) }

module.exports = {
  MODE: MODE, ENV_ID: ENV_ID, API_BASE: API_BASE,
  getCart: getCart, addCart: addCart, removeCart: removeCart, clearCart: clearCart,
  cartCount: cartCount, syncBadge: syncBadge,
  getFav: getFav, toggleFav: toggleFav, hasFav: hasFav,
  getOrders: getOrders, createOrder: createOrder,
  submitForm: submitForm, fetchPage: fetchPage,
  subscribe: subscribe, track: track,
  kvGet: kvGet, kvSet: kvSet,
  db: db, call: call, request: request
}
`
}

/* ------------------------------------------------------------------ */
/* 云函数                                                              */
/* ------------------------------------------------------------------ */

const CF_PKG = (name: string) =>
  JSON.stringify(
    {
      name,
      version: '1.0.0',
      description: `${name} 云函数（由小程序模板工坊生成）`,
      main: 'index.js',
      dependencies: { 'wx-server-sdk': '~2.6.3' },
      license: 'MIT',
    },
    null,
    2,
  )

const CF_LOGIN = `const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

/**
 * 登录：用 wx.login 的 code 换 openid，并在 users 集合建档 / 更新登录时间。
 * 前端：wx.cloud.callFunction({ name: 'login', data: { code } })
 */
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  if (!openid) return { ok: false, msg: '未获取到 OPENID' }

  const db = cloud.database()
  const col = db.collection('users')
  const now = Date.now()

  try {
    const exist = await col.where({ _openid: openid }).limit(1).get()
    if (exist.data && exist.data.length) {
      const id = exist.data[0]._id
      await col.doc(id).update({ data: { lastLogin: now } })
      return { ok: true, openid, user: exist.data[0] }
    }
    const user = { _openid: openid, nick: '', avatar: '', phone: '', createdAt: now, lastLogin: now }
    const r = await col.add({ data: user })
    return { ok: true, openid, user: Object.assign({ _id: r._id }, user) }
  } catch (e) {
    return { ok: false, msg: e.message }
  }
}
`

const CF_ORDER = `const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

/**
 * 下单：把购物车落库到 orders 集合，返回订单号与金额（单位：分）
 * 前端：wx.cloud.callFunction({ name: 'order', data: { items, remark } })
 */
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const items = Array.isArray(event.items) ? event.items : []
  const action = event.action || 'create'

  // 查自己的订单列表（按时间倒序，最多 20 条）
  if (action === 'list') {
    try {
      const r = await db.collection('orders')
        .where({ _openid: OPENID })
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get()
      return { ok: true, list: r.data }
    } catch (e) {
      return { ok: false, msg: e.message }
    }
  }

  if (!items.length) return { ok: false, msg: '购物车为空' }

  // 金额统一用「分」，避免浮点误差
  const amount = Math.round(items.reduce((s, x) => s + (Number(x.price) || 0) * (Number(x.qty) || 1), 0) * 100)
  const order = {
    _openid: OPENID,
    orderNo: 'OD' + Date.now() + Math.floor(Math.random() * 1000),
    items,
    amount,
    remark: event.remark || '',
    status: 'unpaid', // unpaid 待支付 / paid 已支付 / done 已完成 / closed 已关闭
    createdAt: Date.now()
  }

  try {
    const r = await db.collection('orders').add({ data: order })
    return { ok: true, id: r._id, orderNo: order.orderNo, amount }
  } catch (e) {
    return { ok: false, msg: e.message }
  }
}
`

const CF_PAY = `const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const https = require('https')
const crypto = require('crypto')

/**
 * 支付：微信支付【必须】走服务端，纯前端无法完成。
 *
 * 上线前请填好下面 4 个配置（云函数环境变量或这里硬编码），再放开 unifiedorder 调用：
 *   MCHID      微信支付商户号
 *   MCHKEY     商户 API 密钥（微信支付商户平台设置）
 *   APPID      小程序 AppID
 *   NOTIFY_URL 支付结果回调地址（需公网可访问）
 *
 * 流程：前端下单(order 云函数) → 本函数调微信「统一下单」拿 prepay_id
 *     → 二次签名返回 timeStamp/nonceStr/package/signType/paySign
 *     → 前端 wx.requestPayment(...) 拉起收银台
 *
 * 未配置商户号时本函数返回 ok:false 并给出提示，前端会弹出说明，不会静默失败。
 */
const MCHID = process.env.MCHID || ''
const MCHKEY = process.env.MCHKEY || ''
const APPID = process.env.APPID || ''
const NOTIFY_URL = process.env.NOTIFY_URL || ''

function md5(str) {
  return crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase()
}
function sign(params, key) {
  const s = Object.keys(params)
    .filter((k) => k !== 'sign' && params[k] !== '' && params[k] !== undefined)
    .sort()
    .map((k) => k + '=' + params[k])
    .join('&')
  return md5(s + '&key=' + key)
}
function toXml(obj) {
  return '<xml>' + Object.keys(obj).map((k) => '<' + k + '><![CDATA[' + obj[k] + ']]></' + k + '>').join('') + '</xml>'
}
function postXml(url, xml) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'POST', headers: { 'Content-Type': 'text/xml' } }, (res) => {
      let buf = ''
      res.on('data', (c) => { buf += c })
      res.on('end', () => resolve(buf))
    })
    req.on('error', reject)
    req.write(xml)
    req.end()
  })
}
function pick(xml, key) {
  const m = xml.match(new RegExp('<' + key + '><!\\\\[CDATA\\\\[([^\\\\]]*)\\\\]\\\\]></' + key + '>'))
  return m ? m[1] : ''
}

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const orderNo = event.orderNo
  const amount = Number(event.amount) || 0 // 单位：分

  if (!MCHID || !MCHKEY || !APPID) {
    return {
      ok: false,
      msg: '尚未配置商户号 / API 密钥 / AppID，无法发起真实支付。请在 cloudfunctions/pay/index.js 顶部填写 MCHID / MCHKEY / APPID / NOTIFY_URL。'
    }
  }
  if (amount <= 0) return { ok: false, msg: '金额不合法' }

  const params = {
    appid: APPID,
    mch_id: MCHID,
    nonce_str: md5(String(Date.now()) + Math.random()),
    body: event.body || '订单 ' + orderNo,
    out_trade_no: orderNo,
    total_fee: amount,
    spbill_create_ip: '127.0.0.1',
    notify_url: NOTIFY_URL,
    trade_type: 'JSAPI',
    openid: OPENID
  }
  params.sign = sign(params, MCHKEY)

  try {
    const xml = await postXml('https://api.mch.weixin.qq.com/pay/unifiedorder', toXml(params))
    if (pick(xml, 'return_code') !== 'SUCCESS' || pick(xml, 'result_code') !== 'SUCCESS') {
      return { ok: false, msg: pick(xml, 'err_code_des') || pick(xml, 'return_msg') || '统一下单失败' }
    }
    const prepayId = pick(xml, 'prepay_id')
    const timeStamp = String(Math.floor(Date.now() / 1000))
    const nonceStr = params.nonce_str
    const payParams = {
      appId: APPID,
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: 'prepay_id=' + prepayId,
      signType: 'MD5'
    }
    payParams.paySign = sign(payParams, MCHKEY)
    return { ok: true, orderNo, payParams }
  } catch (e) {
    return { ok: false, msg: e.message }
  }
}
`

const CF_FORM = `const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

/**
 * 表单落库：预约 / 报名 / 联系表单写进 forms 集合
 * 前端：wx.cloud.callFunction({ name: 'form', data: { form, page } })
 */
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const form = event.form || {}

  if (!Object.keys(form).length) return { ok: false, msg: '表单内容为空' }

  try {
    const r = await db.collection('forms').add({
      data: { _openid: OPENID, form, page: event.page || '', createdAt: Date.now(), handled: false }
    })
    return { ok: true, id: r._id }
  } catch (e) {
    return { ok: false, msg: e.message }
  }
}
`

const CF_CMS = `const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

/**
 * 简易 CMS：给你的管理端 / 开发者工具「云开发控制台」调用，做内容增删改查。
 * 生产环境请加管理员鉴权（例如校验 OPENID 是否在 admins 集合里）。
 *
 * 用法：wx.cloud.callFunction({ name: 'cms', data: { action, collection, id, doc } })
 *   action     list | add | update | remove
 *   collection goods | articles | pages | banners（白名单，防止随意读写）
 */
const ALLOW = ['goods', 'articles', 'pages', 'banners']

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const db = cloud.database()
  const col = event.collection
  const action = event.action || 'list'

  if (ALLOW.indexOf(col) < 0) return { ok: false, msg: '集合不在白名单内：' + col }

  try {
    if (action === 'list') {
      const r = await db.collection(col).orderBy('sort', 'asc').limit(50).get()
      return { ok: true, list: r.data }
    }
    if (action === 'add') {
      const now = Date.now()
      const r = await db.collection(col).add({
        data: Object.assign({ sort: 0, createdAt: now, updatedAt: now, _editor: OPENID }, event.doc || {})
      })
      return { ok: true, id: r._id }
    }
    if (action === 'update') {
      if (!event.id) return { ok: false, msg: '缺少 id' }
      await db.collection(col).doc(event.id).update({
        data: Object.assign({ updatedAt: Date.now(), _editor: OPENID }, event.doc || {})
      })
      return { ok: true }
    }
    if (action === 'remove') {
      if (!event.id) return { ok: false, msg: '缺少 id' }
      await db.collection(col).doc(event.id).remove()
      return { ok: true }
    }
    return { ok: false, msg: '未知操作：' + action }
  } catch (e) {
    return { ok: false, msg: e.message }
  }
}
`

const CF_README = `# 云开发后端说明（cloud 模式）

本目录是微信云开发的**云函数包**。只有在选择「数据后端 = 微信云开发」导出时才会生成。

## 一、开通与部署（10 分钟）

1. 微信开发者工具 → 顶部「云开发」→ 开通（有免费额度，个人可用）
2. 记下**环境 ID**（形如 \`cloud1-8gxxxx\`），填回编辑器的「云环境 ID」再导出
3. 右键每个云函数目录 → **「上传并部署：云端安装依赖」**（首次约 30 秒）
4. 云开发控制台 → 数据库 → 新建集合（见下表）

> 云函数**不计入小程序 2MB 包体积**。

## 二、数据库集合

| 集合 | 用途 | 建议权限 | 索引 |
|---|---|---|---|
| \`users\` | 用户（openid / 昵称 / 头像 / 手机） | 仅创建者可读写 | \`_openid\` |
| \`orders\` | 订单（orderNo / items / amount / status） | 仅创建者可读写 | \`_openid\`、\`orderNo\` |
| \`forms\` | 表单留资（form / page / handled） | 仅创建者可读写 | \`_openid\`、\`createdAt\` |
| \`goods\` | 商品（CMS 维护，可选） | 所有用户可读、仅管理端可写 | \`sort\` |
| \`articles\` | 文章（CMS 维护，可选） | 所有用户可读、仅管理端可写 | \`sort\` |
| \`pages\` | 页面级动态数据（可选，覆盖静态 NODES） | 所有用户可读、仅管理端可写 | \`route\` |
| \`banners\` | 轮播 / 活动位（可选） | 所有用户可读、仅管理端可写 | \`sort\` |
| \`logs\` | 埋点日志（开启埋点时） | 仅管理端可写 | \`ts\` |

**权限设置**：云开发控制台 → 数据库 → 集合 → 「权限设置」→ 选「自定义安全规则」或上述预设。
生产环境不要把 \`orders\` / \`forms\` 设成「所有用户可读」，会泄露他人数据。

## 三、云函数一览

| 函数 | 作用 | 前端调用 |
|---|---|---|
| \`login\` | \`wx.login\` 的 code 换 openid，自动建档 | \`wx.cloud.callFunction({ name:'login', data:{ code } })\` |
| \`order\` | 下单落库，返回 \`orderNo\` / \`amount\`（分） | \`utils/store.js\` 的 \`createOrder()\` |
| \`pay\` | 调微信「统一下单」返回支付参数 | \`utils/store.js\` 的 \`onPay\` 流程 |
| \`form\` | 表单留资入库 | \`utils/store.js\` 的 \`submitForm()\` |
| \`cms\` | 内容增删改查（给管理端用） | \`wx.cloud.callFunction({ name:'cms', data:{ action, collection, id, doc } })\` |

## 四、支付：必须自己填商户号

\`pay/index.js\` **默认返回 ok:false 并给出提示**（不会静默失败）。要真实收款：

1. 微信支付商户平台拿到 **商户号（MCHID）** 与 **API 密钥（MCHKEY）**
2. 小程序已认证 + 开通微信支付
3. 在 \`pay/index.js\` 顶部填 \`MCHID / MCHKEY / APPID / NOTIFY_URL\`，
   或配置成云函数环境变量（推荐，不进代码库）
4. 配好 \`NOTIFY_URL\` 回调接口，在回调里把订单状态改成 \`paid\`

> 纯前端**无法**完成微信支付，这是平台规则，任何模板都绕不过。

## 五、改回本地 / 换自有接口

改 \`utils/store.js\` 顶部的 \`MODE\` 一行即可：\`local\` / \`cloud\` / \`api\`。
页面代码不用动 —— 这就是统一数据层的好处。
`

const CF_MAIN_PKG = JSON.stringify(
  { name: 'cloudfunctions', private: true, description: '微信云开发云函数目录（由小程序模板工坊生成）' },
  null,
  2,
)

/** 生成云函数包文件（仅 mode=cloud 时调用） */
export function cloudFiles(): GenFile[] {
  const fns: [string, string][] = [
    ['login', CF_LOGIN],
    ['order', CF_ORDER],
    ['pay', CF_PAY],
    ['form', CF_FORM],
    ['cms', CF_CMS],
  ]
  const files: GenFile[] = [{ path: 'cloudfunctions/package.json', content: CF_MAIN_PKG }]
  for (const [name, code] of fns) {
    files.push({ path: `cloudfunctions/${name}/index.js`, content: code })
    files.push({ path: `cloudfunctions/${name}/package.json`, content: CF_PKG(name) })
  }
  files.push({ path: 'cloudfunctions/README.md', content: CF_README })
  return files
}

/* ------------------------------------------------------------------ */
/* project.config.json 需要声明云函数根目录                              */
/* ------------------------------------------------------------------ */

export const CLOUD_ROOT_NOTE = 'cloudfunctions'
