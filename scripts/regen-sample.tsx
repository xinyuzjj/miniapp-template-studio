import * as fs from 'fs'
import * as path from 'path'
import JSZip from 'jszip'
import { Resvg } from '@resvg/resvg-js'
import { getTemplate } from '../src/templates'
import { generateCodeFiles, collectIcons } from '../src/export/mpgen'
import { buildDeployScripts } from '../src/export/deploy'
import { ICONS, iconExists } from '../src/core/icons'

const ROOT = path.resolve(__dirname, '..')
const SAMPLE = path.join(ROOT, '样本输出', '电商商城')
const ASSETS = path.join(ROOT, 'release-assets')

const FILLED = new Set(['star', 'fire', 'heart', 'heartPulse'])

function svgFor(name: string, color: string, lw: number): string {
  const paths = iconExists(name) ? ICONS[name] : ICONS.sparkles
  const inner = paths
    .map((d) => {
      const fill = FILLED.has(name) ? ` fill="${color}"` : ` fill="none"`
      return `<path d="${d}"${fill} stroke="${color}" stroke-width="${lw}" stroke-linecap="round" stroke-linejoin="round"/>`
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${inner}</svg>`
}

function rasterize(svg: string, size: number): Uint8Array {
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
  return r.render().asPng()
}

function writeFile(rel: string, content: string | Uint8Array) {
  const full = path.join(SAMPLE, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  if (typeof content === 'string') fs.writeFileSync(full, content, 'utf8')
  else fs.writeFileSync(full, Buffer.from(content))
}

async function main() {
  const tpl = getTemplate('mall')!
  const project = { ...tpl.build(), id: 'sample-mall', name: '潮流生活商城' }

  // 1) 代码 + 部署脚本（ASCII 文件名）
  const tabIcons = new Set<string>()
  if (project.tabBar.enabled) project.tabBar.items.forEach((it) => tabIcons.add(it.icon))
  const code = generateCodeFiles(project, tabIcons)
  const deploy = buildDeployScripts(project)

  // 删除旧的中文名部署文件，避免残留
  for (const old of ['一键部署.bat', '一键部署.sh', '上传体验版.bat', '上传体验版.sh', '部署说明.txt']) {
    const p = path.join(SAMPLE, old)
    if (fs.existsSync(p)) fs.rmSync(p)
  }

  for (const f of [...code, ...deploy]) writeFile(f.path, f.content as string)

  // 2) 图标 PNG（resvg 栅格化，等价于浏览器 canvas 产物）
  const COMPONENT_NAMES = new Set<string>([
    'cart', 'check', 'chevronRight', 'clock', 'phone', 'pin', 'search', 'star',
    ...collectIcons(project),
    ...project.tabBar.items.map((i) => i.icon),
  ])
  const variants: [string, string][] = [
    ['p', project.theme.primary],
    ['s', '#9aa3b2'],
    ['w', '#ffffff'],
  ]
  for (const name of COMPONENT_NAMES) {
    for (const [prefix, color] of variants) {
      const buf = rasterize(svgFor(name, color, 2), 72)
      writeFile(`images/icons/${prefix}_${name}.png`, buf)
    }
  }
  if (project.tabBar.enabled) {
    for (const it of project.tabBar.items) {
      writeFile(`images/tabbar/${it.icon}.png`, rasterize(svgFor(it.icon, project.tabBar.color, 1.8), 81))
      writeFile(`images/tabbar/${it.icon}_on.png`, rasterize(svgFor(it.icon, project.tabBar.selectedColor, 1.8), 81))
    }
  }

  console.log('样本重建完成，文件数 =', code.length + deploy.length, '+ 图标 PNG')

  // 3) 打包 Release 资源
  fs.mkdirSync(ASSETS, { recursive: true })

  // 3a) 网页版（dist）
  const webZip = new JSZip()
  const addDir = (zip: JSZip, dir: string, base: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name)
      const rel = path.relative(base, full).split(path.sep).join('/')
      if (e.isDirectory()) addDir(zip, full, base)
      else zip.file(rel, fs.readFileSync(full))
    }
  }
  addDir(webZip, path.join(ROOT, 'dist'), path.join(ROOT, 'dist'))
  fs.writeFileSync(
    path.join(ASSETS, 'miniapp-template-studio-web-v1.0.0.zip'),
    await webZip.generateAsync({ type: 'nodebuffer' }),
  )

  // 3b) 商城样例小程序
  const sampleZip = new JSZip()
  addDir(sampleZip, SAMPLE, SAMPLE)
  fs.writeFileSync(
    path.join(ASSETS, 'mall-sample-v1.0.0.zip'),
    await sampleZip.generateAsync({ type: 'nodebuffer' }),
  )

  console.log('Release 资源已写入 release-assets/')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
