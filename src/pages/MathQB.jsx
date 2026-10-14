import { useEffect, useState } from 'react'
import Page from '../components/Page.jsx'
import mathQB from '../data/mathQB.js'
import '../styles/pages/mathqb.css'

// Paper codes start with MA + a stream letter: C(S), E(lectrical), M(echanical), V (civil)
const STREAMS = {
  C: { name: 'Computer Science', tone: 'cs' },
  E: { name: 'Electrical & Electronics', tone: 'ee' },
  M: { name: 'Mechanical & Chemical', tone: 'me' },
  V: { name: 'Civil', tone: 'cv' },
}

const semId = (i) => `sem${i + 1}`
const SEM_IDS = mathQB.map((_, i) => semId(i))

function scrollToSemester(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

// Tracks which semester is on screen, to highlight it in the sidebar
function useActiveSemester() {
  const [active, setActive] = useState(SEM_IDS[0])

  useEffect(() => {
    const onScroll = () => {
      // The active semester is the last one whose top has passed the upper third of the screen
      const line = window.innerHeight / 3
      let current = SEM_IDS[0]
      for (const id of SEM_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      // The last semester can't scroll up that far; at the bottom of the page it's the active one
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) current = SEM_IDS[SEM_IDS.length - 1]
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return [active, setActive]
}

export default function MathQB() {
  const [activeId, setActiveId] = useActiveSemester()

  return (
    <Page name="mathqb" title="Maths Question Bank">
      <header className="page-hero">
        <h1>Maths Question Bank</h1>
        <p>Question banks for every semester. Find your paper code and open it on Google Drive.</p>
      </header>

      <div className="qb-layout">
        <aside className="sem-nav" aria-label="Semesters">
          <h2 className="sem-nav-title">Semesters</h2>
          <ul>
            {mathQB.map((sem, i) => {
              const id = semId(i)
              const active = id === activeId
              return (
                <li key={sem.title}>
                  <button
                    type="button"
                    className={`sem-btn${active ? ' active' : ''}`}
                    aria-current={active ? 'true' : undefined}
                    onClick={() => {
                      setActiveId(id)
                      scrollToSemester(id)
                    }}
                  >
                    <span className="sem-btn-name">{sem.title}</span>
                    <span className="sem-btn-codes">{sem.papers.map((p) => p.code).join(' · ')}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <main className="sem-list">
          {mathQB.map((sem, i) => (
            <section key={sem.title} id={semId(i)} className="sem-card">
              <h2>{sem.title}</h2>
              <div className="paper-grid">
                {sem.papers.map((paper) => {
                  const stream = STREAMS[paper.code[2]] ?? { name: '', tone: 'cs' }
                  return (
                    <article key={paper.code} className={`paper tone-${stream.tone}`}>
                      <div className="paper-head">
                        <span className="paper-code">{paper.code}</span>
                        <span className="paper-stream">{stream.name}</span>
                      </div>
                      <ul className="branch-tags" aria-label="Branches">
                        {paper.branches.split(',').map((b) => (
                          <li key={b.trim()}>{b.trim()}</li>
                        ))}
                      </ul>
                      <a className="paper-btn" href={paper.href} target="_blank" rel="noreferrer">
                        View papers <span aria-hidden="true">↗</span>
                      </a>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </main>
      </div>
    </Page>
  )
}
