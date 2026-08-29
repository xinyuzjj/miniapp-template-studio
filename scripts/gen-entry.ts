import fs from 'fs'
import path from 'path'
import { generateCodeFiles } from '../src/export/mpgen'
import { buildDeployScripts } from '../src/export/deploy'
import { TEMPLATES } from '../src/templates'

const out = process.argv[2] || 'tmp-out'
fs.rmSync(out, { recursive: true, force: true })

for (const t of TEMPLATES) {
  const project = { ...t.build(), id: 'check' }
  const files = [...generateCodeFiles(project), ...buildDeployScripts(project)]
  for (const f of files) {
    const fp = path.join(out, t.id, f.path)
    fs.mkdirSync(path.dirname(fp), { recursive: true })
    fs.writeFileSync(fp, f.content as string, 'utf8')
  }
  console.log(`${t.id.padEnd(12)} ${files.length} files`)
}
console.log('ALL DONE')
