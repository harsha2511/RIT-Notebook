import Page from '../components/Page.jsx'
import YearTabs, { NotesSwap } from '../components/YearTabs.jsx'
import '../styles/pages/year.css'

// Branches are grouped by stream so students can find theirs quickly
const GROUPS = [
  { name: 'Computer Science', tone: 'cs', codes: ['CSE', 'ISE', 'AIML', 'AIDS', 'CSE-AIML', 'CSE-Cyber'] },
  { name: 'Electrical & Electronics', tone: 'ee', codes: ['ECE', 'EEE', 'EIE', 'ETE', 'MD'] },
  { name: 'Core Engineering', tone: 'core', codes: ['ME', 'Civil', 'CH', 'BT', 'IEM'] },
]

function groupBranches(branches) {
  const groups = GROUPS.map((g) => ({ ...g, branches: branches.filter((b) => g.codes.includes(b.code)) }))
  // Anything not listed above still shows up
  const other = branches.filter((b) => !GROUPS.some((g) => g.codes.includes(b.code)))
  if (other.length) groups.push({ name: 'Other branches', tone: 'cs', branches: other })
  return groups.filter((g) => g.branches.length)
}

export default function YearNotes({ year }) {
  return (
    <Page name="year" title={`${year.title} Notes`}>
      <header className="page-hero">
        <h1>{year.title} Notes</h1>
        <p>Find your branch and open its notes on Google Drive.</p>
      </header>

      <YearTabs />

      {/* key: a new year replays the slide-in even though the same component is reused */}
      <NotesSwap as="main" className="branches" key={year.path}>
        {groupBranches(year.branches).map((group, g) => (
          <section key={group.name} className={`group-card tone-${group.tone}`} style={{ '--g': g }}>
            <div className="group-head">
              <h2>{group.name}</h2>
              <span className="group-count">{group.branches.length} branches</span>
            </div>
            <div className="branch-grid">
              {group.branches.map((b, i) => (
                <a key={b.code} className="branch" href={b.href} target="_blank" rel="noreferrer" style={{ '--g': g, '--i': i }}>
                  <span className="branch-code">{b.code}</span>
                  <span className="branch-name">{b.name}</span>
                  <span className="branch-btn">View notes <span aria-hidden="true">↗</span></span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </NotesSwap>
    </Page>
  )
}
