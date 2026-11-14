import { useMemo, useState } from 'react'
import hardware from './data/hardware.json'
import Archive from './components/Archive.jsx'
import Inspector from './components/Inspector.jsx'
import Welcome from './components/Welcome.jsx'
import A11yPanel from './components/A11yPanel.jsx'
import { usePreferences, PRESETS } from './hooks/usePreferences.js'

export default function App() {
  const { prefs, update, reset } = usePreferences()
  const [welcomeOpen, setWelcomeOpen] = useState(!prefs.welcomeSeen)
  const [a11yOpen, setA11yOpen] = useState(false)
  const [inspectedId, setInspectedId] = useState(null)

  const inspected = useMemo(() => hardware.find((h) => h.id === inspectedId) || null, [inspectedId])

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

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>

      <header className="site-header">
        <div className="container site-header__inner">
          <a className="brand" href="#top">NSOROMA ARCHIVES</a>
          <nav aria-label="Main">
            <ul className="nav">
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
            <h1 id="hero-title">NSOROMA ARCHIVES</h1>
            <p className="hero__lede">Space exploration belongs to everyone.</p>
            <p className="hero__text">
              Meet the machines that carried human curiosity to the Moon, to Mars and out beyond the planets. Read their stories, hear them described aloud, and explore them in the way that works best for you.
            </p>
            <a className="btn btn--gold" href="#archive">Explore the archive</a>
          </div>
        </section>

        <section className="section" id="story" aria-labelledby="story-title">
          <div className="container container--narrow">
            <h2 id="story-title">The Space Story</h2>
            <p>
              Our short explainer video introduces NASA's space hardware in plain language. It is still in production. When it is ready, it will appear here with captions, a full transcript and audio description.
            </p>
            <p>Until then, every machine in the archive below has a written story you can read or hear aloud.</p>
          </div>
        </section>

        <section className="section section--tint" id="about" aria-labelledby="about-title">
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
              {hardware.length} machines so far, from the Moon, Mars and deep space. Search, filter, then choose Inspect to open a machine.
            </p>
            <Archive items={hardware} onInspect={setInspectedId} />
          </div>
        </section>

        <section className="section section--tint" id="sources" aria-labelledby="sources-title">
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
          <p>NSOROMA ARCHIVES. Space exploration belongs to everyone.</p>
        </div>
      </footer>

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
      {inspected && <Inspector key={inspected.id} item={inspected} prefs={prefs} onClose={() => setInspectedId(null)} />}
    </>
  )
}
