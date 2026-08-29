/** 占位图渐变色板：未上传真实图片时自动使用，保证零外链也能有体面的视觉 */
export const PALETTES: [string, string][] = [
  ['#ffb88c', '#ff7a59'],
  ['#a8c0ff', '#6f86d6'],
  ['#ffd3a5', '#fd6585'],
  ['#96e6a1', '#3ec48d'],
  ['#c2e9fb', '#5b9df9'],
  ['#fbc2eb', '#a18cd1'],
  ['#f9d1c4', '#e08b7a'],
  ['#d4fc79', '#4bbf8a'],
  ['#e0c3fc', '#8ec5fc'],
  ['#ffecd2', '#fcb69f'],
]

export function paletteAt(seed: number): [string, string] {
  const i = Math.abs(Math.floor(seed)) % PALETTES.length
  return PALETTES[i]
}

export function gradientOf(seed: number, angle = 135): string {
  const [a, b] = paletteAt(seed)
  return `linear-gradient(${angle}deg, ${a} 0%, ${b} 100%)`
}

export function isRemoteImage(src?: string): boolean {
  return !!src && /^https?:\/\//i.test(src.trim())
}

/** 给节点树中需要图片的数据项补充渐变占位色 */
export function decorate(nodes: any[], seed = 0): any[] {
  let n = seed
  const walk = (list: any[]): any[] =>
    list.map((node) => {
      const copy = { ...node }
      const lists = ['items', 'list', 'fields', 'links']
      for (const key of lists) {
        if (Array.isArray(copy.props?.[key])) {
          copy.props = {
            ...copy.props,
            [key]: copy.props[key].map((it: any, i: number) => {
              const [g1, g2] = paletteAt(i + n)
              return { ...it, _g1: g1, _g2: g2, _i: i }
            }),
          }
          n += copy.props[key].length
        }
      }
      if (Array.isArray(copy.children)) copy.children = walk(copy.children)
      return copy
    })
  return walk(nodes)
}
