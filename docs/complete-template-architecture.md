# 完整小程序模板 · 架构方案

> 目标：让「小程序模板工坊」导出的不再是「前端骨架 + 写死示例数据」，而是**导入开发者工具即可真跑起来、有数据、能下单、能留痕**的完整小程序。
> 本文是架构方案（不写业务代码），用于对齐方向。落地分 P0–P3 推进。

---

## 0. 现状与定位

当前生成器产出：

- **编辑器（studio）**：项目存浏览器 `localStorage`，关掉再开还在。
- **导出的小程序**：数据在生成时写死进 `NODES`（页面 JS 里的静态数组），运行时**零持久化**——加购、填表、登录刷新/重开即丢；表单提交只是 `toast` 一下，`this.data.form` 当场丢弃。

结论：现在是「漂亮的前端骨架 + 静态示例」，缺一条**运行时数据脊梁**。本文解决这条脊梁怎么搭、生成器要补什么、分几步做。

---

## 1. 数据持久化三档选型

| 档位 | 机制 | 成本 | 跨设备/用户 | 适用 |
|---|---|---|---|---|
| **L0 本地缓存** | `wx.setStorageSync` | 0（每设备 10MB） | ❌ 不跨用户、清缓存即丢 | 购物车、收藏、表单草稿、用户偏好 |
| **L1 微信云开发** | `wx.cloud.database()` + 云函数 | 低（免服务器，有免费额度） | ✅ | **模板默认推荐**：商品/文章/订单/用户真实落库 |
| **L2 自有后端** | `wx.request` → 你的 HTTPS 接口 | 高（需服务器+域名备案+合法域名） | ✅ | 已有后端、要完全掌控逻辑时 |

**推荐默认路径**：L0 打底（立刻可用、零依赖）+ L1 作为「数据后端」可选项（导出时勾选即注入云初始化与云函数示例）。L2 作为 escape hatch，沿用已有的 `handlers.js` 接缝。

---

## 2. 目标运行时架构

```
┌─────────────────────────────────────────────┐
│ 微信开发者工具 / 真机                          │
├─────────────────────────────────────────────┤
│ app.js                                        │
│  ├─ 云环境初始化 wx.cloud.init(env)            │
│  ├─ onLaunch: wx.login → code → 云函数换openid │
│  └─ 全局 store（user / cart / 配置）           │
├─────────────────────────────────────────────┤
│ 每个页面 Page(Object.assign({}, H, {...}))     │
│  ├─ data: { T, nodes: NODES(静态兜底), ... }   │
│  ├─ onLoad: 先渲染静态 → store.fetch() 拉真实  │
│  │           数据 → setData({ nodes }) 覆盖    │
│  └─ 事件: onTap / onSubmit / onPay ... (H)     │
├─────────────────────────────────────────────┤
│ utils/store.js  统一数据层（本地缓存 + 云库）   │
│ utils/handlers.js 交互（已有，扩 onSubmit/onPay)│
├─────────────────────────────────────────────┤
│ 后端（可选）                                   │
│  ├─ 云开发: 云函数 order / pay / form          │
│  └─ 自有: HTTPS 接口（request 合法域名）        │
└─────────────────────────────────────────────┘
```

### 2.1 统一数据层 `utils/store.js`（新增，生成器产出）

封装两层，页面/组件不直接碰 `wx.*`：

```js
// 伪代码形态，落地时由生成器按所选后端产出对应实现
const KEY = 'mp_cart_v1'

function getCart() {
  return wx.getStorageSync(KEY) || []
}
function addCart(item) {
  const list = getCart()
  const i = list.find(x => x.id === item.id)
  if (i) i.qty += 1; else list.push({ ...item, qty: 1 })
  wx.setStorageSync(KEY, list)
  // 同步 tabBar 角标
  const n = list.reduce((s, x) => s + x.qty, 0)
  if (typeof wx.setTabBarBadge === 'function') {
    n ? wx.setTabBarBadge({ index: 2, text: String(n) }) : wx.removeTabBarBadge({ index: 2 })
  }
  return list
}
// 云库版本（选 L1 时）：
// function fetchGoods() { return cloud.database().collection('goods').get() }
```

关键点：**本地缓存先顶上，保证离线/无后端也有基本能力**；选了云开发再把 `fetch/submit` 换成云库调用，页面代码不变。

### 2.2 页面数据「静态兜底 + 运行时覆盖」

当前页面只有 `NODES`。改为：

```js
onLoad: function () {
  wx.setNavigationBarTitle({ title: '...' })
  var self = this
  // 1) 先渲染静态（离线有东西看）
  // 2) 再尝试拉真实数据覆盖
  store.fetchPage(this.route).then(function (data) {
    if (data && data.nodes) self.setData({ nodes: data.nodes })
  }).catch(function () {})
}
```

这样**没有后端时模板照样能看**（静态示例），有后端时自动变活。

### 2.3 全局用户态 `app.js`

```js
App({
  globalData: { openid: '', env: '你的云环境ID' },
  onLaunch() {
    if (wx.cloud) wx.cloud.init({ env: this.globalData.env, traceUser: true })
    wx.login({ success: (r) => {
      // 调云函数 login，用 code 换 openid，存 globalData + 本地
    }})
  }
})
```

---

## 3. 生成器（studio）要补的能力

让编辑器产出上面的运行时，而不是只产出静态页。

1. **「数据后端」开关**：右侧「发布设置」新增
   - `本地缓存`（默认，零依赖）
   - `微信云开发`（填云环境 ID，导出注入云初始化 + 云函数示例包）
   - `自有接口`（填 base URL，导出 `wx.request` 接缝）
2. **页面/组件级数据源**：列表类组件（商品/文章/价格/购物车）可选
   - `静态`（默认，当前行为）
   - `云集合 goods` / `接口 /api/goods`
   生成时据此在 `onLoad` 注入对应 `store.fetch`。
3. **导出「云开发 starter」包**（选 L1 时）：
   - `cloudfunctions/init`（login 换 openid）
   - `cloudfunctions/order`（下单落库）
   - `cloudfunctions/pay`（统一下单签名，呼应已有 `onPay`）
   - `cloudfunctions/form`（表单入库）
   - `database/` 集合权限与索引说明
4. **隐私合规**：生成 `app.json` 的 `requiredPrivateInfos` + 一个隐私授权弹窗组件（调用 `wx.requirePrivacyAuthorize`），否则 2023 起审核不过。
5. **购物车体感**：导出时若页面含 `cartBar`，自动注入 `store` 角标同步逻辑。

---

## 4. 「完整」必做清单（缺一则只是 demo）

| 项 | 说明 | 档位 |
|---|---|---|
| 数据层/状态 | 商品/文章/订单/用户来自云库或接口，非写死 NODES | L1/L2 |
| 用户与登录 | `wx.login` 拿 openid、授权（手机号/头像）、个人中心数据 | L1/L2 |
| 购物车 + 订单 | 真实加购、订单列表，与支付闭环打通 | L0+L1 |
| 表单落库 | 预约/联系提交到云库或接口，不再只 toast | L1/L2 |
| 隐私合规 | 隐私授权弹窗 + 隐私保护指引声明 | 必须 |

## 5. 进阶清单（做了才像成熟产品）

CMS/内容后台（非技术改文案）· 订阅消息/模板消息 · 分享带参裂变 · 搜索与筛选联动 · 数据埋点 · 分包加载与体积优化。

---

## 6. 分阶段落地路线

**P0 — 零后端就能用（纯前端，立刻可见效）**
- 新增 `utils/store.js`（本地缓存封装）
- 购物车/收藏持久化 + tabBar 角标同步
- 隐私授权弹窗组件 + `app.json` 合规字段
- 生成器：「本地缓存」为默认，导出即带 `store.js`

**P1 — 云开发 starter（让模板"真有数据"）**
- `app.js` 云初始化 + `wx.login` 换 openid
- 页面 `onLoad`「静态兜底 + 运行时覆盖」
- 导出云函数包 `init/order/pay/form` + 数据库说明
- 生成器：「微信云开发」选项 + 云环境 ID 输入

**P2 — 用户与订单闭环**
- 个人中心数据归属用户（openid）
- 订单列表查询、订单状态
- 表单真正入库（接 P1 的 form 云函数）

**P3 — 产品化**
- CMS 后台、订阅消息、分享裂变、搜索筛选、埋点、分包

---

## 7. 对现有 15 套模板的适配优先级

- **先接数据**：`goods`（商品列表）、`article`（文章）、`priceCard`（套餐）、`cartBar`（结算）、`form`（表单）——这些是"活"起来的关键。
- **个人中心类页**（我的）：P2 接用户态。
- **营销类**（coupon/seckill/banner）：P1 后由数据驱动，目前保持静态示例即可。

---

## 8. 风险与注意

- `wx.request` 必须配 **request 合法域名**（开发可勾「不校验合法域名」）。
- 云环境 ID 是占位，需用户填自己的；导出包里用注释明确标出。
- 隐私保护指引需在微信公众平台配置，否则审核被拒。
- 包体积：云函数不计入小程序包，但静态图标/图片需控制；必要时走分包。
- 生成器改动较大（新增数据源概念 + 导出分支），建议 P0 先做纯前端持久化，验证 `store.js` 模式后再扩到 L1。

---

## 9. 落地状态（P0–P3 已全部完成）

| 阶段 | 内容 | 状态 | 落地位置 |
|---|---|---|---|
| **P0** | 本地数据层 `utils/store.js`；购物车 / 收藏持久化 + tabBar 角标同步；隐私授权 + 合规字段 | ✅ v1.2.0 | `src/export/cloud.ts`（storeJs / PRIVACY_JS）、`mpgen.ts` |
| **P1** | 云开发 starter：云初始化 + `wx.login` 换 openid；静态兜底 + 运行时覆盖；云函数 `login/order/pay/form/cms` + 数据库说明；生成器「数据后端」选项 | ✅ v1.3.0 | `src/export/cloud.ts`（appJs / cloudFiles）、`src/types.ts`（Backend）、`RightPanel.tsx` |
| **P2** | 用户与订单闭环：openid 归属、订单列表与状态、表单真入库、下单→支付→清购物车 | ✅ v1.3.0 | `cloud.ts`（createOrder / getOrders / submitForm）、`mpgen.ts`（onPay / onOrders / onSubmit） |
| **P3** | 产品化：带参分享、订阅消息、埋点、搜索筛选、分包 | ✅ v1.3.0 | `mpgen.ts`（onShareAppMessage / onSubscribe / onSearch + `_mpFilter` / 分包布局）、`wxml.ts`（搜索框改可输入） |

**未做（有意保留）**：

- **CMS 后台页面** —— 后台是独立系统（需登录鉴权、多用户、权限），塞进小程序模板会拖垮体积与复杂度。
  折中方案：提供 `cms` 云函数 + 云开发控制台直接改数据，够用且零额外部署。
- **搜索走后端** —— 当前是本地静态筛选（`_mpFilter`），对模板规模的静态数据已足够；接后端时可直接在 `onSearch` 里换成 `store.request`。

**关键取舍**：三档后端共用**一个** `utils/store.js`，靠 `MODE` 常量分支（local / cloud / api）。
页面与组件只调 `store.*`，不直接碰 `wx.*` —— 所以换后端时页面代码零改动，这也是本次能一次做完整 P0–P3 的前提。
