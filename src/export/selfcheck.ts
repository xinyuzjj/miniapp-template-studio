import type { MpProject } from '../types'
import { generateCodeFiles, collectIcons } from './mpgen'

export type CheckLevel = 'error' | 'warn' | 'ok'

export interface CheckItem {
  level: CheckLevel
  scope: string
  message: string
}

export interface SelfCheckResult {
  ok: boolean
  items: CheckItem[]
  fileCount: number
  pageCount: number
}

/**
 * 导出产物的「ESLint / 一致性」自检：
 *  - 生成完整小程序代码
 *  - 用 new Function 做 JS 语法解析（不执行），类 ESLint 语法校验
 *  - JSON 解析校验
 *  - 页面 / tabBar / 页面跳转目标 / WXML 模板引用 等结构性一致性校验
 */
export function runSelfCheck(p: MpProject): SelfCheckResult {
  const items: CheckItem[] = []
  const push = (level: CheckLevel, scope: string, message: string) => items.push({ level, scope, message })

  const tabIcons = new Set<string>()
  if (p.tabBar.enabled) p.tabBar.items.forEach((i) => tabIcons.add(i.icon))
  const files = generateCodeFiles(p, tabIcons)
  const byPath = new Map<string, string>()
  for (const f of files) byPath.set(f.path, typeof f.content === 'string' ? f.content : '')

  let jsCount = 0
  let jsonCount = 0
  for (const f of files) {
    const content = typeof f.content === 'string' ? f.content : ''
    if (f.path.endsWith('.js')) {
      jsCount++
      try {
        // 仅做语法解析，不执行（等同 ESLint 的 parse 阶段）
        // eslint-disable-next-line no-new-func
        new Function('require', 'module', 'exports', 'Page', 'wx', 'App', 'getApp', content)
      } catch (e) {
        push('error', f.path, 'JS 语法错误：' + (e as Error).message)
      }
    } else if (f.path.endsWith('.json')) {
      jsonCount++
      try {
        JSON.parse(content)
      } catch (e) {
        push('error', f.path, 'JSON 解析失败：' + (e as Error).message)
      }
    }
  }

  let appJson: any = null
  try {
    appJson = JSON.parse(byPath.get('app.json') || '{}')
  } catch {
    /* 已在上面作为错误上报 */
  }
  const pageSet = new Set<string>(appJson?.pages ?? [])
  for (const pg of p.pages) {
    for (const ext of ['js', 'wxml', 'wxss', 'json']) {
      if (!byPath.has(pg.path + '.' + ext)) push('error', pg.path, `缺少 ${ext} 文件`)
    }
  }

  if (p.tabBar.enabled) {
    for (const it of p.tabBar.items) {
      if (!pageSet.has(it.pagePath)) push('error', 'tabBar', `指向不存在的页面：${it.pagePath}`)
      if (!tabIcons.has(it.icon)) push('warn', 'tabBar', `图标 ${it.icon} 未生成 PNG 资源`)
    }
  }

  const linkPaths = new Set<string>()
  const walk = (nodes: any[]) =>
    nodes.forEach((n) => {
      if (n.link?.to) linkPaths.add(n.link.to)
      if (n.children) walk(n.children)
    })
  p.pages.forEach((pg) => walk(pg.nodes))
  linkPaths.forEach((to) => {
    if (!pageSet.has(to)) push('error', '页面跳转', `跳转目标不存在：${to}`)
  })

  p.pages.forEach((pg) => {
    const w = byPath.get(pg.path + '.wxml')
    if (w && !w.includes('import src="/templates/render.wxml"')) push('error', pg.path + '.wxml', '未引入渲染模板')
  })

  const errors = items.filter((i) => i.level === 'error').length
  const warns = items.filter((i) => i.level === 'warn').length
  if (errors === 0)
    push(
      'ok',
      '总览',
      `代码自检通过：共 ${files.length} 个文件（JS ${jsCount} · JSON ${jsonCount}），无错误${warns ? '，' + warns + ' 条建议' : ''}`,
    )
  else push('error', '总览', `发现 ${errors} 处错误、${warns} 条建议，请修正后再导出`)

  return { ok: errors === 0, items, fileCount: files.length, pageCount: p.pages.length }
}
