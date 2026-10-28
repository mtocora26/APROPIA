import { useState } from 'react'
import { isSpeechAvailable, speak, speechProblemMessage } from '../core/speech/speech.js'
import Icon from './Icon.jsx'
import './SpeakButton.css'

/** Speaker button that reads `text` aloud. Renders nothing if the browser can't speak. */
function SpeakButton({ text, lang, label = 'Escuchar' }) {
  const [problem, setProblem] = useState(null)

  if (!text || !isSpeechAvailable()) return null

  async function onClick() {
    setProblem(null)
    const result = await speak(text, lang)
    if (!result.ok) setProblem(speechProblemMessage(result.reason, lang))
  }

  return (
    <>
      <button
        type="button"
        className={problem ? 'speak-button speak-button--error' : 'speak-button'}
        onClick={onClick}
        aria-label={label}
        title={problem ?? label}
      >
        <Icon name={problem ? 'mute' : 'volume'} size={18} />
      </button>
      {problem && (
        <span className="speak-button__problem" role="status">
          {problem}
        </span>
      )}
    </>
  )
}

export default SpeakButton
