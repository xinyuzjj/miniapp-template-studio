import { useEffect } from 'react'
import { useApp } from './store/useApp'
import Home from './ui/Home'
import Editor from './ui/Editor'
import { TutorialRoot } from './ui/Tutorial'

export default function App() {
  const view = useApp((s) => s.view)
  const restore = useApp((s) => s.restore)

  useEffect(() => {
    // 刷新后自动恢复上次编辑的项目
    restore()
  }, [restore])

  return (
    <>
      {view === 'home' ? <Home /> : <Editor />}
      <TutorialRoot />
    </>
  )
}
