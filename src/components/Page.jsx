import { useEffect } from 'react'

// Wraps a page: sets the tab title and the `.page-<name>` class that its
// stylesheet in src/styles/pages/<name>.css is scoped to.
export default function Page({ name, title, children }) {
  useEffect(() => {
    document.title = title ? `${title} | RIT Notebook` : 'RIT Notebook'
  }, [title])

  return <div className={`page page-${name}`}>{children}</div>
}
