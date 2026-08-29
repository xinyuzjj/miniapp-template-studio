/**
 * 导出产物自检（CI 用）：遍历全部模板 × 全部数据后端模式，对每一套生成完整小程序代码并做
 *  - JS 语法解析（类 ESLint parse 阶段）
 *  - JSON 解析
 *  - 页面 / tabBar / 跳转目标 / WXML 模板引用一致性校验
 * 任一组合出现 error 即以非 0 退出，阻断部署。
 *
 * 运行：npm run selfcheck
 */
import { TEMPLATES } from '../src/templates'
import { runSelfCheck } from '../src/export/selfcheck'
import type { Backend } from '../src/types'

/** 四种数据后端 / 分包组合，确保导出的每条分支都被校验到 */
const SCENARIOS: { tag: string; label: string; backend?: Backend }[] = [
  { tag: '本地缓存', label: 'local' },
  { tag: '云开发', label: 'cloud', backend: { mode: 'cloud', envId: 'cloud1-8gselfcheck', tmplIds: 'TPL_A', track: true } },
  { tag: '自有接口', label: 'api', backend: { mode: 'api', apiBase: 'https://api.example.com', track: true } },
  { tag: '分包', label: 'sub', backend: { mode: 'local', subpackage: true } },
]

let failed = 0
let totalFiles = 0
let totalErrors = 0

for (const sc of SCENARIOS) {
  for (const tpl of TEMPLATES) {
    const project = { ...tpl.build(), id: 'selfcheck', backend: sc.backend }
    const r = runSelfCheck(project)
    totalFiles += r.fileCount
    const errors = r.items.filter((i) => i.level === 'error')
    const warns = r.items.filter((i) => i.level === 'warn')
    totalErrors += errors.length
    if (r.ok) {
      console.log(`  ok   ${sc.tag} · ${tpl.id} — ${r.fileCount} 文件 / ${r.pageCount} 页${warns.length ? `（${warns.length} 条建议）` : ''}`)
    } else {
      failed++
      console.log(`  FAIL ${sc.tag} · ${tpl.id} — ${errors.length} 处错误`)
      for (const e of errors) console.log(`       ✗ ${e.scope}：${e.message}`)
    }
  }
}

const totalRuns = TEMPLATES.length * SCENARIOS.length
console.log(
  failed === 0
    ? `\n✅ 全场景导出自检通过（${TEMPLATES.length} 套 × ${SCENARIOS.length} 种后端 = ${totalRuns} 次，共 ${totalFiles} 文件，无错误）`
    : `\n❌ ${failed} 次自检失败（共 ${totalErrors} 处错误）`,
)
process.exit(failed === 0 ? 0 : 1)
