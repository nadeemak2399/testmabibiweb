'use client'

import { useState } from 'react'
type TocItem = {
  id: string
  text: string
}

export default function TocClient({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return

    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveId(id)
    history.replaceState(null, '', `#${id}`)
  }

  if (items.length === 0) {
    return <div className="text-sm text-gray-600">No sections</div>
  }

  return (
    <nav className="toc-post sticky top-20">
      <div className="toc-post-head">Table of Contents</div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              onClick={handleClick(it.id)}
              className={
                it.id === activeId
                  ? 'font-semibold text-sky-700'
                  : 'text-gray-600 hover:text-sky-600'
              }
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
