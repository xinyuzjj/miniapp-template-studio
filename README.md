<div align="center">

<img src="./docs/hero.svg" alt="小程序模板工坊" width="100%">

# 小程序模板工坊 · MiniApp Template Studio

**浏览器里可视化搭建，一键导出可直接运行的微信小程序完整源码。**

15 套行业模板 · 34 个业务组件 · 实时手机预览 · 零命令行部署

[![在线体验](https://img.shields.io/badge/在线体验-GitHub%20Pages-2563eb?style=for-the-badge&logo=github)](https://xinyuzjj.github.io/miniapp-template-studio/)
[![Deploy](https://github.com/xinyuzjj/miniapp-template-studio/actions/workflows/deploy.yml/badge.svg)](https://github.com/xinyuzjj/miniapp-template-studio/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[**→ 打开在线演示**](https://xinyuzjj.github.io/miniapp-template-studio/) · [功能特性](#-功能特性) · [快速开始](#-快速开始) · [一键部署](#-一键部署到微信开发者工具) · [架构说明](#-架构说明)

</div>

---

## 这是什么

一个纯前端的微信小程序**低代码生成器**。选一套行业模板 → 在画布上改文案改配色 → 点「导出代码」，拿到的是一份**结构完整、可直接导入微信开发者工具运行**的小程序工程（含 `app.json`、分页、WXSS 主题、事件处理、PNG 图标、`project.config.json`）。

不需要后端，不需要注册账号，不需要写一行代码。整个工具跑在浏览器里，导出用 JSZip 在本地打包，数据不出本机。

> 想直接看效果？**[点这里打开在线演示 →](https://xinyuzjj.github.io/miniapp-template-studio/)**

---

## ✨ 功能特性

### 1. 15 套行业模板，开箱即用

每套模板都是**多页面完整业务闭环**（首页 / 列表 / 详情 / 表单 / 我的），不是单页 Demo。

| 模板 | 行业 | 模板 | 行业 |
|---|---|---|---|
| 电商商城 | 电商零售 | 健身运动 | 运动健身 |
| 餐饮点餐 | 本地餐饮 | 家政服务 | 到家服务 |
| 美业预约 | 美业服务 | 二手交易 | 二手闲置 |
| 企业官网 | 企业服务 | 个人作品集 | 创意个人 |
| 教育培训 | 教育培训 | 汽车服务 | 汽车后市场 |
| 房产租房 | 房产家居 | 社区团购 | 社区生鲜 |
| 酒店民宿 | 酒旅住宿 | 效率工具 | 效率工具 |
| 医疗健康 | 医疗健康 | | |

### 2. 34 个业务组件，六大分组

不是「div / span」级别的原子组件，而是**开箱即用的业务模块**：

| 分组 | 组件 |
|---|---|
| **基础** | 自由容器、标题栏、文字、单图、**视频**、分割线、空白间距、页脚信息 |
| **导航** | 搜索栏、公告栏、轮播图、宫格导航、分类标签、**悬浮按钮** |
| **营销** | 优惠券、限时秒杀、活动横幅、倒计时 |
| **交易** | 商品列表、店铺信息、结算栏、价格套餐 |
| **内容** | 文章列表、用户评价、团队介绍、常见问题、流程步骤、数据统计、时间轴、**富文本** |
| **表单** | 预约表单、门店地图、联系方式、服务保障 |

每个组件的属性面板由 schema 自动生成 —— 新增组件只需在 `registry.ts` 里声明 `fields`，编辑器 UI 无需改动。

### 3. 可视化编辑器

<div align="center">
<img src="./docs/editor.svg" alt="可视化编辑器：左侧组件库与图层、中间手机预览、右侧属性面板" width="100%">
</div>

- **左侧**：组件库（支持搜索）、图层树、页面管理
- **中间**：等比手机预览，所见即所得，支持全屏禅模式
- **右侧**：属性面板（文本 / 数字 / 颜色 / 开关 / 下拉 / 图片 / 多行文本）+ 间距样式
- **页面管理**：新增、复制、排序、设为首页、tabBar 开关
- **编辑体验**：撤销/重做、跨页复制粘贴、创建副本、上移/下移
- **内置新手教程**：首页「新手教程」按钮、编辑器「教程」按钮，以及首次进入自动播放的 4 步高亮引导（组件库 → 画布 → 属性面板 → 导出），覆盖编辑器全景

**键盘快捷键**

| 快捷键 | 作用 | 快捷键 | 作用 |
|---|---|---|---|
| `Ctrl/⌘ + Z` | 撤销 | `Ctrl/⌘ + C` | 复制组件 |
| `Ctrl/⌘ + Shift + Z` | 重做 | `Ctrl/⌘ + V` | 粘贴组件 |
| `Ctrl/⌘ + Y` | 重做 | `Delete` / `Backspace` | 删除组件 |
| `Ctrl/⌘ + D` | 创建副本 | `↑` / `↓` | 上移 / 下移 |

### 4. 主题一键换肤

内置多套配色，改一个主色，所有组件（按钮、标签、价格、图标、tabBar 选中态）联动更新；导出时写进 WXSS 变量与 `app.json` 的 `window` 配置。

### 5. 导出即可运行的完整源码

点「导出代码」下载 zip，目录结构：

```
your-miniapp/
├── app.js / app.json / app.wxss      # 全局配置 + 主题变量
├── project.config.json               # 开发者工具工程配置
├── sitemap.json
├── templates/
│   └── render.wxml                   # 递归渲染模板（34 组件全覆盖）
├── utils/
│   ├── handlers.js                   # 统一事件处理（拨号、导航、加购、跳转、支付接入点…）
│   ├── store.js                      # 本地数据层（购物车 / 收藏持久化，零后端）
│   └── privacy.js                    # 隐私授权（微信平台强制要求）
├── pages/
│   ├── index/                        # 每页 wxml 仅 ~5 行，数据在 js 里
│   ├── list/
│   └── ...
└── assets/icons/                     # Canvas 生成的 PNG 图标 + tabBar 81×81
```

导出前会做一遍预编译：渐变色、特性列表拆行、标签拆分、星级数组、地图占位图等派生字段全部算好写进页面数据，**运行时不做任何字符串解析**。

### 6. 组件联动：点击任意组件跳转到目标页

在右侧属性面板「页面跳转」里，给任意组件选一个目标页面即可。导出后组件外层自动包一层 `<view class="mp-link" bindtap="onJump">`，运行时走 `utils/handlers.js` 的 `onJump`：

- 目标页是 **tabBar 页面** → 自动 `wx.switchTab`
- 目标页是 **普通页面** → 自动 `wx.navigateTo`，页面不存在时 `toast` 提示

编辑器顶部有「编辑 / 体验」切换：切到「体验」模式后，在手机预览里直接点击组件就能验证跳转，不用先导出。

### 7. 自定义组件模板：把组合存成可复用区块

搭好一组组件（比如一个促销卡片），在属性面板点「保存为可复用区块」，起个名字即可。区块存进浏览器本地（localStorage），出现在左侧「区块」标签页：

- **插入**：点区块上的「插入」把这套组合原样放回，自动生成新 id，不与原节点冲突
- **删除**：不再需要的区块一键移除

适合把高频复用的版式（头图 + 标题 + 按钮、商品三连卡等）沉淀下来，搭页面像搭积木。

### 8. 导出前自检：代码校验 + 预览截图

点顶栏「导出自检」打开弹窗，自动完成两件事：

- **代码校验（类 ESLint）**：生成完整小程序代码，用 `new Function` 做 JS 语法解析、JSON 解析，并校验页面 / tabBar / 跳转目标 / WXML 模板引用的一致性，错误与建议分色列出。
- **预览截图自检**：用 SVG `foreignObject` 把每个页面离线渲染成 PNG，无需第三方库、无跨域问题，可单张或打包下载对照审查。

任一项不通过都会明确提示，避免「导出后才发现页面打不开」。

### 9. 导出即可交互：所有按钮都能点

导出的小程序里，每个按钮 / 卡片都是**活的**，不是摆设：

- **已绑定跳转的组件**：点整张卡片即跳转到目标页（tabBar 页 `switchTab`，普通页 `navigateTo`）。
- **未绑定跳转的 CTA**：点击会给出示例反馈（`toast` 或弹窗），明确告诉你「这里该接什么」——比如「下单 / 支付需接入后端与微信支付」。
- **语义动作已分好类**：搜索、领取优惠券、立即购买 / 去结算（唤起支付接入提示）、拨号、导航、复制、表单提交等都有对应处理器，位于 `utils/handlers.js`，按业务改一处即可。

> 想让某个按钮真正跳转？在编辑器右侧属性面板「页面跳转」选目标页，导出后该组件（及内部按钮）点击即跳。

### 10. 本地数据层：购物车 / 收藏即点即存（零后端）

导出的小程序**默认带一套本地数据层**，不接任何后端也能跑出真实业务感：

- **点商品卡片即加入购物车**，写入 `wx.setStorageSync`，底部购物车 tab 的角标数量自动同步；收藏同理（`utils/store.js`）。
- 数据纯本地、零依赖、零费用；换手机 / 清缓存才会丢。要上云时把 `store.js` 里的 `addCart / getCart / toggleFav` 换成微信云开发或自有后端的调用即可，页面与组件无需改动。
- **隐私授权**已内置：`app.js` 启动即弹隐私协议授权（微信平台强制，不接会被审核打回），逻辑在 `utils/privacy.js`，你的隐私政策链接在微信公众平台配置。

### 11. 数据后端三档：本地缓存 / 微信云开发 / 自有接口

右侧「主题与页面 → 数据后端」三选一，导出包按选择生成对应运行时，**页面代码零改动**（统一数据层 `utils/store.js` 一个 `MODE` 常量切换）：

| 档位 | 数据存在哪 | 成本 | 适合 |
|---|---|---|---|
| **本地缓存**（默认） | 用户手机 `wx.setStorageSync` | 0 | 先看效果、内部演示、纯展示型 |
| **微信云开发** | 云数据库 + 云函数 | 低（免服务器，有免费额度） | 要真实落库、下单、留资 |
| **自有接口** | 你的 HTTPS 服务 | 高（需服务器 + 域名备案） | 已有后端、要完全掌控 |

选「微信云开发」时，导出包自带 `cloudfunctions/`：`login`（换 openid）、`order`（下单 + 订单列表）、`pay`（统一下单签名）、`form`（表单入库）、`cms`（内容增删改查），外加一份数据库集合 / 权限 / 部署说明。上传云函数即可真跑。

页面统一采用 **静态兜底 + 运行时覆盖**：先渲染打包好的 `NODES`（离线也有完整画面），`onLoad` 再拉真实数据覆盖，拉不到就静默沿用静态，不会白屏。

### 12. 订单与用户闭环（不再是"假下单"）

- **下单**：点「去结算」→ `store.createOrder` 落库 → 非本地模式调 `pay` 拿支付参数 → `wx.requestPayment` 拉起收银台；支付成功自动清空购物车与角标。
- **订单列表**：给任意组件绑 `catchtap="onOrders"` 即可查看最近订单（待支付 / 已支付 / 已完成 / 已关闭）。
- **用户归属**：启动即 `wx.login` 换 openid，订单、表单、埋点全部按 openid 归属，不会串号。
- **表单落库**：`onSubmit` 走 `store.submitForm` 真入库，不再只是弹个 toast；提交完引导订阅消息。

### 13. 产品化能力（可选开关）

- **带参分享**：分享链接自动带 `?from=openid`，便于归因裂变。
- **订阅消息**：配好模板 ID 后，表单提交完引导用户订阅。
- **埋点**：开关打开后自动上报 `page_view` / `search` / `form_submit` / `view_orders`（云开发写 `logs` 集合）。
- **搜索筛选**：顶部搜索框可直接输入，实时筛选当前页商品 / 文章，清空自动还原。
- **分包**：一键把非首页、非 tabBar 页放进 `sub/`，规避主包 2MB 限制（跳转路由自动带前缀，不用手改）。

---

## 📘 内置新手教程

点「使用模板」进入编辑器后，会自动播放一段 **4 步高亮引导**（组件库 → 手机画布 → 属性面板 → 一键导出），跟着走一遍就会用。

随时可点编辑器右上角 **「教程」** 或首页 **「新手教程」** 重新打开，里面有四张图文卡片：

- **上手三步**：选模板 → 改内容 → 换风格 → 导出
- **编辑器全景**：左 / 中 / 右三栏各自负责什么，附快捷键
- **零 AppID 部署**：为什么预览不需要 AppID、真机扫码怎么操作、哪里才必须填 AppID
- **常见问题**：图片不显示、检测不到工具、域名校验、接后端、数据隐私

---

## 🔓 零 AppID 也能跑

很多人卡在「没有 AppID 做不了小程序」。其实在本工具的设计里，**预览根本不需要 AppID**：

- **网页内预览**：在浏览器里搭建、缩放、点选组件，手机壳内实时出效果 —— 不装任何东西、不登录、不要 AppID。
- **开发者工具模拟器预览**：点「一键部署」下载的包默认 `appid` 是 `touristappid`（微信测试号），双击脚本打开项目，**不用填 AppID**，左侧模拟器直接出画面。
- **真机扫码预览（免 AppID）**：包里新增 `preview-qr.bat / .sh`，双击自动生成二维码并打开，手机微信扫码即看。唯一前提是你本人在开发者工具登录过个人微信（免费账号，不是 AppID）。
- **正式发布上线**：受微信平台规则所限，这一步必须用自己的小程序 AppID，无法零操作。最顺滑的做法是在编辑器右侧「主题与页面 → 发布设置」填好 AppID，再点「一键部署」后双击 `upload.bat` 即可。

> **一句话总结**：设计 + 预览全程零 AppID；真机扫码只需本人微信登录；只有发布才需要 AppID。

---

## 🚀 快速开始

> 需要 **Node.js 22+**（冒烟测试用的 jsdom 30 依赖较新的 undici）

```bash
# 克隆
git clone https://github.com/xinyuzjj/miniapp-template-studio.git
cd miniapp-template-studio

# 安装
npm install

# 启动编辑器（http://localhost:5173）
npm run dev
```

其它命令：

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建到 `dist/` |
| `npm run preview` | 预览生产构建 |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run smoke` | 冒烟测试：15 套模板全页渲染 + 34 组件渲染 + 代码生成 + 联动 / 区块 / 数据后端校验 |
| `npm run selfcheck` | 导出产物自检（类 ESLint + 结构一致性），15 套 × 4 种后端全绿才放行 |
| `npm run gen:sample` | 命令行直接生成一份样本小程序源码 |

---

## 📦 一键部署到微信开发者工具

浏览器不能直接启动本机程序，所以「一键部署」的交付物是一个**自带部署脚本的压缩包**：

1. 在编辑器点 **「一键部署」**，自动下载 zip
2. 解压到任意文件夹
3. 双击 **`deploy.bat`**（macOS 用 `deploy.sh`）

脚本会自动完成：

- 从 `Program Files` 和注册表多路径探测微信开发者工具 CLI
- 未安装时给出下载链接并友好退出
- 自动打开项目，登录后左侧即是真机预览入口

包内还有 `preview-qr.bat` / `.sh`（真机扫码免 AppID）、`upload.bat` / `.sh` 与 `DEPLOY.txt`（图文步骤 + 常见问题）。

> **关于 AppID**：本机与真机预览都不需要 AppID —— 导出包默认 `appid: touristappid`（微信测试号），双击 `deploy.bat` 即可模拟器预览，双击 `preview-qr.bat` 即可真机扫码。**只有上传 / 正式发布**才需要你自己的小程序 AppID：在微信公众平台注册后，替换 `project.config.json` 里的 `appid` 字段（或在编辑器「发布设置」里填好再导出）。

`样本输出/` 目录放了一份已生成的「电商商城」小程序源码，可以直接导入开发者工具看效果。

---

## 🏗 架构说明

> 想让模板从「静态 demo」变成「能上线的完整小程序」？见 **[完整小程序模板 · 架构方案](./docs/complete-template-architecture.md)**（数据持久化三档选型、运行时数据层、分阶段落地路线）。

### 三层 Schema 驱动双端渲染

<div align="center">
<img src="./docs/architecture.svg" alt="架构图：三层 Schema 驱动 Web 预览与小程序代码双端渲染" width="100%">
</div>

同一份 Schema 同时喂给两个渲染器，保证「预览所见」= 「导出所得」。

### 递归 WXML 模板：页面文件恒定 5 行

小程序没有 JSX，常规做法是给每个页面生成一大坨 WXML。这里换了个思路 —— 生成**一个**递归模板：

```xml
<!-- templates/render.wxml -->
<template name="mp-node">
  <view wx:if="{{node.type === 'title'}}">...</view>
  <view wx:elif="{{node.type === 'goods'}}">
    <block wx:for="{{node.children}}" wx:for-item="c">
      <template is="mp-node" data="{{node: c, T: T}}" />
    </block>
  </view>
  <!-- 34 个分支，支持任意深度嵌套 -->
</template>
```

于是每个页面的 WXML 只需要：

```xml
<import src="/templates/render.wxml" />
<view class="mp-page" style="background:{{T.pageBg}}">
  <block wx:for="{{NODES}}" wx:for-item="node">
    <template is="mp-node" data="{{node, T}}" />
  </block>
</view>
```

页面 JS 里只有一份 `NODES` 数据。新增组件只改 `render.wxml` 一处，所有页面自动生效。

### 图标：SVG path → Canvas → PNG

小程序 tabBar 只吃 PNG。项目内置 SVG path 表，Web 端直接渲染 SVG；导出时用 Canvas 把用到的图标绘制成 PNG（`p_` 主色 / `s_` 次色 / `w_` 白色三种变体，tabBar 额外出 81×81），只打包实际用到的图标。

### 技术栈

`Vite 5` · `React 18` · `TypeScript 5` · `Tailwind CSS 3` · `zustand 4` · `JSZip` · `lucide-react`

### 目录结构

```
src/
├── core/
│   ├── registry.ts      # 34 个组件定义（含属性面板 schema）
│   ├── icons.ts         # SVG path 图标表
│   ├── palette.ts       # 主题配色
│   └── style.ts         # 样式工具
├── render/
│   ├── NodeRenderer.tsx # Web 端组件渲染（switch by type）
│   └── primitives.tsx   # Icon / 渐变占位等原子件
├── export/
│   ├── mpgen.ts         # 代码生成主流程 + 预编译
│   ├── cloud.ts         # 数据后端：app.js / store.js / 云函数包生成
│   ├── wxml.ts          # 递归 WXML 模板 + WXSS（含 mp-link 跳转包裹）
│   ├── icons.ts         # Canvas 出图
│   ├── deploy.ts        # 部署脚本生成
│   ├── selfcheck.ts     # 导出产物校验（类 ESLint + 结构一致性）
│   ├── domCapture.ts    # 页面离线截图（SVG foreignObject → PNG）
│   └── zip.ts           # 打包下载
├── templates/
│   ├── defs.ts / defsB.ts  # 15 套模板定义
│   └── kit.ts              # 模板搭建辅助函数
├── store/useApp.ts      # zustand：历史记录 / 剪贴板 / 页面操作
└── ui/                  # 编辑器界面（含 SelfCheckModal.tsx 导出自检弹窗）
```

---

## 🧪 质量保障

`npm run smoke` 在 jsdom 里真实挂载 React 树，逐项校验：

- 15 套模板的全部页面能正常渲染，无 `未知组件`
- `REGISTRY` 里 34 个组件类型逐个渲染
- 生成的页面 JS 中不含 `undefined`
- 编辑器面板、store 操作、本地持久化路径可用
- 组件联动（跳转目标写入 `link`、导出 `onJump` / `mp-link` / `tabPages`）、tabBar 用 `switchTab`
- 自定义区块（保存 / 插入 / 删除）、导出自检（正常项目通过、非法跳转目标被捕获）
- 数据后端三档：云函数包与云初始化、接口根地址注入、分包路由与依赖层级、订单 / 表单 / 埋点 / 分享 / 搜索接缝

CI（GitHub Actions）在每次 push 时跑 `typecheck` → `smoke` → `selfcheck` → `build`，全绿才发布到 Pages。

---

## 💳 如何接入支付 / 后端

本工具生成的是**前端骨架**，业务逻辑（下单、支付、搜索、表单落库）需要你自己的服务端。所有交互入口都集中在 `utils/handlers.js`，按下面三步接即可。

**① 微信支付（必须走后端，无法纯前端完成）**

```
前端点击「立即购买 / 去结算」→ handlers.js 的 onPay() 先弹出接入说明
   ↓ 你实现后改成：
wx.request({ url: 'https://你的域名/api/order', method: 'POST', data: 购物车,
  success: (res) => {
    // res.data 来自你的服务端调用微信「统一下单」接口
    wx.requestPayment({
      timeStamp: res.data.timeStamp,
      nonceStr: res.data.nonceStr,
      package: res.data.package,      // 形如 "prepay_id=xxx"
      signType: 'MD5',
      paySign: res.data.paySign,
      success() { wx.showToast({ title: '支付成功' }) },
      fail() { wx.showToast({ title: '已取消' }) },
    })
  }
})
```

前置条件（都在微信公众平台 / 微信支付商户平台配置，与本工具无关）：

- 小程序 **AppID** + 微信支付 **商户号（mch_id）** + **API 密钥 / APIv3 密钥**
- 服务端用商户号调微信「统一下单 / JSAPI」拿到 `prepay_id`，再按规则签名返回前端
- 正式支付需**已认证的小程序 + 微信支付资质**；测试阶段可先用 `onPay()` 的弹窗占位

**② 表单 / 搜索 / 其他接口**

`handlers.js` 里 `onSubmit` 已 `setData` 收集好 `this.data.form`（每个字段 `form.f0 / f1 …`）。接后端只需在 `onSubmit` 里 `wx.request` 把 `this.data.form` POST 出去；`onTap` 里 `action === 'search'` 分支同理改成请求你的搜索接口。

**③ 商品 / 文章内容**

模板里的商品、文章、价格都是**静态示例数据**（在 `src/templates` 里）。要动态，把 `utils/handlers.js` 的 `onLoad` 改成 `wx.request` 拉你的列表接口，再 `setData({ nodes: ... })` 覆盖默认 `NODES` 即可。

> 总结：本工具负责「页面 + 交互骨架 + 跳转」，你负责「数据 + 支付 + 业务逻辑」。两者在 `handlers.js` 一处接缝，不耦合。

---

## 🗺 Roadmap

- [x] 组件联动与页面跳转配置（属性面板里选目标页）
- [x] 自定义组件模板（用户保存自己的组合为可复用区块）
- [x] 导出产物的 ESLint / 预览截图自检
- [x] 导出即交互：所有按钮可点（跳转 / 示例反馈 / 支付接入点）
- [x] 支付 / 后端接入方法论（handlers.js 一处接缝）
- [x] 本地数据层：购物车 / 收藏即点即存（utils/store.js，零后端）
- [x] 隐私授权内置（utils/privacy.js，微信审核必备）
- [x] 数据后端三档：本地缓存 / 微信云开发（含 5 个云函数）/ 自有接口
- [x] 订单与用户闭环：下单 → 支付 → 订单列表，openid 归属，表单真入库
- [x] 产品化：带参分享 / 订阅消息 / 埋点 / 搜索筛选 / 分包
- [x] 静态兜底 + 运行时覆盖：无后端也能看，接了后端自动变活
- [ ] 云端草稿同步（编辑器项目当前存浏览器本地）

---

## 📄 License

[MIT](./LICENSE)

---

<div align="center">

**[→ 立即在线体验](https://xinyuzjj.github.io/miniapp-template-studio/)**

觉得有用的话，给个 ⭐️ 呗

</div>
