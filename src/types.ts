/**
 * 小程序可视化搭建 —— 核心数据模型
 *
 * Project  >  Page[]  >  Node[]
 * Node 是一棵可递归的组件树，同一份 schema 同时驱动：
 *   1) Web 端实时预览（React 递归渲染）
 *   2) 小程序代码导出（WXML 递归 template 渲染）
 */

export interface NodeStyle {
  marginTop?: number
  marginBottom?: number
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  background?: string
  radius?: number
  borderWidth?: number
  borderColor?: string
  shadow?: 0 | 1 | 2
  fullBleed?: boolean // 忽略左右内边距，通栏显示
}

export interface MpNode {
  id: string
  type: string
  label?: string
  props: Record<string, any>
  style: NodeStyle
  children?: MpNode[]
  /** 点击跳转：跳转到目标页面路径（pages/xxx/index）。留空表示不跳转 */
  link?: { to: string }
}

export interface TabBarItem {
  pagePath: string
  text: string
  icon: string
}

export interface TabBar {
  enabled: boolean
  color: string
  selectedColor: string
  background: string
  borderStyle: 'black' | 'white'
  items: TabBarItem[]
}

export interface MpPage {
  id: string
  name: string // 页面中文名（编辑器用）
  path: string // pages/home/index
  navTitle: string // 小程序导航栏标题
  navBg: string
  navText: 'black' | 'white'
  background: string
  nodes: MpNode[]
}

/**
 * 数据后端配置：决定导出包里「数据从哪来、往哪存」
 * - local：纯本地缓存（wx.setStorageSync），零后端、零成本（默认）
 * - cloud：微信云开发（wx.cloud.init + 云函数 login/order/pay/form）
 * - api  ：自有后端（wx.request 打到你的 HTTPS 接口）
 */
export interface Backend {
  mode: 'local' | 'cloud' | 'api'
  /** 云开发环境 ID（mode=cloud 时必填） */
  envId?: string
  /** 自有接口根地址（mode=api 时必填），如 https://api.example.com */
  apiBase?: string
  /** 订阅消息模板 ID，逗号分隔（微信公众平台申请） */
  tmplIds?: string
  /** 是否把非首页 / 非 tabBar 页面放进分包（规避主包 2MB 限制） */
  subpackage?: boolean
  /** 是否开启埋点上报（local 模式仅打日志） */
  track?: boolean
}

export interface Theme {
  primary: string
  primaryLight: string
  secondary: string
  accent: string
  text: string
  subText: string
  background: string
  cardBg: string
  radius: number
  fontTitle: number
  fontBody: number
}

export interface MpProject {
  id: string
  name: string
  appid: string
  description: string
  templateId: string
  theme: Theme
  tabBar: TabBar
  pages: MpPage[]
  /** 数据后端（可选，默认 local 本地缓存，不填即保持纯前端） */
  backend?: Backend
}

/* ------------------------------------------------------------------ */
/* 属性面板描述                                                          */
/* ------------------------------------------------------------------ */

export type PropField =
  | { key: string; label: string; type: 'text'; placeholder?: string }
  | { key: string; label: string; type: 'textarea'; placeholder?: string }
  | { key: string; label: string; type: 'number'; min?: number; max?: number; step?: number; suffix?: string }
  | { key: string; label: string; type: 'switch' }
  | { key: string; label: string; type: 'color' }
  | { key: string; label: string; type: 'select'; options: { label: string; value: string }[] }
  | { key: string; label: string; type: 'image'; mode?: 'single' }
  | { key: string; label: string; type: 'imageList' }
  | { key: string; label: string; type: 'list'; itemLabel: string; fields: PropField[]; defaultItem: Record<string, any> }

export interface ComponentDef {
  type: string
  name: string
  group: string
  icon: string
  desc: string
  /** 是否允许嵌套子节点 */
  container?: boolean
  defaultProps: Record<string, any>
  defaultStyle?: Partial<NodeStyle>
  fields: PropField[]
  /** 创建时默认的子节点 */
  defaultChildren?: () => MpNode[]
}

export interface TemplateDef {
  id: string
  name: string
  industry: string
  desc: string
  cover: string
  tags: string[]
  build: () => Omit<MpProject, 'id'>
}
