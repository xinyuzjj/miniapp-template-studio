/**
 * 导出产物自检（CI 用）：遍历全部模板，对每一套生成完整小程序代码并做
 *  - JS 语法解析（类 ESLint parse 阶段）
 *  - JSON 解析
 *  - 页面 / tabBar / 跳转目标 / WXML 模板引用一致性校验
 * 任一套出现 error 即以非 0 退出，阻断部署。
 *
 * 运行：npm run selfcheck
 */
import { TEMPLATES } from '../src/templates'
import { runSelfCheck } from '../src/export/selfcheck'

let failed = 0
let totalFiles = 0
let totalErrors = 0

for (const tpl of TEMPLATES) {
  const project = { ...tpl.build(), id: 'selfcheck' }
  const r = runSelfCheck(project)
  totalFiles += r.fileCount
  const errors = r.items.filter((i) => i.level === 'error')
  const warns = r.items.filter((i) => i.level === 'warn')
  totalErrors += errors.length
  if (r.ok) {
    console.log(`  ok   ${tpl.id} — ${r.fileCount} 文件 / ${r.pageCount} 页${warns.length ? `（${warns.length} 条建议）` : ''}`)
  } else {
    failed++
    console.log(`  FAIL ${tpl.id} — ${errors.length} 处错误`)
    for (const e of errors) console.log(`       ✗ ${e.scope}：${e.message}`)
  }
}

console.log(
  failed === 0
    ? `\n✅ 全部模板导出自检通过（共 ${TEMPLATES.length} 套 / ${totalFiles} 文件，无错误）`
    : `\n❌ ${failed} 套模板自检失败（共 ${totalErrors} 处错误）`,
)
process.exit(failed === 0 ? 0 : 1)
