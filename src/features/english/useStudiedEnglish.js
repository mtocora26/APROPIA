import { useCallback, useEffect, useState } from 'react'
import { studiedLessons } from '../../core/studied/studiedLessons.js'
import { useProgressRepository, useSessionRepository, useStudiedRepository } from '../students/studentContext.js'

export const ENGLISH_COURSE_ID = 'english-tenses'

/** What the active student has studied in the English course (manual + tutoring sessions + completed lessons). */
export function useStudiedEnglish() {
  const studiedRepository = useStudiedRepository()
  const progressRepository = useProgressRepository()
  const sessionRepository = useSessionRepository()
  const [state, setState] = useState({ data: null, error: null })

  useEffect(() => {
    let ignore = false
    Promise.all([studiedRepository.list(), sessionRepository.list(), progressRepository.getProgress(ENGLISH_COURSE_ID)])
      .then(([manual, sessions, progress]) => {
        if (!ignore) setState({ data: studiedLessons({ courseId: ENGLISH_COURSE_ID, manual, sessions, progress }), error: null })
      })
      .catch((error) => {
        if (!ignore) setState({ data: null, error })
      })
    return () => {
      ignore = true
    }
  }, [studiedRepository, progressRepository, sessionRepository])

  const setManual = useCallback(
    async (manual) => {
      await studiedRepository.save(manual)
      setState((current) =>
        current.data
          ? { data: { ...current.data, manual: new Set(manual), all: new Set([...manual, ...current.data.automatic]) }, error: null }
          : current,
      )
    },
    [studiedRepository],
  )

  return { ...state, setManual }
}
