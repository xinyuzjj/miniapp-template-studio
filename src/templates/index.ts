import type { TemplateDef } from '../types'
import { PART_A } from './defs'
import { PART_B } from './defsB'

export const TEMPLATES: TemplateDef[] = [...PART_A, ...PART_B]

export function getTemplate(id: string): TemplateDef | undefined {
  return TEMPLATES.find((t) => t.id === id)
}

export const INDUSTRIES = Array.from(new Set(TEMPLATES.map((t) => t.industry)))
