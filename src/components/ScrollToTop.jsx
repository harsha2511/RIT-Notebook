import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// A single-page app keeps the scroll position between pages; start each page at the top.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
