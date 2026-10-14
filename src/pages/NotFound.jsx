import { Link } from 'react-router-dom'
import Page from '../components/Page.jsx'

export default function NotFound() {
  return (
    <Page name="notfound" title="Page not found">
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--heading)' }}>
        <h1 style={{ fontSize: 40, margin: 0 }}>Page not found</h1>
        <p style={{ color: 'var(--muted)' }}>The page you are looking for doesn't exist or has moved.</p>
        <Link to="/" style={{ color: 'var(--accent-text)', fontWeight: 700 }}>Go to the home page</Link>
      </div>
    </Page>
  )
}
