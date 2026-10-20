import { useEffect, useState } from 'react'
import { COURSES } from '../../content/courses/index.js'
import { DECKS } from '../../content/decks/index.js'
import {
  useFlashcardRepository,
  useProgressRepository,
  useSessionRepository,
} from '../students/studentContext.js'

/**
 * Loads everything the tutoring screens need for the active student:
 * course progress, flashcard schedules and past sessions.
 *
 * @returns {{ data: { progressByCourse, cardsByDeck, sessions } | null, error: Error | null }}
 *   `data` is null while loading.
 */
export function useTutoringData() {
  const progressRepository = useProgressRepository()
  const flashcardRepository = useFlashcardRepository()
  const sessionRepository = useSessionRepository()
  const [result, setResult] = useState({ data: null, error: null })

  useEffect(() => {
    let ignore = false

    Promise.all([
      Promise.all(COURSES.map((course) => progressRepository.getProgress(course.id))),
      Promise.all(DECKS.map((deck) => flashcardRepository.getCards(deck.id))),
      sessionRepository.list(),
    ])
      .then(([progresses, cardsList, sessions]) => {
        if (ignore) return
        setResult({
          data: {
            progressByCourse: Object.fromEntries(COURSES.map((c, i) => [c.id, progresses[i]])),
            cardsByDeck: Object.fromEntries(DECKS.map((d, i) => [d.id, cardsList[i]])),
            sessions,
          },
          error: null,
        })
      })
      .catch((error) => {
        if (!ignore) setResult({ data: null, error })
      })

    return () => {
      ignore = true
    }
  }, [progressRepository, flashcardRepository, sessionRepository])

  return result
}
