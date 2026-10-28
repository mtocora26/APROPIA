import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCourse } from '../../content/courses/index.js'
import { speechLang } from '../../core/speech/speech.js'
import { starsForAccuracy } from '../../core/gamification/scoring.js'
import { useExercise } from '../../hooks/useExercise.js'
import ExerciseContainer from '../exercises/ExerciseContainer.jsx'
import { ANSWER_COMPONENTS } from '../exercises/types/answerComponents.js'
import ExercisePrompt from '../exercises/types/ExercisePrompt.jsx'
import { checkAnswer, correctAnswerText, prepareExercise, speakableText } from '../exercises/types/exerciseLogic.js'
import SpeakButton from '../../ui/SpeakButton.jsx'
import EnglishNav from '../english/EnglishNav.jsx'
import { ENGLISH_COURSE_ID, useStudiedEnglish } from '../english/useStudiedEnglish.js'
import { buildPractice, PRACTICE_SIZES } from './practiceMix.js'
import '../exercises/types/exerciseTypes.css'
import '../tutoring/tutoring.css'

/** Free practice: pick what you have seen, get a mixed set of exercises only (no theory, nothing saved). */
function PracticePage() {
  const course = getCourse(ENGLISH_COURSE_ID)
  const { data, error } = useStudiedEnglish()

  if (error) return <p role="alert">No se pudo leer lo estudiado: {error.message}</p>
  if (!data) return <p>Cargando…</p>

  return <PracticeSetup course={course} studied={data.all} />
}

function PracticeSetup({ course, studied }) {
  const [selected, setSelected] = useState(() => new Set(studied))
  const [size, setSize] = useState(PRACTICE_SIZES[0])
  const [run, setRun] = useState(null)

  const change = (ids, checked) =>
    setSelected((current) => {
      const next = new Set(current)
      for (const id of ids) {
        if (checked) next.add(id)
        else next.delete(id)
      }
      return next
    })
  const start = () => setRun({ key: (run?.key ?? 0) + 1, exercises: buildPractice(course, [...selected], size) })

  if (run) {
    return <PracticeRunner key={run.key} course={course} exercises={run.exercises} onAgain={start} onExit={() => setRun(null)} />
  }

  return (
    <section className="tutoring">
      <EnglishNav />
      <h1>Práctica</h1>
      <p>
        {studied.size > 0
          ? 'Ya marqué lo que ha estudiado. Ajusta la selección y arma una práctica mezclada: solo ejercicios, sin teoría y sin guardar nada.'
          : 'Aún no hay lecciones estudiadas. Marca lo que quieras practicar, o márcalo en '}
        {studied.size === 0 && <Link to="/ingles/estudiado">Lo estudiado</Link>}
      </p>

      {course.modules.map((module) => {
        const ids = module.lessons.map((lesson) => lesson.id)
        return (
          <fieldset key={module.id} className="tutoring__group">
            <legend>{module.title}</legend>
            <label className="tutoring__check">
              <input type="checkbox" checked={ids.every((id) => selected.has(id))} onChange={(event) => change(ids, event.target.checked)} />
              Todo el módulo
            </label>
            {module.lessons.map((lesson) => (
              <label key={lesson.id} className="tutoring__check">
                <input type="checkbox" checked={selected.has(lesson.id)} onChange={(event) => change([lesson.id], event.target.checked)} />
                {lesson.title}
              </label>
            ))}
          </fieldset>
        )
      })}

      <label className="tutoring__field">
        Cantidad de ejercicios
        <select value={size} onChange={(event) => setSize(Number(event.target.value))}>
          {PRACTICE_SIZES.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <p className="tutoring__actions">
        <button type="button" className="tutoring__primary" disabled={selected.size === 0} onClick={start}>
          Armar práctica
        </button>
      </p>
    </section>
  )
}

function PracticeRunner({ course, exercises, onAgain, onExit }) {
  const context = { alphabet: course.alphabet }
  const lang = speechLang(course.language)
  const [items] = useState(() =>
    exercises.map((exercise) => prepareExercise(exercise, { alphabet: course.alphabet, random: Math.random })),
  )
  const exercise = useExercise({
    items,
    validateAnswer: (value, item) => checkAnswer(value, item, context),
    reviewMistakes: true,
  })

  return (
    <>
      <p><button type="button" onClick={onExit}>Cambiar selección</button></p>
      <ExerciseContainer
        title="Práctica libre"
        exercise={exercise}
        renderPrompt={(item) => <ExercisePrompt exercise={item} />}
        renderAnswer={({ item, onAnswer, disabled }) => {
          const Answer = ANSWER_COMPONENTS[item.type]
          return <Answer exercise={item} onAnswer={onAnswer} disabled={disabled} language={course.language} theory={[]} />
        }}
        renderFeedback={({ item, result }) => {
          const answerText = result === 'incorrect' ? correctAnswerText(item, context) : null
          return (
            <>
              <p className="exercise-feedback__answer">
                {answerText && <span>Respuesta: <strong lang={lang}>{answerText}</strong></span>}
                <SpeakButton text={speakableText(item, context)} lang={lang} label="Escuchar la respuesta" />
              </p>
              {item.explanation && <p className="exercise-feedback__explanation">{item.explanation}</p>}
            </>
          )
        }}
        onRestart={onAgain}
      >
        {({ onRestart }) => (
          <div className="lesson-result">
            <p>{'★'.repeat(starsForAccuracy(exercise.stats.accuracy))} Práctica terminada.</p>
            <p className="tutoring__actions">
              <button type="button" className="tutoring__primary" onClick={onRestart}>Otra práctica igual</button>{' '}
              <button type="button" onClick={onExit}>Cambiar selección</button>
            </p>
          </div>
        )}
      </ExerciseContainer>
    </>
  )
}

export default PracticePage
