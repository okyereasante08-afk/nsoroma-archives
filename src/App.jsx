import { useEffect, useRef, useState } from 'react'
import hardware from './data/hardware.json'
import Archive from './components/Archive.jsx'
import Carousel from './components/Carousel.jsx'
import MachinePage from './components/MachinePage.jsx'
import Welcome from './components/Welcome.jsx'
import A11yPanel from './components/A11yPanel.jsx'
import ScrollBackground from './components/ScrollBackground.jsx'
import Story from './components/Story.jsx'
import Brand from './components/Brand.jsx'
import { assetUrl } from './utils/format.js'
import story from './data/story.json'
import { usePreferences, PRESETS } from './hooks/usePreferences.js'

// Machine pages live at #/machine/<id>. Everything else is the home page.
function parseRoute() {
  const match = window.location.hash.match(/^#\/machine\/([\w-]+)$/)
  return match ? match[1] : null
}

export default function App() {
  const { prefs, update, reset } = usePreferences()
  const [welcomeOpen, setWelcomeOpen] = useState(!prefs.welcomeSeen)
  const [a11yOpen, setA11yOpen] = useState(false)
  const [machineId, setMachineId] = useState(parseRoute)
  const savedScroll = useRef(null)
  const firstRender = useRef(true)

  useEffect(() => {
    const onHash = () => setMachineId(parseRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Remember where the visitor was on the home page so Back returns to the same place.
  useEffect(() => {
    if (machineId) return
    const onScroll = () => { savedScroll.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [machineId])

  useEffect(() => {
    if (machineId) return
    if (firstRender.current) { firstRender.current = false; return }
    requestAnimationFrame(() => {
      if (savedScroll.current) {
        window.scrollTo(0, savedScroll.current)
      } else {
        const target = document.getElementById(window.location.hash.slice(1))
        if (target) target.scrollIntoView()
      }
    })
  }, [machineId])

  const choosePreset = (key) => {
    update({ ...PRESETS[key].values, welcomeSeen: true })
    setWelcomeOpen(false)
  }
  const skipWelcome = () => {
    update({ welcomeSeen: true })
    setWelcomeOpen(false)
  }
  const customize = () => {
    update({ welcomeSeen: true })
    setWelcomeOpen(false)
    setA11yOpen(true)
  }

  const overlays = (
    <>
      <button type="button" className="fab" aria-haspopup="dialog" onClick={() => setA11yOpen(true)}>
        <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="4.5" r="2" />
          <path d="M4 8.5h16M12 8.5v5.5M12 14l-3.5 6M12 14l3.5 6" />
        </svg>
        Accessibility
      </button>
      <Welcome open={welcomeOpen} onChoose={choosePreset} onCustomize={customize} onSkip={skipWelcome} />
      <A11yPanel
        open={a11yOpen}
        onClose={() => setA11yOpen(false)}
        prefs={prefs}
        update={update}
        reset={reset}
        onPreset={(key) => update(PRESETS[key].values)}
      />
    </>
  )

  if (machineId) {
    return (
      <>
        <ScrollBackground prefs={prefs} startStage={1} />
        <a className="skip-link" href="#main">Skip to main content</a>
        <MachinePage item={hardware.find((h) => h.id === machineId) || null} prefs={prefs} />
        {overlays}
      </>
    )
  }

  return (
    <>
      <ScrollBackground prefs={prefs} />
      <a className="skip-link" href="#main">Skip to main content</a>

      <header className="site-header">
        <div className="container site-header__inner">
          <Brand />
          <nav aria-label="Main">
            <ul className="nav">
              <li><a href="#featured">Featured</a></li>
              <li><a href="#story">The Space Story</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#archive">Archive</a></li>
              <li><a href="#sources">Sources</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="container">
            <img className="hero__logo" src={assetUrl('/nsoroma-logo.png')} alt="" />
            <h1 id="hero-title">NSOROMA ARCHIVES</h1>
            <p className="hero__lede">Space exploration belongs to everyone.</p>
            <p className="hero__text">
              Meet the machines that carried human curiosity to the Moon, to Mars and out beyond the planets. Read their stories, hear them described aloud, and explore them in the way that works best for you.
            </p>
            <a className="btn btn--gold" href="#featured">Meet the machines</a>
          </div>
        </section>

        <section className="section" id="featured" aria-labelledby="featured-title">
          <div className="container">
            <h2 id="featured-title">Featured machines</h2>
            <p className="section__intro">Choose any machine to open its own full page.</p>
            <Carousel items={hardware} prefs={prefs} />
          </div>
        </section>

        <section className="section" id="story" aria-labelledby="story-title">
          <div className="container">
            <h2 id="story-title">{story.title}</h2>
            <Story />
          </div>
        </section>

        <section className="section" id="about" aria-labelledby="about-title">
          <div className="container container--narrow">
            <h2 id="about-title">About NSOROMA ARCHIVES</h2>
            <p>
              Since the 1960s, humanity has sent thousands of machines beyond Earth. Some are still working. Others finished their missions and now sit on other worlds or drift through space. Their stories are often buried in technical documents.
            </p>
            <p>
              We are rebuilding those stories so everyone can enjoy them, including people who cannot see or hear the universe the way others do. Every machine comes with plain-language explanations, a written description of how it looks, audio you can play, and a 3D model where one is available.
            </p>
            <p>
              Use the Accessibility button at any time to change text size, contrast, motion and how descriptions are delivered.
            </p>
          </div>
        </section>

        <section className="section" id="archive" aria-labelledby="archive-title">
          <div className="container">
            <h2 id="archive-title">The hardware archive</h2>
            <p className="section__intro">
              {hardware.length} machines so far, from the Moon, Mars and deep space. Search and filter, then open a machine's full page.
            </p>
            <Archive items={hardware} />
          </div>
        </section>

        <section className="section" id="sources" aria-labelledby="sources-title">
          <div className="container container--narrow">
            <h2 id="sources-title">Project information and sources</h2>
            <p>The facts in this archive come from NASA's own records. Each machine lists its sources, and entries still being checked are marked.</p>
            <ul>
              <li><a href="https://nssdc.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA Space Science Data Coordinated Archive<span className="sr-only"> (opens in a new tab)</span></a></li>
              <li><a href="https://science.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA Science<span className="sr-only"> (opens in a new tab)</span></a></li>
            </ul>
            <p>Built by a student team for the NASA Space Apps Challenge. This project is not affiliated with or endorsed by NASA.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>NSOROMA ARCHIVES. Space exploration belongs to everyone.
            background
          </p>
        </div>
      </footer>

      {overlays}
    </>
  )
}
