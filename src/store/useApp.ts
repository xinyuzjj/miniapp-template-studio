import { create } from 'zustand'
import type { MpNode, MpPage, MpProject, NodeStyle, Theme } from '../types'
import { getTemplate } from '../templates'
import { node as makeNode, uid } from '../core/registry'

const STORAGE_KEY = 'mp-template-studio:v1'

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

/* ---------------- 节点查找 ---------------- */

function listOf(nodes: MpNode[], id: string): MpNode[] | null {
  for (const n of nodes) {
    if (n.id === id) return nodes
    if (n.children) {
      const r = listOf(n.children, id)
      if (r) return r
    }
  }
  return null
}

function findNode(nodes: MpNode[], id: string): MpNode | null {
  for (const n of nodes) {
    if (n.id === id) return n
    if (n.children) {
      const r = findNode(n.children, id)
      if (r) return r
    }
  }
  return null
}

function removeFrom(nodes: MpNode[], id: string): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1)
      return true
    }
    const kids = nodes[i].children
    if (kids && removeFrom(kids, id)) return true
  }
  return false
}

/* ---------------- Store ---------------- */

/** 模块级剪贴板，用于跨页面复制节点 */
let clipboard: MpNode | null = null

interface State {
  view: 'home' | 'editor'
  project: MpProject | null
  currentPageId: string
  selectedId: string | null
  leftTab: 'components' | 'layers' | 'pages'
  rightTab: 'prop' | 'theme'
  codeOpen: boolean
  past: MpProject[]
  future: MpProject[]

  goHome: () => void
  createFromTemplate: (templateId: string) => void
  restore: () => boolean

  setPage: (id: string) => void
  select: (id: string | null) => void
  setLeftTab: (t: State['leftTab']) => void
  setRightTab: (t: State['rightTab']) => void
  setCodeOpen: (v: boolean) => void

  updateNodeProps: (nodeId: string, patch: Record<string, any>) => void
  updateNodeStyle: (nodeId: string, patch: NodeStyle) => void
  addNode: (type: string, parentId?: string | null, index?: number) => void
  duplicateNode: (nodeId: string) => void
  removeNode: (nodeId: string) => void
  moveNode: (nodeId: string, dir: -1 | 1) => void
  copyNode: (nodeId: string) => void
  pasteNode: (targetId?: string | null) => void
  hasClipboard: () => boolean

  updatePage: (pageId: string, patch: Partial<MpPage>) => void
  addPage: () => void
  removePage: (pageId: string) => void
  duplicatePage: (pageId: string) => void
  movePage: (pageId: string, dir: -1 | 1) => void
  setHomePage: (pageId: string) => void

  updateTheme: (patch: Partial<Theme>) => void
  updateTabBar: (patch: Partial<MpProject['tabBar']>) => void

  undo: () => void
  redo: () => void
}

const HISTORY_LIMIT = 60

export const useApp = create<State>((set, get) => {
  const commit = (mutate: (p: MpProject) => void) => {
    const p = get().project
    if (!p) return
    const next = clone(p)
    mutate(next)
    const past = [...get().past, clone(p)].slice(-HISTORY_LIMIT)
    set({ project: next, past, future: [] })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }

  return {
    view: 'home',
    project: null,
    currentPageId: '',
    selectedId: null,
    leftTab: 'components',
    rightTab: 'prop',
    codeOpen: false,
    past: [],
    future: [],

    goHome: () => set({ view: 'home' }),

    createFromTemplate: (templateId) => {
      const tpl = getTemplate(templateId)
      if (!tpl) return
      const built = tpl.build()
      const project: MpProject = { ...built, id: uid('proj') }
      set({
        project,
        view: 'editor',
        currentPageId: project.pages[0]?.id ?? '',
        selectedId: null,
        past: [],
        future: [],
        rightTab: 'prop',
        leftTab: 'components',
      })
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
      } catch {
        /* ignore */
      }
    },

    restore: () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return false
        const project = JSON.parse(raw) as MpProject
        if (!project?.pages?.length) return false
        set({ project, view: 'editor', currentPageId: project.pages[0].id, selectedId: null, past: [], future: [] })
        return true
      } catch {
        return false
      }
    },

    setPage: (id) => set({ currentPageId: id, selectedId: null }),
    select: (id) => set({ selectedId: id, rightTab: id ? 'prop' : get().rightTab, leftTab: id ? 'components' : get().leftTab }),
    setLeftTab: (t) => set({ leftTab: t }),
    setRightTab: (t) => set({ rightTab: t }),
    setCodeOpen: (v) => set({ codeOpen: v }),

    updateNodeProps: (nodeId, patch) =>
      commit((p) => {
        const page = p.pages.find((x) => x.id === get().currentPageId)
        if (!page) return
        const n = findNode(page.nodes, nodeId)
        if (n) n.props = { ...n.props, ...patch }
      }),

    updateNodeStyle: (nodeId, patch) =>
      commit((p) => {
        const page = p.pages.find((x) => x.id === get().currentPageId)
        if (!page) return
        const n = findNode(page.nodes, nodeId)
        if (n) n.style = { ...n.style, ...patch }
      }),

    addNode: (type, parentId, index) =>
      commit((p) => {
        const page = p.pages.find((x) => x.id === get().currentPageId)
        if (!page) return
        const fresh = makeNode(type)
        if (parentId) {
          const parent = findNode(page.nodes, parentId)
          if (parent && parent.children) {
            parent.children.splice(index ?? parent.children.length, 0, fresh)
            set({ selectedId: fresh.id })
            return
          }
        }
        const list = parentId ? listOf(page.nodes, parentId) : page.nodes
        if (list) list.splice(index ?? list.length, 0, fresh)
        set({ selectedId: fresh.id })
      }),

    duplicateNode: (nodeId) =>
      commit((p) => {
        const page = p.pages.find((x) => x.id === get().currentPageId)
        if (!page) return
        const list = listOf(page.nodes, nodeId)
        if (!list) return
        const idx = list.findIndex((x) => x.id === nodeId)
        const copy = clone(list[idx])
        const reid = (n: MpNode) => {
          n.id = uid(n.type)
          n.children?.forEach(reid)
        }
        reid(copy)
        list.splice(idx + 1, 0, copy)
        set({ selectedId: copy.id })
      }),

    removeNode: (nodeId) =>
      commit((p) => {
        const page = p.pages.find((x) => x.id === get().currentPageId)
        if (!page) return
        removeFrom(page.nodes, nodeId)
        if (get().selectedId === nodeId) set({ selectedId: null })
      }),

    moveNode: (nodeId, dir) =>
      commit((p) => {
        const page = p.pages.find((x) => x.id === get().currentPageId)
        if (!page) return
        const list = listOf(page.nodes, nodeId)
        if (!list) return
        const i = list.findIndex((x) => x.id === nodeId)
        const j = i + dir
        if (j < 0 || j >= list.length) return
        ;[list[i], list[j]] = [list[j], list[i]]
      }),

    copyNode: (nodeId) => {
      const p = get().project
      if (!p) return
      const page = p.pages.find((x) => x.id === get().currentPageId)
      if (!page) return
      const n = findNode(page.nodes, nodeId)
      if (n) clipboard = clone(n)
    },

    pasteNode: (targetId) =>
      commit((p) => {
        if (!clipboard) return
        const page = p.pages.find((x) => x.id === get().currentPageId)
        if (!page) return
        const copy = clone(clipboard)
        const reid = (n: MpNode) => {
          n.id = uid(n.type)
          n.children?.forEach(reid)
        }
        reid(copy)
        const tid = targetId ?? get().selectedId
        if (tid) {
          const list = listOf(page.nodes, tid)
          if (list) {
            const idx = list.findIndex((x) => x.id === tid)
            list.splice(idx + 1, 0, copy)
            set({ selectedId: copy.id })
            return
          }
        }
        page.nodes.push(copy)
        set({ selectedId: copy.id })
      }),

    hasClipboard: () => !!clipboard,

    updatePage: (pageId, patch) =>
      commit((p) => {
        const page = p.pages.find((x) => x.id === pageId)
        if (page) Object.assign(page, patch)
      }),

    addPage: () =>
      commit((p) => {
        const idx = p.pages.length + 1
        const path = `pages/page${idx}/index`
        const page: MpPage = {
          id: uid('page'),
          path,
          name: `新页面 ${idx}`,
          navTitle: `新页面 ${idx}`,
          navBg: '#ffffff',
          navText: 'black',
          background: p.theme.background,
          nodes: [makeNode('title', { content: '新页面标题' })],
        }
        p.pages.push(page)
        set({ currentPageId: page.id, selectedId: null })
      }),

    removePage: (pageId) =>
      commit((p) => {
        if (p.pages.length <= 1) return
        const i = p.pages.findIndex((x) => x.id === pageId)
        if (i < 0) return
        const [removed] = p.pages.splice(i, 1)
        p.tabBar.items = p.tabBar.items.filter((it) => it.pagePath !== removed.path)
        if (get().currentPageId === pageId) set({ currentPageId: p.pages[0].id, selectedId: null })
      }),

    duplicatePage: (pageId) =>
      commit((p) => {
        const i = p.pages.findIndex((x) => x.id === pageId)
        if (i < 0) return
        const src = p.pages[i]
        const idx = p.pages.length + 1
        const path = `pages/page${idx}/index`
        const nodes = clone(src.nodes)
        const reid = (n: MpNode) => {
          n.id = uid(n.type)
          n.children?.forEach(reid)
        }
        nodes.forEach(reid)
        const copy: MpPage = {
          ...clone(src),
          id: uid('page'),
          path,
          name: `${src.name} 副本`,
          navTitle: `${src.navTitle} 副本`,
        }
        copy.nodes = nodes
        p.pages.splice(i + 1, 0, copy)
        set({ currentPageId: copy.id, selectedId: null })
      }),

    movePage: (pageId, dir) =>
      commit((p) => {
        const i = p.pages.findIndex((x) => x.id === pageId)
        const j = i + dir
        if (i < 0 || j < 0 || j >= p.pages.length) return
        ;[p.pages[i], p.pages[j]] = [p.pages[j], p.pages[i]]
      }),

    setHomePage: (pageId) =>
      commit((p) => {
        const i = p.pages.findIndex((x) => x.id === pageId)
        if (i <= 0) return
        const [pg] = p.pages.splice(i, 1)
        p.pages.unshift(pg)
        set({ currentPageId: pg.id })
      }),

    updateTheme: (patch) =>
      commit((p) => {
        p.theme = { ...p.theme, ...patch }
      }),

    updateTabBar: (patch) =>
      commit((p) => {
        p.tabBar = { ...p.tabBar, ...patch }
      }),

    undo: () => {
      const { past, project, future } = get()
      if (!past.length || !project) return
      const prev = past[past.length - 1]
      set({
        project: prev,
        past: past.slice(0, -1),
        future: [project, ...future].slice(0, HISTORY_LIMIT),
      })
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prev))
      } catch {
        /* ignore */
      }
    },

    redo: () => {
      const { future, project, past } = get()
      if (!future.length || !project) return
      const next = future[0]
      set({
        project: next,
        past: [...past, project].slice(-HISTORY_LIMIT),
        future: future.slice(1),
      })
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
    },
  }
})

export function useCurrentPage(): MpPage | null {
  return useApp((s) => s.project?.pages.find((p) => p.id === s.currentPageId) ?? null)
}

export function useSelectedNode(): MpNode | null {
  return useApp((s) => {
    const page = s.project?.pages.find((p) => p.id === s.currentPageId)
    if (!page || !s.selectedId) return null
    return findNode(page.nodes, s.selectedId) ?? null
  })
}
