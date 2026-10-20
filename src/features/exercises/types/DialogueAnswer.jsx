import { useState } from 'react'
import { dialogueBlanks, visibleDialogueLines } from './exerciseLogic.js'

/** Guided conversation: the partner's lines appear as you pick your own. */
function DialogueAnswer({ exercise, onAnswer, disabled }) {
  const [choices, setChoices] = useState([])
  const blanks = dialogueBlanks(exercise)
  const visible = visibleDialogueLines(exercise, choices.length)
  const pending = choices.length < blanks.length

  function choose(option) {
    const next = [...choices, option]
    setChoices(next)
    if (next.length === blanks.length) onAnswer({ choices: next })
  }

  // Position of each line with options among the answers (`visible` starts at line 0).
  const blankNumbers = new Map(
    exercise.lines.flatMap((line, i) => (line.options ? [i] : [])).map((lineIndex, n) => [lineIndex, n]),
  )

  return (
    <div className="dialogue">
      <ol className="dialogue__lines">
        {visible.map((line, i) => {
          if (!line.options) {
            return (
              <li key={i} className="dialogue__line">
                <strong>{line.who}:</strong> {line.text}
              </li>
            )
          }

          const chosen = choices[blankNumbers.get(i)]
          if (chosen === undefined) {
            return (
              <li key={i} className="dialogue__line dialogue__line--yours">
                <strong>{line.who}:</strong>
                <div className="choice" role="group" aria-label="Opciones">
                  {exercise.view.options[i].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="tile choice__option"
                      onClick={() => choose(option)}
                      disabled={disabled || !pending}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </li>
            )
          }

          return (
            <li
              key={i}
              className={`dialogue__line dialogue__line--yours ${
                chosen === line.answer ? 'dialogue__line--correct' : 'dialogue__line--wrong'
              }`}
            >
              <strong>{line.who}:</strong> {chosen}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default DialogueAnswer
