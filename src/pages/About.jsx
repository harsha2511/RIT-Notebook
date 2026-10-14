import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Page from '../components/Page.jsx'
import '../styles/pages/about.css'

const FEATURES = [
  {
    title: 'Notes & PYQ',
    text: 'Notes and previous year papers for every year, for all streams: CSE, Electrical, Civil and Mech.',
    imgs: ['/images/img1.jpeg'],
    to: '/',
  },
  {
    title: 'Lab Codes',
    text: 'Full lab programs for 1st and 2nd year: C, C++, Java, Python, MATLAB, web dev and more.',
    imgs: ['/images/img2.jpeg'],
    to: '/labcodes.html',
  },
  {
    title: 'Maths Question Bank',
    text: 'Maths question banks for semesters 1 to 4, for all branches.',
    imgs: ['/images/img3.jpeg', '/images/img4.jpeg'],
    to: '/mathqb.html',
  },
]

const PORTFOLIO_URL = 'https://harsha-kumari-portfolio.vercel.app'

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/harsha-kumari-246084294/',
    brand: 'linkedin',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M8 10.5v6M12 16.5v-6M12 13.5a2.5 2.5 0 0 1 5 0v3" />
        <circle cx="8" cy="7.5" r="0.6" fill="currentColor" />
      </>
    ),
  },
  {
    label: 'Gmail',
    href: 'mailto:harshakumari1125@gmail.com',
    brand: 'mail',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/harsha__a_/?hl=en',
    brand: 'instagram',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
      </>
    ),
  },
]

// One stop per part of the site, shown on the timeline (sides alternate on wide screens)
const TOUR = [
  {
    icon: '🏠',
    title: 'Home',
    text: 'Your starting point. Quick links to the syllabus, Skill Lab, Open Electives and more, plus notes by year.',
    to: '/',
  },
  {
    icon: '📗',
    title: 'First Year Notes',
    text: 'Pick your stream from the sidebar to see Physics and Chemistry cycle subjects side by side.',
    to: '/notes/first.html',
  },
  {
    icon: '📚',
    title: '2nd to 4th Year Notes',
    text: 'Branches grouped by stream: Computer Science, Electrical & Electronics and Core. Switch years with the tabs.',
    to: '/notes/second.html',
  },
  {
    icon: '💻',
    title: 'Lab Codes',
    text: 'Full programs for 1st and 2nd year labs: C, Python, Java, web dev, MATLAB and more, ready to read.',
    to: '/labcodes.html',
  },
  {
    icon: '🧮',
    title: 'Maths Question Bank',
    text: 'Question banks for semesters 1 to 4. Find your paper code and open it on Google Drive.',
    to: '/mathqb.html',
  },
  {
    icon: '🎓',
    title: 'Syllabus, Skill Lab & Electives',
    text: 'Shared Google Drive folders with the syllabus, Skill Lab material and Open Elective notes.',
    href: 'https://drive.google.com/drive/folders/19prQwverKqHyobWdGh9p3NwH1JuJ3JLi?usp=sharing',
  },
  {
    icon: '📤',
    title: 'Upload Here',
    text: 'Have good notes? Upload them to the shared folder and help your juniors.',
    href: 'https://drive.google.com/drive/folders/1_XJvCLOO_9g4QEgiO_fBZCtdfxWhZdNC?usp=sharing',
  },
  {
    icon: '⚡',
    title: 'RIT Codes',
    text: 'Our sister site with codes and resources for Electrical & Electronics students.',
    href: 'https://ritcode.pages.dev/',
  },
  {
    icon: '🌗',
    title: 'Light & Dark Theme',
    text: 'Use the button at the top right to switch themes. Your choice is remembered on this device.',
  },
]

// Fades/slides elements marked data-reveal into view as they scroll on screen,
// and fills the timeline line in step with the scroll position
function useScrollAnimations(timelineRef) {
  useEffect(() => {
    const items = document.querySelectorAll('.page-about [data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        }
      },
      // Trigger once the top edge is 60px on screen; a ratio threshold would never fire for very tall cards
      { threshold: 0, rootMargin: '0px 0px -60px 0px' },
    )
    items.forEach((el) => observer.observe(el))

    let frame = 0
    const update = () => {
      frame = 0
      const el = timelineRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      // The line is "drawn" down to the middle of the screen
      const progress = (window.innerHeight * 0.6 - rect.top) / rect.height
      el.style.setProperty('--progress', Math.min(1, Math.max(0, progress)).toFixed(3))
      // Light up each stop once the line has reached its dot
      const lineEnd = window.innerHeight * 0.6
      for (const stop of el.children) {
        const dot = stop.querySelector('.tour-dot')
        if (!dot) continue
        const r = dot.getBoundingClientRect()
        stop.classList.toggle('lit', r.top + r.height / 2 <= lineEnd)
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [timelineRef])
}

function TourStop({ stop, index }) {
  const side = index % 2 === 0 ? 'left' : 'right'
  const body = (
    <>
      <span className="tour-icon" aria-hidden="true">{stop.icon}</span>
      <div>
        <h3>{stop.title}</h3>
        <p>{stop.text}</p>
        {(stop.to || stop.href) && (
          <span className="tour-go">
            Open <span aria-hidden="true">{stop.href ? '↗' : '→'}</span>
          </span>
        )}
      </div>
    </>
  )

  let box
  if (stop.to) box = <Link to={stop.to} className="tour-box">{body}</Link>
  else if (stop.href) box = <a href={stop.href} target="_blank" rel="noreferrer" className="tour-box">{body}</a>
  else box = <div className="tour-box">{body}</div>

  return (
    <li className={`tour-stop ${side}`} data-reveal style={{ '--i': index }}>
      <span className="tour-dot" aria-hidden="true">{index + 1}</span>
      {box}
    </li>
  )
}

const SITES = [
  {
    title: 'RIT Notebook',
    img: '/images/Websites/ritnotebook.jpeg',
    href: 'https://ritnotebook.pages.dev/',
    text: 'Notes, syllabus, previous year papers and lab codes for every branch, from 1st to 4th year.',
    tags: ['Notes', 'PYQ', 'Lab codes'],
  },
  {
    title: 'RIT Code',
    img: '/images/Websites/ritcode.jpeg',
    href: 'https://ritcode.pages.dev/',
    text: 'Organised codes and resources for Electrical & Electronics Engineering students, for all years.',
    tags: ['EEE', 'Codes', 'All years'],
  },
]

export default function About() {
  const timelineRef = useRef(null)
  useScrollAnimations(timelineRef)

  return (
    <Page name="about" title="About">
      <header className="page-hero">
        <h1 className="hero-rise">About RIT Notebook</h1>
        <p className="hero-rise">
          We are committed to empowering students in their academic pursuits. Our mission is to provide
          comprehensive notes, lab codes, and previous year questions, aiding students in boosting their academic
          performance. Join our academic community and access well-structured resources, ensuring a smoother path
          to success.
        </p>
      </header>

      <main className="about">
        <div className="about-row">
          <section className="about-card dev-card" data-reveal>
            <h2>Meet the developer</h2>
            <div className="dev">
              <img src="/images/team/harsha.jpeg" alt="Harsha" className="dev-photo" />
              <div className="dev-info">
                <h3>Harsha</h3>
                <span className="dev-role">Developer</span>
                <p><strong>Department:</strong> Electrical &amp; Electronics Engineering</p>
                <p><strong>Batch:</strong> 2022-2026</p>
                <div className="socials">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      title={s.label}
                      className={`social social-${s.brand}`}
                      {...(s.href.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">{s.icon}</svg>
                    </a>
                  ))}
                </div>
                <a className="portfolio-btn" href={PORTFOLIO_URL} target="_blank" rel="noreferrer">
                  View my portfolio <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </section>

          <section className="about-card sites-card" data-reveal>
            <h2>Our websites</h2>
            <div className="site-grid">
              {SITES.map((s) => (
                <a key={s.title} href={s.href} target="_blank" rel="noreferrer" className="site">
                  <div className="browser">
                    <div className="browser-bar" aria-hidden="true">
                      <span className="browser-dots"><i /><i /><i /></span>
                      <span className="browser-url">{new URL(s.href).host}</span>
                    </div>
                    <div className="shot">
                      <img src={s.img} alt="" loading="lazy" />
                    </div>
                  </div>
                  <div className="feature-body">
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    <ul className="site-tags">
                      {s.tags.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                    <span className="card-btn">Visit site <span aria-hidden="true">↗</span></span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>

        <section className="about-card tour-card" data-reveal>
          <h2>Explore the website</h2>
          <p className="tour-intro">Scroll down to walk through every part of RIT Notebook.</p>
          <ol className="tour" ref={timelineRef}>
            <li className="tour-comet" aria-hidden="true" />
            {TOUR.map((stop, i) => (
              <TourStop key={stop.title} stop={stop} index={i} />
            ))}
          </ol>
        </section>

        <section className="about-card" data-reveal>
          <h2>What you'll find here</h2>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <Link key={f.title} to={f.to} className="feature">
                <div className={`shot${f.imgs.length > 1 ? ' shot-stack' : ''}`}>
                  {f.imgs.map((src) => (
                    <img key={src} src={src} alt="" loading="lazy" />
                  ))}
                </div>
                <div className="feature-body">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                  <span className="card-btn">View <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </Page>
  )
}
