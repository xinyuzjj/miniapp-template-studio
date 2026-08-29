import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})

const g = globalThis as any
const define = (k: string, v: any) => {
  try {
    Object.defineProperty(g, k, { value: v, writable: true, configurable: true, enumerable: true })
  } catch {
    /* 只读全局跳过 */
  }
}

define('window', dom.window)
define('document', dom.window.document)
define('navigator', dom.window.navigator)
define('location', dom.window.location)
define('localStorage', dom.window.localStorage)
define('sessionStorage', dom.window.sessionStorage)
define('HTMLElement', dom.window.HTMLElement)
define('HTMLCanvasElement', dom.window.HTMLCanvasElement)
define('HTMLInputElement', dom.window.HTMLInputElement)
define('Element', dom.window.Element)
define('Node', dom.window.Node)
define('Text', dom.window.Text)
define('Event', dom.window.Event)
define('MouseEvent', dom.window.MouseEvent)
define('KeyboardEvent', dom.window.KeyboardEvent)
define('getComputedStyle', dom.window.getComputedStyle.bind(dom.window))
define('requestAnimationFrame', (cb: any) => setTimeout(() => cb(Date.now()), 0))
define('cancelAnimationFrame', (id: any) => clearTimeout(id))
define('IS_REACT_ACT_ENVIRONMENT', true)

if (!g.Path2D) define('Path2D', class Path2D {})
if (!URL.createObjectURL) (URL as any).createObjectURL = () => 'blob:mock'

export { dom }
