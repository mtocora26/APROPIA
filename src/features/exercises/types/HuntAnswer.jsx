import { useState } from 'react'

/** "Detective del error": tap the word that makes the sentence wrong. */
function HuntAnswer({ exercise, onAnswer, disabled }) {
  const [selected, setSelected] = useState(null)

  function pick(index) {
    setSelected(index)
    onAnswer(index)
  }

  return (
    <div className="hunt" role="group" aria-label="Palabras de la oración">
      {exercise.tokens.map((word, i) => {
        const classes = ['tile', 'hunt__word']
        if (disabled && i === exercise.wrongIndex) classes.push('tile--correct')
        else if (disabled && i === selected) classes.push('tile--wrong')
        return (
          <button key={i} type="button" className={classes.join(' ')} onClick={() => pick(i)} disabled={disabled}>
            {word}
          </button>
        )
      })}
    </div>
  )
}

export default HuntAnswer
