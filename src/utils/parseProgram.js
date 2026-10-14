// Programs are stored as the HTML of the original pages: an <h1> question followed by a
// .code-box whose lines are separated by <br> tags. This turns that into plain code blocks.

const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null

// Decode entities (including the old `&#60` without a semicolon) and drop any tags
function decode(html) {
  return parser.parseFromString(html, 'text/html').body.textContent
}

// Languages whose code was saved without indentation; indent them by their braces (and tags for HTML)
const INDENT_LANGS = new Set(['c', 'cpp', 'java', 'html'])

// Tags that never have a closing tag
const VOID_TAGS = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr|!doctype)$/i

function nesting(line, lang) {
  let opens = (line.match(/{/g) || []).length
  let closes = (line.match(/}/g) || []).length
  let leadingCloses = line.match(/^}+/)?.[0].length ?? 0
  if (lang === 'html') {
    for (const [, slash, name] of line.matchAll(/<(\/?)([a-z!][a-z0-9]*)/gi)) {
      if (slash) closes++
      else if (!VOID_TAGS.test(name)) opens++
    }
    if (/^<\//.test(line)) leadingCloses++
  }
  return { change: opens - closes, leadingCloses }
}

function autoIndent(lines, lang) {
  let depth = 0
  return lines.map((raw) => {
    const line = raw.trim()
    if (!line) return ''
    const { change, leadingCloses } = nesting(line, lang)
    const level = Math.max(0, depth - leadingCloses)
    depth = Math.max(0, depth + change)
    return '  '.repeat(level) + line
  })
}

// Some original lines were missing their <br> around comments, so the browser ran them
// into one line (e.g. `// note printf(...)`, which comments out the printf). Put each
// comment on its own line again: break after a line comment or `*/`, and before a comment.
const LINE_COMMENT = { matlab: '%', python: '#' }

function splitAfterComments(segment, lang) {
  const marker = LINE_COMMENT[lang] ?? '//'
  const parts = segment.split('\n')
  const out = [parts[0]]
  for (let i = 1; i < parts.length; i++) {
    const prev = parts[i - 1].trim()
    const cur = parts[i].trim()
    const hasContent = out[out.length - 1].trim() !== ''
    const breakHere =
      cur && hasContent && (prev.startsWith(marker) || prev.endsWith('*/') || cur.startsWith(marker) || cur.startsWith('/*'))
    if (breakHere) out.push(parts[i])
    else out[out.length - 1] += '\n' + parts[i]
  }
  return out
}

function codeFromBox(box, lang) {
  const segments = box.innerHTML.split(/<br\s*\/?>/i).flatMap((segment) => splitAfterComments(segment, lang))
  let lines = segments.map((segment) => {
    // Same whitespace rules the browser used when it rendered the page
    const text = decode(segment.replace(/\s+/g, ' ')).replace(/^ +| +$/g, '')
    // Leading non-breaking spaces were the original indentation: 2 spaces each
    return text.replace(/^\u00a0+/, (m) => '  '.repeat(m.length)).replace(/\u00a0/g, ' ')
  })

  // Trim blank lines at the start and end
  while (lines.length && !lines[0].trim()) lines.shift()
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop()

  const alreadyIndented = lines.filter((l) => /^\s/.test(l)).length > lines.length * 0.1
  if (INDENT_LANGS.has(lang) && !alreadyIndented) lines = autoIndent(lines, lang)
  return lines.join('\n')
}

// Some boxes hold several separate codes. Split them into sections:
//  - a comment that is just a file name (`#server.py`, `#client.py`) starts that file
//  - in MATLAB, a `%` comment followed by a fresh `syms` line starts a new part
//    (e.g. "%Analytical solution" after the numerical one); setup lines at the top don't count
const FILE_COMMENT = /^\s*(?:#|\/\/|%)\s*([\w.-]+\.(?:py|java|c|cpp|h|html|css|js|m))\s*$/i

function splitSections(code, lang) {
  const lines = code.split('\n')
  const isSetup = (l) => /^\s*(%.*|clc;?|clear( all)?;?|close( all)?;?)?\s*$/.test(l)
  const sections = [{ title: '', lines: [] }]
  lines.forEach((line, i) => {
    const current = sections[sections.length - 1]
    const hasCode = current.lines.some((l) => l.trim())
    const file = line.match(FILE_COMMENT)?.[1]
    if (file) {
      // The file name becomes the box title; an empty section before it is reused
      if (hasCode) sections.push({ title: file, file: true, lines: [] })
      else Object.assign(current, { title: file, file: true })
      return
    }
    const startsPart = lang === 'matlab' && /^\s*%/.test(line) && /^\s*syms\s/.test(lines[i + 1] || '')
    if (startsPart && current.lines.some((l) => !isSetup(l))) {
      const title = line.replace(/^\s*%+\s*/, '')
      sections.push({ title: title.charAt(0).toUpperCase() + title.slice(1), lines: [] })
      return
    }
    current.lines.push(line)
  })
  return sections
    .map((sec) => ({ title: sec.title, file: !!sec.file, code: sec.lines.join('\n').replace(/^\n+|\s+$/g, '') }))
    .filter((sec) => sec.code)
}

// Returns [{ heading, code, sections }]; most programs have one block, a few have two or three.
// `sections` is the block's code split into separate parts (usually just one).
export function parseProgram(html, lang) {
  if (!parser) return []
  const doc = parser.parseFromString(html, 'text/html')
  return [...doc.querySelectorAll('.code-box')].map((box) => {
    // The heading is the closest <h1> before this box
    let heading = ''
    for (let el = box.previousElementSibling; el; el = el.previousElementSibling) {
      if (el.tagName === 'H1') {
        heading = el.textContent.replace(/\s+/g, ' ').trim()
        break
      }
    }
    const code = codeFromBox(box, lang)
    return { heading, code, sections: splitSections(code, lang) }
  })
}
