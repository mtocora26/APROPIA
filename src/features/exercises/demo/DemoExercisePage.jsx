import { useState } from 'react'
import { useProgressRepository } from '../../students/studentContext.js'
import { useExercise } from '../../../hooks/useExercise.js'
import {
  SAVE_STATUSES,
  useExerciseProgress,
} from '../../../hooks/useExerciseProgress.js'
import ExerciseContainer from '../ExerciseContainer.jsx'
import { validateTextAnswer } from '../text-answer/textAnswer.js'
import TextAnswerInput from '../text-answer/TextAnswerInput.jsx'
import { DEMO_COURSE_ID, DEMO_EXERCISE_ID, DEMO_ITEMS } from './demoItems.js'

function DemoExercisePage() {
  const [round, setRound] = useState(0)

  // A new key remounts the exercise, which starts a fresh attempt.
  return (
    <DemoExercise key={round} onRestart={() => setRound((value) => value + 1)} />
  )
}

function DemoExercise({ onRestart }) {
  const progressRepository = useProgressRepository()
  const exercise = useExercise({
    items: DEMO_ITEMS,
    validateAnswer: validateTextAnswer,
  })
  const progress = useExerciseProgress({
    repository: progressRepository,
    courseId: DEMO_COURSE_ID,
    exerciseId: DEMO_EXERCISE_ID,
    exercise,
  })

  return (
    <ExerciseContainer
      title="Saludos en italiano"
      exercise={exercise}
      renderPrompt={(item) => item.prompt}
      renderAnswer={({ onAnswer, disabled }) => (
        <TextAnswerInput
          label="Escríbelo en italiano"
          onAnswer={onAnswer}
          disabled={disabled}
        />
      )}
      renderFeedback={({ item, result }) =>
        result === 'incorrect' && <p>Respuesta: {item.answers[0]}</p>
      }
      onRestart={onRestart}
    >
      <SaveNote {...progress} />
    </ExerciseContainer>
  )
}

function SaveNote({ record, saveStatus, error }) {
  if (saveStatus === SAVE_STATUSES.ERROR) {
    return <p role="alert">No se pudo guardar el progreso: {error.message}</p>
  }

  if (saveStatus !== SAVE_STATUSES.SAVED) {
    return <p>Guardando progreso…</p>
  }

  return (
    <p>
      Progreso guardado · intentos: {record.attempts}
    </p>
  )
}

export default DemoExercisePage
