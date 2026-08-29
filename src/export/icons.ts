import { ICONS, iconExists } from '../core/icons'
import type { MpProject } from '../types'
import type { GenFile } from './mpgen'

const FILLED = new Set(['star', 'fire', 'heart', 'heartPulse'])

async function drawIcon(name: string, color: string, size: number, lineWidth = 2): Promise<Uint8Array> {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return new Uint8Array()
  const scale = size / 24
  ctx.scale(scale, scale)
  ctx.clearRect(0, 0, 24, 24)
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = color
  ctx.fillStyle = color
  const filled = FILLED.has(name)
  const paths = iconExists(name) ? ICONS[name] : ICONS.sparkles
  for (const d of paths) {
    const p = new Path2D(d)
    if (filled) ctx.fill(p)
    ctx.stroke(p)
  }
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
  if (!blob) return new Uint8Array()
  const buf = await blob.arrayBuffer()
  return new Uint8Array(buf)
}

/** 组件图标：p_ 主色 / s_ 灰色 / w_ 白色 */
export async function generateComponentIcons(project: MpProject, names: Set<string>): Promise<GenFile[]> {
  const out: GenFile[] = []
  const variants: [string, string][] = [
    ['p', project.theme.primary],
    ['s', '#9aa3b2'],
    ['w', '#ffffff'],
  ]
  for (const name of names) {
    for (const [prefix, color] of variants) {
      const buf = await drawIcon(name, color, 72)
      if (buf.length) out.push({ path: `images/icons/${prefix}_${name}.png`, content: buf })
    }
  }
  return out
}

/**
 * tabBar 图标：81x81，普通态与选中态
 * 返回文件列表与成功生成的图标名集合（用于决定是否在 app.json 中引用）
 */
export async function generateTabIcons(project: MpProject): Promise<{ files: GenFile[]; names: Set<string> }> {
  const files: GenFile[] = []
  const names = new Set<string>()
  if (!project.tabBar.enabled) return { files, names }
  for (const it of project.tabBar.items) {
    if (names.has(it.icon)) continue
    const normal = await drawIcon(it.icon, project.tabBar.color, 81, 1.8)
    const active = await drawIcon(it.icon, project.tabBar.selectedColor, 81, 1.8)
    if (normal.length && active.length) {
      files.push({ path: `images/tabbar/${it.icon}.png`, content: normal })
      files.push({ path: `images/tabbar/${it.icon}_on.png`, content: active })
      names.add(it.icon)
    }
  }
  return { files, names }
}
