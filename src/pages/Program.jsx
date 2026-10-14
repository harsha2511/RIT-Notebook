import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Page from '../components/Page.jsx'
import NotFound from './NotFound.jsx'
import programs from '../data/programs.js'
import labSubjects from '../data/labSubjects.js'
import labIndex from '../data/labIndex.js'
import { languageFor } from '../data/labLanguages.js'
import { parseProgram } from '../utils/parseProgram.js'
import '../styles/pages/program.css'

// The Clipboard API needs HTTPS (or localhost) and page focus; fall back to the older copy command
function legacyCopy(text) {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const ok = document.execCommand('copy')
  area.remove()
  return ok
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      ok = legacyCopy(text)
    }
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }
  }
  return (
    <button type="button" className={`copy-btn${copied ? ' done' : ''}`} onClick={copy}>
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

function CodePanel({ code, lang, fileName }) {
  const lines = code.split('\n')
  return (
    <div className="code-panel">
      <div className="code-bar">
        <span className="dots" aria-hidden="true"><i /><i /><i /></span>
        {/* A file's name shows like an editor tab; otherwise just the language */}
        {fileName ? (
          <span className="code-file">
            {fileName} <small>{lang.label}</small>
          </span>
        ) : (
          <span className="code-lang">{lang.label}</span>
        )}
        <CopyButton text={code} />
      </div>
      <pre className="code">
        <code>
          {lines.map((line, i) => (
            // Each line is its own row so the line numbers (CSS counters) stay aligned
            <span key={i} className="line">{line || ' '}</span>
          ))}
        </code>
      </pre>
    </div>
  )
}

// One code, or several boxes when the code has separate parts (each with its own Copy)
function CodeBlock({ block, lang, id, labelledBy }) {
  return (
    <section className="code-block" id={id} role={labelledBy ? 'tabpanel' : undefined} aria-labelledby={labelledBy}>
      {block.sections.map((section, i) => (
        <div key={i} className="code-part">
          {section.title && !section.file && <h2 className="part-title">{section.title}</h2>}
          <CodePanel code={section.code} lang={lang} fileName={section.file ? section.title : ''} />
        </div>
      ))}
    </section>
  )
}

// Names for the tabs of a program with alternative versions: a long first heading is the
// question itself, usually followed by a "With CSS" version.
function tabLabels(blocks) {
  const short = (h) => h && h.length <= 70
  const hasWithCss = blocks.some((b, i) => i > 0 && /^with css$/i.test(b.heading))
  const labels = blocks.map((b, i) => {
    if (/^with css$/i.test(b.heading)) return 'With CSS'
    if (i === 0 && hasWithCss) return 'Without CSS'
    return short(b.heading) ? b.heading : `Code ${i + 1}`
  })
  // Same heading twice: number the repeats
  return labels.map((label, i) => {
    const before = labels.slice(0, i).filter((l) => l === label).length
    return before ? `${label} (method ${before + 1})` : label
  })
}

// A program made of related parts (e.g. Taylor series in 1 variable, 2 variables, plot):
// every part as its own box under a heading. The original pages repeat some parts inside
// later boxes, so codes that match apart from spacing are shown once.
function AllParts({ blocks, lang }) {
  const seen = new Set()
  const parts = []
  for (const block of blocks) {
    for (const section of block.sections) {
      const key = section.code.replace(/\s+/g, '')
      if (seen.has(key)) continue
      seen.add(key)
      parts.push({ ...section, title: section.title || block.heading })
    }
  }
  // Same heading for different code: number the repeats
  const titles = parts.map((part, i) => {
    const before = parts.slice(0, i).filter((p) => p.title === part.title).length
    return before ? `${part.title} (method ${before + 1})` : part.title
  })

  return (
    <section className="code-block">
      {parts.map((part, i) => (
        <div key={i} className="code-part">
          <h2 className="part-title">{titles[i]}</h2>
          <CodePanel code={part.code} lang={lang} fileName={part.file ? part.title : ''} />
        </div>
      ))}
    </section>
  )
}

// One code; all parts with headings; or tabs for alternative versions (Without / With CSS)
function ProgramCode({ blocks, lang, allParts }) {
  const [active, setActive] = useState(0)
  if (blocks.length < 2) return blocks.map((block, i) => <CodeBlock key={i} block={block} lang={lang} />)
  if (allParts) return <AllParts blocks={blocks} lang={lang} />

  const labels = tabLabels(blocks)
  const onKeyDown = (e) => {
    // Arrow keys move between tabs
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    const nextIndex = (active + step + blocks.length) % blocks.length
    setActive(nextIndex)
    document.getElementById(`code-tab-${nextIndex}`)?.focus()
  }

  return (
    <>
      <div className="code-tabs" role="tablist" aria-label="Versions of this program" onKeyDown={onKeyDown}>
        {labels.map((label, i) => (
          <button
            key={i}
            id={`code-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`code-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className={`code-tab${i === active ? ' active' : ''}`}
            onClick={() => setActive(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <CodeBlock
        key={active}
        block={blocks[active]}
        lang={lang}
        id={`code-panel-${active}`}
        labelledBy={`code-tab-${active}`}
      />
    </>
  )
}

const subjectImage = Object.fromEntries(labIndex.flatMap((y) => y.items).map((i) => [i.href, i.img]))

// Every program of the current subject, so students can jump between them
function ProgramSidebar({ subject, current }) {
  const listRef = useRef(null)

  // Scroll the list (not the page) so the current program is visible
  useEffect(() => {
    const list = listRef.current
    const active = list?.querySelector('.side-program.active')
    if (!list || !active) return
    const top = active.offsetTop - list.clientHeight / 2 + active.offsetHeight / 2
    list.scrollTo({ top: Math.max(0, top) })
  }, [current])

  return (
    <aside className="program-side" aria-label={`${subject.title} programs`}>
      <Link to={subject.path} className="side-back">
        <span aria-hidden="true">←</span> Back to {subject.title}
      </Link>
      <Link to={subject.path} className="side-subject">
        {subjectImage[subject.path] && <img src={subjectImage[subject.path]} alt="" />}
        <span>
          <strong>{subject.title}</strong>
          <small>{subject.items.length} programs</small>
        </span>
      </Link>
      <ol className="side-list" ref={listRef}>
        {subject.items.map((item, i) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={`side-program${item.to === current ? ' active' : ''}`}
              aria-current={item.to === current ? 'page' : undefined}
            >
              <span className="side-n">{i + 1}</span>
              <span className="side-name">{item.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  )
}

export default function Program() {
  const { folder, file } = useParams()
  const path = `/labcodes/${folder}/${file}`
  const program = programs[path]

  const lang = languageFor(folder, program?.html)
  const blocks = useMemo(() => (program ? parseProgram(program.html, lang.key) : []), [program, lang.key])

  if (!program) return <NotFound />

  const subject = labSubjects.find((s) => s.items.some((item) => item.to === path))
  const index = subject ? subject.items.findIndex((item) => item.to === path) : -1
  const prev = index > 0 ? subject.items[index - 1] : null
  const next = subject && index < subject.items.length - 1 ? subject.items[index + 1] : null

  const item = subject?.items[index]
  // A long first heading is the question; when every heading is short they are parts of
  // one program (all shown with headings), so the list name is the better title
  const versions = blocks.length > 1 && blocks.every((b) => b.heading.length <= 70)
  const question = (versions ? item?.label : blocks[0]?.heading) || program.title
  // Pages that list parts with headings start below the header so the first heading isn't on it
  const startsWithHeading = versions || Boolean(blocks.length === 1 && blocks[0].sections[0]?.title && !blocks[0].sections[0].file)

  return (
    <Page name="program" title={item?.label || program.title}>
      <header className={`program-hero${startsWithHeading ? ' has-heading-below' : ''}`}>
        <div className="program-hero-inner">
          {subject && (
            // Phones and tablets only; on wider screens it is at the top of the sidebar
            <Link to={subject.path} className="back-btn">
              <span aria-hidden="true">←</span> Back to {subject.title}
            </Link>
          )}
          {subject && (
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/labcodes.html">Lab Codes</Link>
              <span aria-hidden="true">/</span>
              <Link to={subject.path}>{subject.title}</Link>
            </nav>
          )}
          {subject && (
            <span className="program-count">
              Program {index + 1} of {subject.items.length} · {lang.label}
            </span>
          )}
          <h1>{question}</h1>
        </div>
      </header>

      <div className={`program-layout${startsWithHeading ? ' starts-with-heading' : ''}`}>
        {subject && <ProgramSidebar subject={subject} current={path} />}

        <main className="program-main">
          {/* key: start on the first tab again when moving to another program */}
          <ProgramCode key={path} blocks={blocks} lang={lang} allParts={versions} />

          {lang.key === 'html' && (
            <p className="code-tip">
              Tip: save the code as a <code>.html</code> file and open it in your browser to see the page.
            </p>
          )}

          {subject && (
            <nav className="pager" aria-label="More programs">
              {prev ? (
                <Link to={prev.to} className="pager-link prev">
                  <span className="pager-dir">← Previous</span>
                  <span className="pager-name">{prev.label}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link to={next.to} className="pager-link next">
                  <span className="pager-dir">Next →</span>
                  <span className="pager-name">{next.label}</span>
                </Link>
              ) : (
                <Link to={subject.path} className="pager-link next">
                  <span className="pager-dir">Done ✓</span>
                  <span className="pager-name">Back to {subject.title}</span>
                </Link>
              )}
            </nav>
          )}
        </main>
      </div>
    </Page>
  )
}
