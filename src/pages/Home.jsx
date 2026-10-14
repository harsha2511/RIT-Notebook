import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Page from '../components/Page.jsx'
import '../styles/pages/home.css'

const PYQ_URL = 'https://drive.google.com/drive/folders/1FDy6mEK5kV3Jost-dsjdoZUoTHowq2om'

const LINKS = [
  { label: 'PYQ', href: PYQ_URL, highlight: true },
  { label: 'Syllabus', href: 'https://drive.google.com/drive/folders/19prQwverKqHyobWdGh9p3NwH1JuJ3JLi?usp=sharing' },
  { label: 'Lab Codes', to: '/labcodes.html' },
  { label: 'Maths Question Bank', to: '/mathqb.html' },
  { label: 'Skill Lab', href: 'https://drive.google.com/drive/folders/1O4-m1DGQ2zJWmIDqdfHgLX08Dnjq9qDn?usp=sharing' },
  {
    label: 'Open Electives',
    href: 'https://drive.google.com/drive/folders/1XPO8h-Mv1WWj_qreA-3DqtoAdAP3W_yC?usp=sharing',
    id: 'openElectives',
    featured: true,
  },
  { label: 'Upload Here', href: 'https://drive.google.com/drive/folders/1_XJvCLOO_9g4QEgiO_fBZCtdfxWhZdNC?usp=sharing' },
  { label: 'RIT Codes', href: 'https://ritcode.pages.dev/' },
  { label: 'Contact', href: 'mailto:labcodesandnotes@gmail.com' },
]

const YEARS = [
  { title: 'First Year', note: 'Physics & Chemistry cycle, all streams', img: '/images/1styr.png', to: '/notes/first.html' },
  { title: 'Second Year', note: 'Branch-wise notes for 3rd & 4th sem', img: '/images/2ndyr.png', to: '/notes/second.html' },
  { title: 'Third Year', note: 'Branch-wise notes for 5th & 6th sem', img: '/images/3rdyr.png', to: '/notes/third.html' },
  { title: 'Fourth Year', note: 'Branch-wise notes for 7th & 8th sem', img: '/images/4thyr.png', to: '/notes/fourth.html' },
]

// Words typed out, one after another, in the header tagline
const TYPED_WORDS = ['notes', 'PYQs', 'lab codes', 'question banks', 'syllabus']

// Study doodles floating up behind the header: [emoji, left %, duration s, delay s, size px]
const FLOATERS = [
  ['📘', 6, 16, 0, 26],
  ['✏️', 18, 12, -5, 22],
  ['📐', 30, 18, -9, 24],
  ['💡', 70, 14, -2, 24],
  ['🧪', 82, 17, -11, 22],
  ['📝', 92, 13, -7, 26],
  ['🎓', 58, 19, -14, 22],
  ['💻', 42, 15, -12, 20],
]

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function TypedWord() {
  const [text, setText] = useState(TYPED_WORDS[0])
  useEffect(() => {
    if (reducedMotion()) return
    let word = 0
    let len = TYPED_WORDS[0].length
    let deleting = true
    let timer
    const tick = () => {
      if (deleting) {
        len -= 1
        if (len === 0) {
          deleting = false
          word = (word + 1) % TYPED_WORDS.length
        }
      } else {
        len += 1
      }
      setText(TYPED_WORDS[word].slice(0, len))
      let wait = deleting ? 45 : 90
      if (!deleting && len === TYPED_WORDS[word].length) {
        deleting = true
        wait = 1800
      }
      timer = setTimeout(tick, wait)
    }
    timer = setTimeout(tick, 2200)
    return () => clearTimeout(timer)
  }, [])
  return (
    <span className="typed">
      {text}
      <span className="caret" aria-hidden="true" />
    </span>
  )
}

// Pointer position inside an element, as CSS variables, for the spotlight and tilt effects
function trackPointer(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
  el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
  el.style.setProperty('--rx', `${((0.5 - y) * 10).toFixed(2)}deg`)
  el.style.setProperty('--ry', `${((x - 0.5) * 12).toFixed(2)}deg`)
}

function resetTilt(e) {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}

export default function Home() {
  return (
    <Page name="home">
      <header className="home-hero" onPointerMove={trackPointer}>
        {/* Soft glowing shapes drifting behind the header */}
        <span className="hero-orb orb-1" aria-hidden="true" />
        <span className="hero-orb orb-2" aria-hidden="true" />
        <span className="hero-orb orb-3" aria-hidden="true" />
        {FLOATERS.map(([emoji, x, dur, delay, size]) => (
          <span
            key={emoji}
            className="floater"
            aria-hidden="true"
            style={{ '--x': `${x}%`, '--dur': `${dur}s`, '--delay': `${delay}s`, '--size': `${size}px` }}
          >
            {emoji}
          </span>
        ))}
        <img src="/images/logo.png" alt="RIT Notebook logo" className="home-logo" />
        <h1>RIT Notebook</h1>
        <p className="tagline">
          Your one stop for <TypedWord />
        </p>
        <p>
          Hey there, academic adventurers! Dive into our web oasis—it's like the cheat code to surviving
          college. We've got notes, past questions, and the secret sauce to ace exams without losing your
          sanity. Join the chill side of learning.
        </p>
        <div className="quick-links">
          {LINKS.map((l, i) => {
            const cls = `quick-link${l.featured ? ' featured' : ''}${l.highlight ? ' highlight' : ''}`
            // --i staggers the pop-in animation
            const style = { '--i': i }
            if (l.to) return <Link key={l.label} to={l.to} className={cls} style={style}>{l.label}</Link>
            const external = l.href.startsWith('http')
            return (
              <a
                key={l.label}
                id={l.id}
                href={l.href}
                className={cls}
                style={style}
                {...(external && { target: '_blank', rel: 'noreferrer' })}
              >
                {l.label}
              </a>
            )
          })}
        </div>
      </header>

      <main className="home">
        <a className="pyq-banner" href={PYQ_URL} target="_blank" rel="noreferrer">
          <span className="pyq-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 3h7l5 5v13H7z" />
              <path d="M14 3v5h5M10 13h6M10 17h6" />
            </svg>
          </span>
          <span className="pyq-text">
            <span className="pyq-tag">PYQ</span>
            <strong>Previous Year Question Papers</strong>
            <small>Past exam papers to practise before your exams, all in one folder.</small>
          </span>
          <span className="pyq-btn">
            Open PYQs <span aria-hidden="true">↗</span>
          </span>
        </a>

        <section className="notes-card">
          <div className="notes-head">
            <h2>Notes by year</h2>
            <p>Choose your year to find notes for your branch.</p>
          </div>
          <div className="year-grid">
            {YEARS.map((y, i) => (
              <Link key={y.to} to={y.to} className="year-tile" style={{ '--i': i }} onPointerMove={trackPointer} onPointerLeave={resetTilt}>
                <div className="year-img">
                  <img src={y.img} alt="" />
                </div>
                <h3>{y.title}</h3>
                <p>{y.note}</p>
                <span className="year-btn">View notes <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Page>
  )
}
