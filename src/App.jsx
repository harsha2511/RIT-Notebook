import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import LabCodes from './pages/LabCodes.jsx'
import MathQB from './pages/MathQB.jsx'
import FirstYear from './pages/FirstYear.jsx'
import YearNotes from './pages/YearNotes.jsx'
import SubjectCodes from './pages/SubjectCodes.jsx'
import NotFound from './pages/NotFound.jsx'
import yearNotes from './data/yearNotes.js'
import labSubjects from './data/labSubjects.js'

// All 90 lab programs live in one data file; load it only when a program is opened.
const Program = lazy(() => import('./pages/Program.jsx'))

// Paths keep their old `.html` URLs so existing links, bookmarks and search results still work.
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="/about.html" element={<About />} />
          <Route path="/labcodes.html" element={<LabCodes />} />
          <Route path="/mathqb.html" element={<MathQB />} />
          <Route path="/notes/first.html" element={<FirstYear />} />
          {yearNotes.map((year) => (
            <Route key={year.path} path={year.path} element={<YearNotes year={year} />} />
          ))}
          {labSubjects.map((subject) => (
            <Route key={subject.path} path={subject.path} element={<SubjectCodes subject={subject} />} />
          ))}
          <Route path="/labcodes/:folder/:file" element={<Program />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
