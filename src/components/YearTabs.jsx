import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import './YearTabs.css'
import '../styles/notes-motion.css'

const YEARS = [
  { to: '/notes/first.html', label: '1st Year' },
  { to: '/notes/second.html', label: '2nd Year' },
  { to: '/notes/third.html', label: '3rd Year' },
  { to: '/notes/fourth.html', label: '4th Year' },
]

// Which way the next notes page slides in: 'next' (from the right) or 'prev' (from the left).
// Only counts for the page that opens right after; read once when that page's content mounts,
// so its animation never changes (and restarts) part-way through.
let pending = null

function setDirection(dir) {
  pending = { dir, at: Date.now() }
}

// No year further that way: give the current content a small shake
function shakeContent() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.querySelector('.notes-swap')?.animate(
    [{ transform: 'none' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(-4px)' }, { transform: 'none' }],
    { duration: 400, easing: 'ease' },
  )
}

// Content wrapper for a notes page: slides in from the side the student swiped/clicked towards
export function NotesSwap({ as: Tag = 'div', className = '', children }) {
  const [dir] = useState(() => (pending && Date.now() - pending.at < 1000 ? pending.dir : null))
  return <Tag className={`notes-swap${dir ? ` from-${dir}` : ''} ${className}`}>{children}</Tag>
}

// Swipes that start here belong to something else (sideways-scrolling rows, the menu, fields)
const NO_SWIPE = '.stream-nav, .year-tabs, .site-nav, input, textarea, select'

// Swipe left/right anywhere on a notes page to go to the next/previous year
function useYearSwipe(index) {
  const navigate = useNavigate()
  useEffect(() => {
    let start = null
    const onStart = (e) => {
      const t = e.touches[0]
      start = e.touches.length === 1 && !e.target.closest(NO_SWIPE) ? { x: t.clientX, y: t.clientY, at: Date.now() } : null
    }
    const onEnd = (e) => {
      if (!start) return
      const t = e.changedTouches[0]
      const dx = t.clientX - start.x
      const dy = t.clientY - start.y
      const quick = Date.now() - start.at < 700
      start = null
      if (!quick || Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.6) return
      const target = index + (dx < 0 ? 1 : -1)
      if (target < 0 || target >= YEARS.length) {
        shakeContent()
        return
      }
      setDirection(dx < 0 ? 'next' : 'prev')
      navigate(YEARS[target].to)
    }
    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchend', onEnd)
    }
  }, [index, navigate])
}

// Tabs drop in only the first time they appear; switching years keeps them still
let tabsShown = false

// Year switcher shown under the header of every notes page
export default function YearTabs() {
  const { pathname } = useLocation()
  const index = YEARS.findIndex((y) => y.to === pathname)
  useYearSwipe(index)
  const [intro] = useState(() => !tabsShown)
  useEffect(() => {
    tabsShown = true
  }, [])

  return (
    <>
      <nav className={`year-tabs${intro ? ' intro' : ''}`} aria-label="Year">
        {YEARS.map((y, i) => (
          <NavLink
            key={y.to}
            to={y.to}
            className={({ isActive }) => `year-tab${isActive ? ' active' : ''}`}
            style={{ '--i': i }}
            onClick={() => i !== index && setDirection(i > index ? 'next' : 'prev')}
          >
            {y.label}
          </NavLink>
        ))}
      </nav>
      {intro && (
        <p className="swipe-hint" aria-hidden="true">
          <span className="swipe-hand">👆</span> Swipe left or right to change year
        </p>
      )}
    </>
  )
}
