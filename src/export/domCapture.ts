/**
 * 轻量「截图」能力：把某个 DOM 节点通过 SVG <foreignObject> 序列化成图片。
 * 不依赖任何第三方库，离线可用。占位图均为渐变背景（无跨域图片），不会污染画布。
 *
 * 关键点：<foreignObject> 渲染 SVG 时只认「内联样式 + SVG 内部的 <style>」，
 * 不认页面外链 CSS。所以这里把文档里所有同域样式表收集进 SVG 的 <style>，
 * 截图才能还原 Tailwind 设计（否则全是未排版的无样式方块，失去自检意义）。
 * 同时剔除 url(...) 引用，避免外部资源导致画布被污染（toDataURL 抛错）。
 */

/** 收集当前文档中可读取的同域样式表文本（跳过跨域，剔除 url 引用防污染） */
function collectCss(): string {
  let css = ''
  try {
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList | null = null
      try {
        rules = sheet.cssRules
      } catch {
        continue // 跨域样式表无法读取，跳过
      }
      if (!rules) continue
      for (const rule of Array.from(rules)) {
        let text = rule.cssText
        if (text.includes('url(')) text = text.replace(/url\([^)]*\)/g, 'none')
        css += text + '\n'
      }
    }
  } catch {
    /* 收集失败则退化为无样式截图 */
  }
  return css
}

export async function captureNode(el: HTMLElement): Promise<string | null> {
  try {
    const rect = el.getBoundingClientRect()
    const w = Math.max(1, Math.round(rect.width))
    const h = Math.max(1, Math.round(rect.height))
    if (w === 0 || h === 0) return null

    const clone = el.cloneNode(true) as HTMLElement
    clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')

    const html = new XMLSerializer().serializeToString(clone)
    const css = collectCss()
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<style>${css}</style>` +
      `<foreignObject x="0" y="0" width="${w}" height="${h}">${html}</foreignObject></svg>`

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    try {
      const img = new Image()
      img.width = w
      img.height = h
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('image load failed'))
        img.src = url
      })
      const canvas = document.createElement('canvas')
      const scale = 2
      canvas.width = w * scale
      canvas.height = h * scale
      const ctx = canvas.getContext('2d')
      if (!ctx) return null
      ctx.scale(scale, scale)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      ctx.drawImage(img, 0, 0)
      return canvas.toDataURL('image/png')
    } catch {
      // 个别浏览器对带 <style> 的 foreignObject 截图支持不佳时，退化为空（不阻塞自检）
      return null
    } finally {
      URL.revokeObjectURL(url)
    }
  } catch {
    return null
  }
}
