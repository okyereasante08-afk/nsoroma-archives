import { useCallback, useEffect, useState } from 'react'

const KEY = 'nsoroma-preferences-v1'

export const DEFAULTS = {
  textSize: '100',
  contrast: 'auto',
  motion: 'auto',
  autoRead: false,
  expandVisual: false,
  welcomeSeen: false,
}

// Presets only set a few preferences. Every setting can still be changed afterwards.
export const PRESETS = {
  standard: {
    label: 'Standard exploration',
    hint: 'The classic museum experience.',
    values: { textSize: '100', autoRead: false, expandVisual: false },
  },
  audio: {
    label: 'Audio-first exploration',
    hint: 'Larger text, and descriptions read aloud when you open a machine.',
    values: { textSize: '125', autoRead: true, expandVisual: false },
  },
  visual: {
    label: 'Visual-first exploration',
    hint: 'Visual explanations open by default. Nothing depends on sound.',
    values: { textSize: '100', autoRead: false, expandVisual: true },
  },
}

function load() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
  } catch {
    return DEFAULTS
  }
}

export function usePreferences() {
  const [prefs, setPrefs] = useState(load)

  const update = useCallback((patch) => setPrefs((p) => ({ ...p, ...patch })), [])
  const reset = useCallback(() => setPrefs((p) => ({ ...DEFAULTS, welcomeSeen: p.welcomeSeen })), [])

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(prefs)) } catch { /* storage blocked: ignore */ }
  }, [prefs])

  // Apply settings to the page. "auto" follows the visitor's device settings.
  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${prefs.textSize}%`
    const contrastQuery = window.matchMedia('(prefers-contrast: more)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      const high = prefs.contrast === 'high' || (prefs.contrast === 'auto' && contrastQuery.matches)
      const reduce = prefs.motion === 'reduce' || (prefs.motion === 'auto' && motionQuery.matches)
      root.dataset.contrast = high ? 'high' : 'normal'
      root.dataset.motion = reduce ? 'reduce' : 'full'
    }
    apply()
    contrastQuery.addEventListener('change', apply)
    motionQuery.addEventListener('change', apply)
    return () => {
      contrastQuery.removeEventListener('change', apply)
      motionQuery.removeEventListener('change', apply)
    }
  }, [prefs.textSize, prefs.contrast, prefs.motion])

  return { prefs, update, reset }
}
