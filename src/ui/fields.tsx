import { useState } from 'react'
import type { PropField } from '../types'
import { ChevronDown, ChevronUp, Plus, Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react'

/* ---------------- 基础控件 ---------------- */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-3">
      <span className="block text-[11.5px] text-ink-500 mb-1.5">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full h-8 px-2.5 rounded-lg border border-ink-200 bg-white text-[12.5px] text-ink-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition'

function TextInput({ value, onChange, placeholder, multiline }: { value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  if (multiline) {
    return (
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-2.5 py-2 rounded-lg border border-ink-200 bg-white text-[12.5px] text-ink-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition resize-y leading-relaxed"
      />
    )
  }
  return <input value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
}

function NumberInput({ value, onChange, min, max, step, suffix }: { value: any; onChange: (v: any) => void; min?: number; max?: number; step?: number; suffix?: string }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value ?? 0}
        min={min}
        max={max}
        step={step ?? 1}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        className={inputCls}
      />
      {suffix ? <span className="text-[11px] text-ink-400 flex-shrink-0">{suffix}</span> : null}
    </div>
  )
}

function Switch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-10 h-[22px] rounded-full transition relative ${value ? 'bg-brand-600' : 'bg-ink-200'}`}
    >
      <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-all ${value ? 'left-[21px]' : 'left-[3px]'}`} />
    </button>
  )
}

function ColorInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={/^#[0-9a-f]{6}$/i.test(value || '') ? value : '#3459f7'} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer flex-shrink-0" />
      <input value={value ?? ''} placeholder={placeholder || '留空则跟随主题'} onChange={(e) => onChange(e.target.value)} className={inputCls + ' flex-1'} />
      {value ? (
        <button onClick={() => onChange('')} className="text-[11px] text-ink-400 hover:text-brand-600 px-1 flex-shrink-0">
          重置
        </button>
      ) : null}
    </div>
  )
}

function SelectInput({ value, onChange, options }: { value: any; onChange: (v: any) => void; options: { label: string; value: string }[] }) {
  return (
    <select value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} className={inputCls}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

/* ---------------- 列表编辑器 ---------------- */

function ListEditor({
  field,
  value,
  onChange,
}: {
  field: Extract<PropField, { type: 'list' }>
  value: any[]
  onChange: (v: any[]) => void
}) {
  const [open, setOpen] = useState<number | null>(0)
  const items = Array.isArray(value) ? value : []

  const setItem = (i: number, patch: Record<string, any>) => {
    const next = items.map((it, k) => (k === i ? { ...it, ...patch } : it))
    onChange(next)
  }
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
    setOpen(j)
  }
  const remove = (i: number) => {
    onChange(items.filter((_, k) => k !== i))
    setOpen(null)
  }
  const add = () => {
    onChange([...items, { ...field.defaultItem }])
    setOpen(items.length)
  }
  const dup = (i: number) => {
    const next = [...items]
    next.splice(i + 1, 0, { ...items[i] })
    onChange(next)
    setOpen(i + 1)
  }

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11.5px] text-ink-500">
          {field.label} <span className="text-ink-300">({items.length})</span>
        </span>
        <button onClick={add} className="text-[11px] text-brand-600 hover:text-brand-700 inline-flex items-center gap-0.5">
          <Plus size={12} /> 添加
        </button>
      </div>
      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div key={i} className="rounded-lg border border-ink-100 overflow-hidden bg-white">
            <div className="flex items-center gap-1 px-2 py-1.5 bg-ink-50/70">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex-1 text-left flex items-center gap-1.5 min-w-0">
                {open === i ? <ChevronUp size={13} className="text-ink-400 flex-shrink-0" /> : <ChevronDown size={13} className="text-ink-400 flex-shrink-0" />}
                <span className="text-[12px] text-ink-700 truncate">
                  {field.itemLabel} {i + 1}
                  <span className="text-ink-300 ml-1.5 truncate">{String(it.title || it.text || it.name || it.q || it.label || it.value || '')}</span>
                </span>
              </button>
              <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-ink-100 text-ink-400 disabled:opacity-30">
                <ArrowUp size={12} />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 rounded hover:bg-ink-100 text-ink-400 disabled:opacity-30">
                <ArrowDown size={12} />
              </button>
              <button onClick={() => dup(i)} className="p-1 rounded hover:bg-ink-100 text-ink-400">
                <Copy size={12} />
              </button>
              <button onClick={() => remove(i)} className="p-1 rounded hover:bg-red-50 text-ink-400 hover:text-red-500">
                <Trash2 size={12} />
              </button>
            </div>
            {open === i ? (
              <div className="p-2.5 border-t border-ink-100">
                {field.fields.map((sub) => (
                  <FieldControl
                    key={sub.key}
                    field={sub}
                    value={it[sub.key]}
                    onChange={(v) => setItem(i, { [sub.key]: v })}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- 分发 ---------------- */

export function FieldControl({ field, value, onChange }: { field: PropField; value: any; onChange: (v: any) => void }) {
  switch (field.type) {
    case 'text':
      return (
        <Row label={field.label}>
          <TextInput value={value} onChange={onChange} placeholder={field.placeholder} />
        </Row>
      )
    case 'textarea':
      return (
        <Row label={field.label}>
          <TextInput value={value} onChange={onChange} placeholder={field.placeholder} multiline />
        </Row>
      )
    case 'number':
      return (
        <Row label={field.label}>
          <NumberInput value={value} onChange={onChange} min={field.min} max={field.max} step={field.step} suffix={field.suffix} />
        </Row>
      )
    case 'switch':
      return (
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11.5px] text-ink-500">{field.label}</span>
          <Switch value={!!value} onChange={onChange} />
        </div>
      )
    case 'color':
      return (
        <Row label={field.label}>
          <ColorInput value={value} onChange={onChange} />
        </Row>
      )
    case 'select':
      return (
        <Row label={field.label}>
          <SelectInput value={value} onChange={onChange} options={field.options} />
        </Row>
      )
    case 'image':
      return (
        <Row label={field.label}>
          <div className="flex gap-1.5">
            <input
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="粘贴 https 图片地址，留空用占位图"
              className={inputCls + ' flex-1'}
            />
            {value ? (
              <button onClick={() => onChange('')} className="px-2 text-ink-400 hover:text-red-500">
                <Trash2 size={13} />
              </button>
            ) : null}
          </div>
        </Row>
      )
    case 'imageList':
      return (
        <Row label={field.label}>
          <TextInput value={Array.isArray(value) ? value.join('\n') : (value ?? '')} onChange={(v) => onChange(v.split('\n'))} placeholder="每行一个图片地址" multiline />
        </Row>
      )
    case 'list':
      return <ListEditor field={field} value={value} onChange={onChange} />
    default:
      return null
  }
}
