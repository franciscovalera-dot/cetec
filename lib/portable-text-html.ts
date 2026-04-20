/**
 * Conversores HTML ↔ Portable Text
 * Usados por el editor WYSIWYG del panel de administración
 */

function randomKey() {
  return Math.random().toString(36).slice(2, 10)
}

// ─── Tipos internos ────────────────────────────────────────────────

interface PTSpan {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

interface PTMarkDef {
  _type: string
  _key: string
  href?: string
}

interface PTBlock {
  _type: 'block'
  _key: string
  style: string
  markDefs: PTMarkDef[]
  children: PTSpan[]
  listItem?: 'bullet' | 'number'
  level?: number
}

// ─── HTML → Portable Text ──────────────────────────────────────────

/**
 * Convierte HTML (output de TipTap) a bloques Portable Text para Sanity.
 * Soporta: p, h2, h3, strong, em, a, ul/ol/li, blockquote, hr
 */
export function htmlToPortableText(html: string): PTBlock[] {
  if (!html || html === '<p></p>') return []

  // Usar DOMParser en el navegador, o parseo regex en el servidor
  if (typeof DOMParser !== 'undefined') {
    return htmlToPortableTextDOM(html)
  }
  return htmlToPortableTextRegex(html)
}

function htmlToPortableTextDOM(html: string): PTBlock[] {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const blocks: PTBlock[] = []

  function processListItems(list: Element, listType: 'bullet' | 'number') {
    const items = list.querySelectorAll(':scope > li')
    items.forEach((li) => {
      const { children: spans, markDefs } = parseInlineNodes(li.childNodes)
      blocks.push({
        _type: 'block',
        _key: randomKey(),
        style: 'normal',
        listItem: listType,
        level: 1,
        markDefs,
        children: spans.length > 0 ? spans : [{ _type: 'span', _key: randomKey(), text: '', marks: [] }],
      })
    })
  }

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        blocks.push({
          _type: 'block',
          _key: randomKey(),
          style: 'normal',
          markDefs: [],
          children: [{ _type: 'span', _key: randomKey(), text, marks: [] }],
        })
      }
      return
    }

    const el = node as Element
    const tag = el.tagName?.toLowerCase()

    if (tag === 'ul') {
      processListItems(el, 'bullet')
    } else if (tag === 'ol') {
      processListItems(el, 'number')
    } else if (tag === 'blockquote') {
      // Blockquote contiene <p> hijos
      el.querySelectorAll('p').forEach((p) => {
        const { children: spans, markDefs } = parseInlineNodes(p.childNodes)
        blocks.push({
          _type: 'block',
          _key: randomKey(),
          style: 'blockquote',
          markDefs,
          children: spans.length > 0 ? spans : [{ _type: 'span', _key: randomKey(), text: '', marks: [] }],
        })
      })
    } else if (tag === 'hr') {
      // Ignorar separadores en PT (no hay equivalente directo simple)
    } else {
      // p, h2, h3, etc.
      const style = tag === 'h2' ? 'h2' : tag === 'h3' ? 'h3' : tag === 'h4' ? 'h4' : 'normal'
      const { children: spans, markDefs } = parseInlineNodes(el.childNodes)
      blocks.push({
        _type: 'block',
        _key: randomKey(),
        style,
        markDefs,
        children: spans.length > 0 ? spans : [{ _type: 'span', _key: randomKey(), text: '', marks: [] }],
      })
    }
  })

  return blocks
}

function parseInlineNodes(nodes: NodeListOf<ChildNode>): { children: PTSpan[]; markDefs: PTMarkDef[] } {
  const children: PTSpan[] = []
  const markDefs: PTMarkDef[] = []

  function walk(node: ChildNode, marks: string[]) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ''
      if (text) {
        children.push({ _type: 'span', _key: randomKey(), text, marks: [...marks] })
      }
      return
    }

    const el = node as Element
    const tag = el.tagName?.toLowerCase()
    const newMarks = [...marks]

    if (tag === 'strong' || tag === 'b') {
      newMarks.push('strong')
    } else if (tag === 'em' || tag === 'i') {
      newMarks.push('em')
    } else if (tag === 'a') {
      const href = el.getAttribute('href')
      if (href) {
        const linkKey = randomKey()
        markDefs.push({ _type: 'link', _key: linkKey, href })
        newMarks.push(linkKey)
      }
    }

    el.childNodes.forEach((child) => walk(child, newMarks))
  }

  nodes.forEach((node) => walk(node, []))
  return { children, markDefs }
}

/** Fallback servidor: parseo simple con regex */
function htmlToPortableTextRegex(html: string): PTBlock[] {
  const blocks: PTBlock[] = []

  // Separar por tags de bloque
  const blockRegex = /<(p|h[2-4]|li|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi
  let match

  while ((match = blockRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase()
    const inner = match[2]

    const style = tag === 'h2' ? 'h2' : tag === 'h3' ? 'h3' : tag === 'h4' ? 'h4' : tag === 'blockquote' ? 'blockquote' : 'normal'

    // Strip HTML tags para obtener texto plano (simplificado)
    const text = inner.replace(/<[^>]+>/g, '').trim()

    blocks.push({
      _type: 'block',
      _key: randomKey(),
      style,
      markDefs: [],
      children: [{ _type: 'span', _key: randomKey(), text, marks: [] }],
    })
  }

  // Si no se encontró nada, tratar como texto plano
  if (blocks.length === 0 && html.trim()) {
    const text = html.replace(/<[^>]+>/g, '').trim()
    if (text) {
      blocks.push({
        _type: 'block',
        _key: randomKey(),
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: randomKey(), text, marks: [] }],
      })
    }
  }

  return blocks
}

// ─── Portable Text → HTML ──────────────────────────────────────────

interface PTBlockInput {
  _type?: string
  style?: string
  listItem?: string
  level?: number
  markDefs?: { _type?: string; _key?: string; href?: string }[]
  children?: { _type?: string; text?: string; marks?: string[] }[]
}

/**
 * Convierte bloques Portable Text a HTML para cargar en el editor WYSIWYG.
 */
export function portableTextToHtml(blocks: unknown[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  const ptBlocks = blocks as PTBlockInput[]
  let html = ''
  let inList: string | null = null

  for (let i = 0; i < ptBlocks.length; i++) {
    const block = ptBlocks[i]
    if (block._type !== 'block') continue

    const nextBlock = ptBlocks[i + 1] as PTBlockInput | undefined
    const isListItem = !!block.listItem
    const listTag = block.listItem === 'number' ? 'ol' : 'ul'

    // Abrir lista si es necesario
    if (isListItem && inList !== listTag) {
      if (inList) html += `</${inList}>`
      html += `<${listTag}>`
      inList = listTag
    }

    // Cerrar lista si ya no estamos en lista
    if (!isListItem && inList) {
      html += `</${inList}>`
      inList = null
    }

    const innerHtml = renderSpans(block.children || [], block.markDefs || [])

    if (isListItem) {
      html += `<li>${innerHtml}</li>`
    } else {
      const style = block.style || 'normal'
      if (style === 'h2') html += `<h2>${innerHtml}</h2>`
      else if (style === 'h3') html += `<h3>${innerHtml}</h3>`
      else if (style === 'h4') html += `<h4>${innerHtml}</h4>`
      else if (style === 'blockquote') html += `<blockquote><p>${innerHtml}</p></blockquote>`
      else html += `<p>${innerHtml}</p>`
    }

    // Cerrar lista si el siguiente bloque no es list item
    if (isListItem && (!nextBlock || !nextBlock.listItem)) {
      html += `</${listTag}>`
      inList = null
    }
  }

  if (inList) html += `</${inList}>`

  return html
}

function renderSpans(
  children: { _type?: string; text?: string; marks?: string[] }[],
  markDefs: { _type?: string; _key?: string; href?: string }[]
): string {
  return children
    .map((child) => {
      let text = escapeHtml(child.text || '')
      const marks = child.marks || []

      for (const mark of marks) {
        if (mark === 'strong') {
          text = `<strong>${text}</strong>`
        } else if (mark === 'em') {
          text = `<em>${text}</em>`
        } else {
          // Buscar en markDefs (links, etc.)
          const def = markDefs.find((d) => d._key === mark)
          if (def?._type === 'link' && def.href) {
            text = `<a href="${escapeHtml(def.href)}">${text}</a>`
          }
        }
      }

      return text
    })
    .join('')
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
