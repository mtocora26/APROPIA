import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCourse } from '../../content/courses/index.js'
import { findLesson } from '../../domain/course.js'
import { speechLang } from '../../core/speech/speech.js'
import SpeakButton from '../../ui/SpeakButton.jsx'
import ExercisePrompt from '../exercises/types/ExercisePrompt.jsx'
import { buildClassSlides, exerciseMaterial, moveSlide, revealedAnswer } from './classMode.js'
import LessonTheory from './LessonTheory.jsx'
import { lessonPath } from './paths.js'
import './classMode.css'

/** Big-type, step-by-step view of a lesson for the tutor to project. No XP, no saving. */
function ClassModePage() {
  const { courseId, lessonId } = useParams()
  const course = getCourse(courseId)
  const found = course && findLesson(course, lessonId)

  if (!found) {
    return (
      <p>
        No encontramos esta lección. <Link to="/">Volver al inicio</Link>
      </p>
    )
  }

  return <ClassMode key={lessonId} course={course} lesson={found.lesson} />
}

function ClassMode({ course, lesson }) {
  const slides = buildClassSlides(lesson)
  const lang = speechLang(course.language)
  const context = { alphabet: course.alphabet }
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  function go(step) {
    setIndex((current) => moveSlide(current, step, slides.length))
    setRevealed(false)
  }

  useEffect(() => {
    function onKeyDown(event) {
      if (event.target.closest?.('input, textarea, select')) return
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const slide = slides[index]
  const answer = slide.kind === 'exercise' ? revealedAnswer(slide.exercise, context) : null

  return (
    <section className="class-mode">
      <header className="class-mode__header">
        <Link to={lessonPath(course.id, lesson.id)}>← Salir</Link>
        <h1>{lesson.title}</h1>
        <span>
          {index + 1} / {slides.length}
        </span>
      </header>

      <div className="class-mode__slide">
        {slide.kind === 'theory' ? (
          <LessonTheory blocks={[slide.block]} lang={lang} />
        ) : (
          <>
            <ExercisePrompt exercise={slide.exercise} />
            {slide.exercise.type === 'dialogue' ? (
              <ol className="class-mode__material">
                {slide.exercise.lines.map((line, i) => (
                  <li key={i}>
                    <strong>{line.who}:</strong> {line.text ?? (line.options ?? []).join('  /  ')}
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="class-mode__material">
                {exerciseMaterial(slide.exercise).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            {revealed ? (
              <>
                {answer && (
                  <p className="class-mode__answer">
                    <strong lang={course.language}>{answer}</strong>
                    {slide.exercise.type !== 'match' && slide.exercise.type !== 'dialogue' && (
                      <SpeakButton text={answer} lang={lang} />
                    )}
                  </p>
                )}
                {slide.exercise.explanation && <p>{slide.exercise.explanation}</p>}
              </>
            ) : (
              <button type="button" className="class-mode__reveal" onClick={() => setRevealed(true)}>
                Mostrar respuesta
              </button>
            )}
          </>
        )}
      </div>

      <footer className="class-mode__footer">
        <button type="button" onClick={() => go(-1)} disabled={index === 0}>
          ← Anterior
        </button>
        <button type="button" onClick={() => go(1)} disabled={index === slides.length - 1}>
          Siguiente →
        </button>
      </footer>
    </section>
  )
}

export default ClassModePage
