#!/usr/bin/env node
/**
 * 小程序一键部署（命令行版）
 * ------------------------------------------------------------------
 * 在已经生成好的小程序项目目录（含 project.config.json）上，
 * 自动定位本机「微信开发者工具」并执行打开 / 预览 / 上传。
 *
 * 用法：
 *   node scripts/deploy.mjs <项目目录> [open|preview|upload] [--version 1.0.0] [--desc "说明"]
 *
 * 示例：
 *   node scripts/deploy.mjs ./dist/mall open
 *   node scripts/deploy.mjs ./dist/mall upload --version 1.0.0 --desc "模板一键部署"
 *
 * 说明：
 *   - open / preview 使用测试号（touristappid）即可。
 *   - upload 需要正式 AppID，测试号无法上传。
 *   - 自动查找顺序：常见安装目录 → 注册表（Windows）→ 环境变量。
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

function log(msg) {
  process.stdout.write(msg + '\n')
}

/** 在 Windows 上通过注册表查询微信开发者工具安装路径 */
function detectWinFromRegistry() {
  const keys = [
    'HKLM\\SOFTWARE\\WOW6432Node\\Tencent\\微信web开发者工具',
    'HKCU\\SOFTWARE\\Tencent\\微信web开发者工具',
    'HKLM\\SOFTWARE\\Tencent\\微信web开发者工具',
  ]
  for (const key of keys) {
    try {
      const out = execFileSync('reg', ['query', key, '/v', 'InstallPath'], {
        stdio: ['ignore', 'pipe', 'ignore'],
        windowsHide: true,
      })
        .toString()
        .split('\n')
      for (const line of out) {
        const m = line.match(/InstallPath\s+REG_SZ\s+(.+)/)
        if (m) {
          const ip = m[1].trim()
          const cli = path.join(ip, 'cli.bat')
          if (fs.existsSync(cli)) return cli
        }
      }
    } catch {
      /* 注册表键不存在时忽略 */
    }
  }
  return null
}

/** 探测本机微信开发者工具 CLI 路径 */
export function detectDevtools() {
  const candidates = []
  if (process.platform === 'win32') {
    const pf = process.env.ProgramFiles || 'C:\\Program Files'
    const pf86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)'
    candidates.push(path.join(pf86, 'Tencent', '微信web开发者工具', 'cli.bat'))
    candidates.push(path.join(pf, 'Tencent', '微信web开发者工具', 'cli.bat'))
    candidates.push(path.join(pf86, 'Tencent', '微信web开发者工具', 'cli.exe'))
  } else {
    candidates.push('/Applications/wechatwebdevtools.app/Contents/MacOS/cli')
    candidates.push('/Applications/微信web开发者工具.app/Contents/MacOS/cli')
    candidates.push(path.join(os.homedir(), 'Applications/wechatwebdevtools.app/Contents/MacOS/cli'))
    candidates.push('/opt/wechatwebdevtools/cli')
  }
  for (const c of candidates) {
    if (fs.existsSync(c)) return c
  }
  if (process.platform === 'win32') {
    const reg = detectWinFromRegistry()
    if (reg) return reg
  }
  return null
}

function parseArgs(argv) {
  const pos = []
  const opt = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--version') opt.version = argv[++i]
    else if (a === '--desc') opt.desc = argv[++i]
    else pos.push(a)
  }
  return { pos, opt }
}

export function run(folder, action = 'open', opt = {}) {
  const root = path.resolve(folder)
  if (!fs.existsSync(path.join(root, 'project.config.json'))) {
    throw new Error(`目录 ${root} 不是小程序项目（缺少 project.config.json）`)
  }
  const cli = detectDevtools()
  if (!cli) {
    throw new Error(
      '未检测到微信开发者工具，请先安装：\nhttps://developers.weixin.qq.com/miniprogram/dev/devtools/download.html',
    )
  }
  const base = [cli, action, '--project', root]
  if (action === 'upload') {
    base.push('--version', opt.version || '1.0.0')
    base.push('--desc', opt.desc || '模板一键部署')
  }
  log(`执行：${cli} ${action} --project ${root}`)
  execFileSync(cli, base.slice(1), { stdio: 'inherit', windowsHide: true })
  return true
}

// 作为脚本直接运行时执行
const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invokedDirectly) {
  try {
    const { pos, opt } = parseArgs(process.argv.slice(2))
    const folder = pos[0]
    const action = pos[1] || 'open'
    if (!folder) {
      log('用法：node scripts/deploy.mjs <项目目录> [open|preview|upload] [--version 1.0.0] [--desc "说明"]')
      process.exit(1)
    }
    if (!['open', 'preview', 'upload'].includes(action)) {
      log(`未知操作：${action}（可选 open / preview / upload）`)
      process.exit(1)
    }
    run(folder, action, opt)
    log(action === 'upload' ? '上传完成，请前往 mp.weixin.qq.com 提交审核。' : '已尝试打开项目。')
  } catch (e) {
    log('部署失败：' + (e && e.message ? e.message : String(e)))
    process.exit(1)
  }
}
