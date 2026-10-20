import { Fragment, useMemo, useState } from 'react'
import { createFlashcardRepository, createProgressRepository } from '../../app/progressRepository.js'
import { StudentContext } from './studentContext.js'

function readState(studentRepository) {
  try {
    return { students: studentRepository.list(), active: studentRepository.getActive(), error: null }
  } catch (error) {
    return { students: [], active: null, error }
  }
}

/**
 * Holds the student list and the active student, and gives descendants the
 * active student's progress repository. Children remount when the active
 * student changes, so every screen reloads with that student's data.
 */
function StudentProvider({ studentRepository, children }) {
  const [state, setState] = useState(() => readState(studentRepository))
  const activeId = state.active?.id ?? null

  const value = useMemo(() => {
    const apply = (change) => {
      change()
      setState(readState(studentRepository))
    }

    return {
      students: state.students,
      activeStudent: state.active,
      progressRepository: activeId === null ? null : createProgressRepository(activeId),
      flashcardRepository: activeId === null ? null : createFlashcardRepository(activeId),
      switchStudent: (id) => apply(() => studentRepository.setActive(id)),
      addStudent: (name) => apply(() => studentRepository.add(name)),
      renameStudent: (id, name) => apply(() => studentRepository.rename(id, name)),
      removeStudent: (id) => apply(() => studentRepository.remove(id)),
    }
  }, [studentRepository, state.students, state.active, activeId])

  if (state.error) {
    return (
      <main className="app-main">
        <h1>No se pudieron leer los estudiantes</h1>
        <p>{state.error.message}</p>
        <p>
          Los datos guardados no se borraron. Si tienes un respaldo, restáuralo; si no,
          revisa la clave <code>tukola.students</code> en el almacenamiento del navegador.
        </p>
      </main>
    )
  }

  return (
    <StudentContext.Provider value={value}>
      <Fragment key={activeId}>{children}</Fragment>
    </StudentContext.Provider>
  )
}

export default StudentProvider
