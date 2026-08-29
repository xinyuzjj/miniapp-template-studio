import JSZip from 'jszip'
import type { GenFile } from './mpgen'

export async function buildZip(files: GenFile[]): Promise<Blob> {
  const zip = new JSZip()
  for (const f of files) {
    // .sh / .command 这类 shell 脚本在 macOS/Linux 下需要可执行位
    const isShell = /\.(sh|command)$/i.test(f.path)
    zip.file(f.path, f.content as any, isShell ? { unixPermissions: 0o755 } : undefined)
  }
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

/** 生成单页 HTML 预览（方便不开微信开发者工具也能看到源码结构） */
export function buildSourceHtml(files: GenFile[], projectName: string): string {
  const items = files
    .filter((f) => typeof f.content === 'string')
    .map((f) => {
      const code = String(f.content).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      return `<div class="file"><div class="fp">${f.path}</div><pre><code>${code}</code></pre></div>`
    })
    .join('\n')
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>${projectName} · 源码</title>
<style>
body{margin:0;background:#0f1420;color:#cdd6e6;font:13px/1.6 ui-monospace,Menlo,Consolas,monospace}
.hd{padding:18px 24px;border-bottom:1px solid #1e2740;position:sticky;top:0;background:#0f1420}
.hd h1{margin:0;font-size:16px;color:#fff}
.file{border-bottom:1px solid #1a2238}
.fp{padding:10px 24px;background:#151c2e;color:#7dd3fc;font-size:12px}
pre{margin:0;padding:14px 24px;overflow:auto;max-height:420px}
code{white-space:pre;color:#cdd6e6}
</style></head><body>
<div class="hd"><h1>${projectName} · 生成的源码文件</h1></div>
${items}
</body></html>`
}
