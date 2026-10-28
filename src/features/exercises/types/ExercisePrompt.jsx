import CodeBlock from '../../../ui/CodeBlock.jsx'

/** Instruction plus, when present, the sentence with `___` blanks highlighted. */
function ExercisePrompt({ exercise }) {
  const sentence = exercise.sentence ?? (exercise.type === 'spelling' ? exercise.word : null)

  return (
    <div className="exercise-prompt">
      <p className="exercise-prompt__instruction">{exercise.prompt}</p>
      {exercise.picture && (
        <p className="exercise-prompt__picture" aria-hidden="true">
          {exercise.picture}
        </p>
      )}
      {exercise.snippet && <CodeBlock text={exercise.snippet} lang={exercise.snippetLang} />}
      {sentence && (
        <p className="exercise-prompt__sentence" lang="it">
          {sentence.split(/(___)/).map((part, i) =>
            part === '___' ? (
              <span key={i} className="exercise-prompt__blank">
                ___
              </span>
            ) : (
              part
            ),
          )}
        </p>
      )}
    </div>
  )
}

export default ExercisePrompt
