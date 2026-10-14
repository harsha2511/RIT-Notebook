import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Page from '../components/Page.jsx'
import labIndex from '../data/labIndex.js'
import labSubjects from '../data/labSubjects.js'
import '../styles/pages/code.css'

const subjectImage = Object.fromEntries(labIndex.flatMap((y) => y.items).map((i) => [i.href, i.img]))
const programCount = Object.fromEntries(labSubjects.map((s) => [s.path, s.items.length]))

// Year that holds a subject page, so its group starts open in the sidebar
const yearOf = (path) => labIndex.find((year) => year.items.some((i) => i.href === path))?.title

// Sidebar: every subject, grouped by year. Each year is a dropdown; the current subject's
// year starts open. Subjects that are only Google Drive folders open in a new tab.
function SubjectNav({ current }) {
  const navRef = useRef(null)
  const [open, setOpen] = useState(() => new Set([yearOf(current)]))
  const [openedFor, setOpenedFor] = useState(current)
  // Another subject was picked: show its year
  if (openedFor !== current) {
    setOpenedFor(current)
    setOpen(new Set([yearOf(current)]))
  }

  const toggle = (title) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })

  // Fit the sidebar between its current top and the bottom of the window, so its last subject
  // is never cut off before it sticks under the navbar (it starts lower, below the header)
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const fit = () => {
      const top = Math.max(nav.getBoundingClientRect().top, 0)
      nav.style.setProperty('--nav-max', `${window.innerHeight - top - 16}px`)
    }
    fit()
    window.addEventListener('scroll', fit, { passive: true })
    window.addEventListener('resize', fit)
    return () => {
      window.removeEventListener('scroll', fit)
      window.removeEventListener('resize', fit)
    }
  }, [])

  // On phones the sidebar is a sideways-scrolling row: keep the current subject in view
  useEffect(() => {
    const nav = navRef.current
    const active = nav?.querySelector('.subject-link.active')
    if (!nav || !active || nav.scrollWidth <= nav.clientWidth) return
    nav.scrollTo({ left: active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2 })
  }, [current])

  return (
    <aside className="subject-nav" aria-label="Lab subjects" ref={navRef}>
      <Link to="/labcodes.html" className="crumb">← All lab codes</Link>
      {labIndex.map((year) => {
        const isOpen = open.has(year.title)
        const listId = `subjects-${year.title.replace(/\W+/g, '-')}`
        return (
          <div key={year.title} className={`subject-group${isOpen ? ' open' : ''}`}>
            <h2 className="subject-nav-title">
              <button
                type="button"
                className="subject-year"
                aria-expanded={isOpen}
                aria-controls={listId}
                onClick={() => toggle(year.title)}
              >
                <span>{year.title}</span>
                <span className="subject-year-count">{year.items.length}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h2>
            {isOpen && (
              <ul id={listId}>
                {year.items.map((item) => (
                  <li key={item.href}>
                    {programCount[item.href] ? (
                      <NavLink to={item.href} className="subject-link">
                        <img src={item.img} alt="" />
                        <span className="subject-name">{item.name}</span>
                        <span className="subject-count">{programCount[item.href]}</span>
                      </NavLink>
                    ) : (
                      <a href={item.href} className="subject-link" target="_blank" rel="noreferrer" title={`${item.name} (Google Drive)`}>
                        <img src={item.img} alt="" />
                        <span className="subject-name">{item.name}</span>
                        <span className="subject-ext" aria-label="opens Google Drive">↗</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </aside>
  )
}

export default function SubjectCodes({ subject }) {
  const [query, setQuery] = useState('')
  const [searchedSubject, setSearchedSubject] = useState(subject.path)
  // Start with an empty search when another subject is picked from the sidebar
  if (searchedSubject !== subject.path) {
    setSearchedSubject(subject.path)
    setQuery('')
  }

  // Keep each program's original number while filtering
  const programs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return subject.items
      .map((item, i) => ({ ...item, n: i + 1 }))
      .filter((item) => !q || item.label.toLowerCase().includes(q))
  }, [subject, query])

  const img = subjectImage[subject.path]

  return (
    <Page name="code" title={subject.title}>
      <header className="page-hero">
        <div className="hero-row">
          {img && <img src={img} alt="" className="hero-icon" />}
          <div>
            <h1>{subject.title}</h1>
            <p>{subject.items.length} programs with full code</p>
          </div>
        </div>
        {subject.pdf && (
          <a className="pdf-btn" href={subject.pdf.href} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 19h16" />
            </svg>
            {subject.pdf.label}
          </a>
        )}
      </header>

      <div className="codes-layout">
        <SubjectNav current={subject.path} />

        <main className="codes">
          <section className="codes-card">
            <div className="codes-head">
              <h2>Programs</h2>
              <label className="search">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="m16 16 4 4" />
                </svg>
                <input
                  type="search"
                  placeholder="Search programs"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search programs"
                />
              </label>
            </div>

            {programs.length ? (
              <ol className="program-list">
                {programs.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="program">
                      <span className="program-n">{item.n}</span>
                      <span className="program-name">{item.label}</span>
                      <span className="program-go" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="empty">No programs match “{query}”.</p>
            )}
          </section>
        </main>
      </div>
    </Page>
  )
}
