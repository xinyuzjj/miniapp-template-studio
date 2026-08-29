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
