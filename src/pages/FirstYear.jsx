import { useSearchParams } from 'react-router-dom'
import Page from '../components/Page.jsx'
import YearTabs, { NotesSwap } from '../components/YearTabs.jsx'
import firstYear from '../data/firstYear.js'
import '../styles/pages/first.css'

// URL slug and short label for each stream (keyed by the section id in the data)
const STREAM_META = {
  section1: { slug: 'cse', short: 'Computer Science' },
  section2: { slug: 'eee', short: 'Electrical & Electronics' },
  section3: { slug: 'civil', short: 'Civil' },
  section4: { slug: 'mech', short: 'Mechanical' },
}

const streams = firstYear.map((s) => ({
  ...s,
  slug: STREAM_META[s.id]?.slug ?? s.id,
  short: STREAM_META[s.id]?.short ?? s.name,
}))

export default function FirstYear() {
  // The selected stream lives in the URL (?stream=civil) so refresh and Back keep it
  const [params, setParams] = useSearchParams()
  const selected = streams.find((s) => s.slug === params.get('stream')) ?? streams[0]

  const select = (stream) => setParams({ stream: stream.slug }, { replace: true })

  return (
    <Page name="first" title="First Year Notes">
      <header className="page-hero">
        <h1>First Year Notes</h1>
        <p>Pick your stream, then open any subject to view its notes on Google Drive.</p>
      </header>

      <YearTabs />

      <NotesSwap className="stream-layout">
        <aside className="stream-nav" aria-label="Streams">
          <h2 className="stream-nav-title">Streams</h2>
          <ul>
            {streams.map((stream) => {
              const active = stream.slug === selected.slug
              return (
                <li key={stream.slug}>
                  <button
                    type="button"
                    className={`stream-btn${active ? ' active' : ''}`}
                    aria-pressed={active}
                    onClick={() => select(stream)}
                  >
                    <span className="stream-btn-name">{stream.short}</span>
                    <span className="stream-btn-branches">{stream.branches}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <section className="content-section" aria-live="polite">
          {/* key: picking another stream replays the content animation */}
          <div className="heading-box" key={selected.slug}>
            <h2>{selected.name}</h2>
            <p>{selected.branches}</p>
            <div className="box">
              {selected.cycles.map((cycle, c) => (
                <div
                  key={cycle.name}
                  className={`inner-box${cycle.name.startsWith('Chemistry') ? ' chem' : ''}`}
                  style={{ '--c': c }}
                >
                  <h3>{cycle.name}</h3>
                  <ul>
                    {cycle.subjects.map((subject, i) => (
                      <li key={subject.label} style={{ '--i': i }}>
                        <a href={subject.href} target="_blank" rel="noreferrer">{subject.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </NotesSwap>
    </Page>
  )
}
