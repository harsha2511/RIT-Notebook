import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import './Navbar.css'

const NOTES = [
  { to: '/notes/first.html', label: 'First Year' },
  { to: '/notes/second.html', label: 'Second Year' },
  { to: '/notes/third.html', label: 'Third Year' },
  { to: '/notes/fourth.html', label: 'Fourth Year' },
]

const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const notesRef = useRef(null)
  const { pathname } = useLocation()

  // Close menus whenever the page changes
  useEffect(() => {
    setMenuOpen(false)
    setNotesOpen(false)
  }, [pathname])

  // Close the Notes dropdown on outside click or Escape
  useEffect(() => {
    if (!notesOpen) return
    const onClick = (e) => {
      if (notesRef.current && !notesRef.current.contains(e.target)) setNotesOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setNotesOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [notesOpen])

  const onNotesPage = pathname.startsWith('/notes/')

  return (
    <header className="site-nav">
      <nav className="site-nav__bar" aria-label="Main">
        <Link to="/" className="site-nav__brand">
          <img src="/images/logo.png" alt="" />
          <span>RIT Notebook</span>
        </Link>

        <div className="site-nav__actions">
          <ThemeToggle />
          <button
            type="button"
            className="site-nav__toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-nav-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <ul id="site-nav-menu" className={`site-nav__menu${menuOpen ? ' open' : ''}`}>
          <li>
            <NavLink to="/" end className={navClass}>Home</NavLink>
          </li>
          <li className={`site-nav__dropdown${notesOpen ? ' open' : ''}`} ref={notesRef}>
            <button
              type="button"
              className={`nav-link${onNotesPage ? ' active' : ''}`}
              aria-expanded={notesOpen}
              onClick={() => setNotesOpen((o) => !o)}
            >
              Notes
              <svg className="caret" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <ul className="site-nav__submenu">
              {NOTES.map((n, i) => (
                <li key={n.to} style={{ '--i': i }}>
                  <NavLink to={n.to} className={navClass}>
                    <span className="year-badge" aria-hidden="true">{i + 1}</span>
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <NavLink to="/labcodes.html" className={navClass}>Lab Codes</NavLink>
          </li>
          <li>
            <NavLink to="/mathqb.html" className={navClass}>Maths QB</NavLink>
          </li>
          <li>
            <NavLink to="/about.html" className={navClass}>About</NavLink>
          </li>
          <li>
            <a href="https://ritcode.pages.dev/" target="_blank" rel="noreferrer" className="nav-link">
              RIT Codes
              <svg className="ext-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 16 16 8M9 8h7v7" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
