import { useState } from 'react'
import { speak, SpeechUnavailableError } from '../core/speech/speech.js'
import './SpeakButton.css'

const HINTS = {
  unavailable: 'Este navegador no tiene voz para este idioma',
  error: 'No se pudo reproducir el audio',
}

/**
 * 🔊 button that reads `text` aloud. If the browser has no voice for `lang`
 * (or speaking fails) it says so instead of staying silent.
 */
function SpeakButton({ text, lang, label = 'Escuchar' }) {
  const [hint, setHint] = useState(null) // { kind, id } — id restarts the fade

  if (!text) return null

  function handleClick() {
    speak(text, lang).catch((error) => {
      const kind = error instanceof SpeechUnavailableError ? 'unavailable' : 'error'
      setHint((previous) => ({ kind, id: (previous?.id ?? 0) + 1 }))
    })
  }

  return (
    <span className="speak-button-wrapper">
      <button
        type="button"
        className="speak-button"
        onClick={handleClick}
        aria-label={label}
        title={label}
      >
        🔊
      </button>
      {hint && (
        <span key={hint.id} className="speak-button__hint" role="status">
          {HINTS[hint.kind]}
        </span>
      )}
    </span>
  )
}

export default SpeakButton
