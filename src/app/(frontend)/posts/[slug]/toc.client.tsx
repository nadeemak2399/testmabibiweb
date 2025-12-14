// app/posts/[slug]/toc.client.tsx
'use client'

import React, { useEffect, useState, useRef } from 'react'

type TocItem = {
  id: string
  text: string
}

export default function TocClient(): React.ReactElement {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const rafRef = useRef<number | null>(null)

  // TUNE THIS: offset from top of viewport where a heading should be considered "at the top"
  const topOffset = 120

  useEffect(() => {
    const container = document.getElementById('post-content')
    if (!container) {
      setItems([])
      return
    }

    // Gather H2 headings
    const headings = Array.from(container.querySelectorAll('h2')) as HTMLHeadingElement[]
    if (headings.length === 0) {
      setItems([])
      return
    }

    // Ensure unique IDs for all headings
    const toc: TocItem[] = headings.map((h) => {
      if (!h.id) {
        const base = (h.textContent || 'heading')
          .trim()
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 80)
        let id = base || 'heading'
        let counter = 1
        while (document.getElementById(id)) {
          id = `${base}-${counter}`
          counter++
        }
        h.id = id
      }
      return { id: h.id, text: h.textContent || '' }
    })

    setItems(toc)

const onScroll = () => {
  if (rafRef.current !== null) return

  rafRef.current = requestAnimationFrame(() => {
    rafRef.current = null

    const closest = headings.reduce<{ id: string; distance: number } | null>((prev, h) => {
      const rect = h.getBoundingClientRect()
      const distance = Math.abs(rect.top - topOffset)

      // Skip headings without id
      if (!h.id) return prev

      if (!prev || distance < prev.distance) {
        return { id: h.id, distance }
      }

      return prev
    }, null)

    if (closest && closest.id !== activeId) {
      setActiveId(closest.id)
    }
  })
}


    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Click handler: smooth scroll and set active
  const handleClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => {
      window.scrollBy({ top: -topOffset + 16, behavior: 'smooth' })
    }, 200)

    setActiveId(id)
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav style={{ position: 'sticky', top: 20 }} className="toc-post">
      <div className="toc-post-head">Table of Contents</div>

      {items.length === 0 ? (
        <div className="text-sm text-gray-600">No sections</div>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => {
            const isActive = it.id === activeId
            return (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  onClick={handleClick(it.id)}
                  className={`block text-sm transition-colors duration-150 ${
                    isActive
                      ? 'font-semibold text-sky-700'
                      : 'text-gray-600 hover:text-sky-600'
                  }`}
                >
                  {it.text}
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}
