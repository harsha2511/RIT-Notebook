import { Link } from 'react-router-dom'
import Page from '../components/Page.jsx'
import labIndex from '../data/labIndex.js'
import labSubjects from '../data/labSubjects.js'
import '../styles/pages/lab.css'

const programCount = Object.fromEntries(labSubjects.map((s) => [s.path, s.items.length]))

function SubjectTile({ item }) {
  const external = item.href.startsWith('http')
  const body = (
    <>
      <div className="tile-img">
        <img src={item.img} alt="" loading="lazy" />
      </div>
      <h3 title={item.name}>{item.name}</h3>
      <p className="tile-meta">
        {external ? 'Google Drive folder' : `${programCount[item.href] ?? 0} programs`}
      </p>
      <span className="tile-btn">
        View <span aria-hidden="true">{external ? '↗' : '→'}</span>
      </span>
    </>
  )

  return external ? (
    <a className="tile" href={item.href} target="_blank" rel="noreferrer">{body}</a>
  ) : (
    <Link className="tile" to={item.href}>{body}</Link>
  )
}

export default function LabCodes() {
  return (
    <Page name="lab" title="Lab Codes">
      <header className="page-hero">
        <h1>Lab Codes</h1>
        <p>Lab programs with full code for every subject. Pick your year and subject to get started.</p>
      </header>

      <main className="lab">
        {labIndex.map((year) => (
          <section key={year.title} className="year-card">
            <div className="year-head">
              <h2>{year.title}</h2>
              <span className="year-count">{year.items.length} subjects</span>
            </div>
            <div className="tile-grid">
              {year.items.map((item) => (
                <SubjectTile key={item.name} item={item} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </Page>
  )
}
