// Thin wrapper around the browser's built-in speech. Used as the baseline audio description.
export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

let current = null

export function speak(text, onEnd) {
  if (!speechSupported) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.95
  const done = () => {
    if (current === utterance) {
      current = null
      if (onEnd) onEnd()
    }
  }
  utterance.onend = done
  utterance.onerror = done
  current = utterance
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  current = null
  if (speechSupported) window.speechSynthesis.cancel()
}
