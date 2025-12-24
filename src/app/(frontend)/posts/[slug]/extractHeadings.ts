type Heading = {
  id: string
  text: string
}

export function extractHeadings(editorData: any): Heading[] {
  const headings: Heading[] = []

  function walk(node: any) {
    if (!node) return

    // Lexical heading nodes
    if (node.type === 'heading' && node.children?.length) {
      const text = node.children
        .map((c: any) => c.text || '')
        .join('')
        .trim()

      if (text) {
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 80)

        headings.push({ id, text })
      }
    }

    node.children?.forEach(walk)
  }

  walk(editorData.root)
  return headings
}
