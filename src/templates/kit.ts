import type { MpNode, MpPage, NodeStyle, TabBarItem } from '../types'
import { node as n } from '../core/registry'

/* ---------------- 页面 / 主题 快捷构造 ---------------- */

export function page(path: string, name: string, navTitle: string, nodes: MpNode[], opts: Partial<MpPage> = {}): MpPage {
  return {
    id: `p_${path.replace(/\//g, '_')}`,
    path: `pages/${path}/index`,
    name,
    navTitle,
    navBg: '#ffffff',
    navText: 'black',
    background: '#f5f6f9',
    ...opts,
    nodes,
  }
}

export function tab(items: [string, string, string][], extra: Partial<{ color: string; selectedColor: string; background: string }> = {}) {
  return {
    enabled: true,
    color: '#8a93a6',
    selectedColor: extra.selectedColor ?? '#3459f7',
    background: extra.background ?? '#ffffff',
    borderStyle: 'white' as const,
    items: items.map(([pagePath, text, icon]) => ({
      pagePath: pagePath.includes('/') ? pagePath : `pages/${pagePath}/index`,
      text,
      icon,
    } as TabBarItem)),
  }
}

export const S = {
  card: { marginTop: 10, marginBottom: 0, background: '#ffffff', radius: 14, paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 } as NodeStyle,
  pad: { paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 10 } as NodeStyle,
  section: { paddingLeft: 14, paddingRight: 14, paddingTop: 16, paddingBottom: 8 } as NodeStyle,
  plain: { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 } as NodeStyle,
}

/* ---------------- 通用区块 ---------------- */

export const title = (content: string, sub = '', more = true, moreText = '更多') =>
  n('title', { content, sub, more, moreText }, { paddingLeft: 14, paddingRight: 14, paddingTop: 16, paddingBottom: 8 })

export const hero = (items: { image?: string; title: string; desc: string }[], height = 168) =>
  n('swiper', { items: items.map((i) => ({ image: i.image ?? '', title: i.title, desc: i.desc })), height, radius: 14, indicator: 'dot' }, { paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 6 })

export const noticeBar = (text: string) => n('notice', { text, icon: 'bell', more: true }, { paddingLeft: 14, paddingRight: 14, paddingTop: 6, paddingBottom: 6 })

export const searchBar = (placeholder: string) => n('search', { placeholder }, { paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 6 })

export const footer = (text = '© 2026 示例科技有限公司 · 沪ICP备00000000号') => n('footer', { text, links: '关于我们 · 服务条款 · 隐私政策' })

/** "我的" 页面通用骨架 */
export function myPage(cfg: {
  name?: string
  desc?: string
  stats?: { value: string; label: string }[]
  grid: { icon: string; text: string }[]
  rows: { icon: string; label: string; value?: string; action?: string }[]
  banner?: { title: string; sub: string; buttonText: string }
}) {
  return [
    n(
      'view',
      { direction: 'column', gap: 12 },
      { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 },
      [
        n('stats', {
          items: cfg.stats ?? [
            { value: '12', label: '优惠券' },
            { value: '368', label: '积分' },
            { value: '5', label: '收藏' },
            { value: '28', label: '足迹' },
          ],
        }, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 0, radius: 14, marginTop: 0, marginBottom: 0 }),
        n('shop', {
          name: cfg.name ?? '您好，欢迎回来',
          logo: '',
          desc: cfg.desc ?? '普通会员 · 成长值 1280',
          tags: ['实名认证', '已绑定手机'],
          rating: '4.9',
          address: '上次登录：2026-08-28 14:32 · 上海',
          phone: '会员等级 V3',
          hours: '有效期至 2027-08-28',
        }, { ...S.card, paddingLeft: 0, paddingRight: 0 }),
        n('grid', { items: cfg.grid, columns: 4 }, { ...S.card, paddingLeft: 8, paddingRight: 8, paddingTop: 14, paddingBottom: 14 }),
        ...(cfg.banner ? [n('banner', cfg.banner, { paddingLeft: 14, paddingRight: 14, paddingTop: 12, paddingBottom: 4 })] : []),
        n('contact', { items: cfg.rows }, { ...S.card }),
        footer(),
      ],
    ),
  ]
}

/** 通用列表页骨架：搜索 + tabs + 列表 */
export function listPage(cfg: { placeholder: string; tabs: string[]; nodes: MpNode[] }) {
  return [searchBar(cfg.placeholder), n('tabs', { items: cfg.tabs.map((t) => ({ text: t })), active: 0 }), ...cfg.nodes]
}
