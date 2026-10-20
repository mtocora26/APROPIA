import { useState } from 'react'
import { createBackup, restoreBackup } from '../../core/storage/backup.js'
import { useStudents } from './studentContext.js'
import './students.css'

function StudentsPage() {
  const { students, activeStudent, switchStudent, addStudent, renameStudent, removeStudent } =
    useStudents()
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState(null)

  // Runs `action`, showing its error (e.g. duplicated name) instead of crashing.
  function attempt(action, onSuccess) {
    try {
      action()
      setMessage(null)
      onSuccess?.()
    } catch (error) {
      setMessage({ kind: 'error', text: error.message })
    }
  }

  function handleAdd(event) {
    event.preventDefault()
    attempt(() => addStudent(newName), () => setNewName(''))
  }

  function handleRename(event) {
    event.preventDefault()
    attempt(() => renameStudent(editing.id, editing.name), () => setEditing(null))
  }

  function handleRemove(student) {
    const ok = window.confirm(
      `¿Eliminar a ${student.name}? Se borra todo su progreso y no se puede deshacer.`,
    )
    if (ok) attempt(() => removeStudent(student.id))
  }

  function handleExport() {
    const text = createBackup(globalThis.localStorage)
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `tukola-respaldo-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(event) {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return

    const ok = window.confirm(
      'Importar reemplaza el progreso y los estudiantes actuales por los del respaldo. ¿Continuar?',
    )
    if (!ok) return

    try {
      restoreBackup(globalThis.localStorage, await file.text())
      window.location.assign('/')
    } catch (error) {
      setMessage({ kind: 'error', text: error.message })
    }
  }

  return (
    <section className="students">
      <h1>Estudiantes</h1>
      <p>Cada estudiante tiene su propio progreso. Elige con quién estás en la tutoría.</p>

      {message && (
        <p role="alert" className={`students__message students__message--${message.kind}`}>
          {message.text}
        </p>
      )}

      <ul className="students__list">
        {students.map((student) => (
          <li key={student.id} className="students__item">
            {editing?.id === student.id ? (
              <form onSubmit={handleRename} className="students__row">
                <input
                  aria-label={`Nuevo nombre de ${student.name}`}
                  value={editing.name}
                  maxLength={40}
                  autoFocus
                  onChange={(event) => setEditing({ id: student.id, name: event.target.value })}
                />
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setEditing(null)}>
                  Cancelar
                </button>
              </form>
            ) : (
              <div className="students__row">
                <span className="students__name">
                  {student.name}
                  {student.id === activeStudent.id && (
                    <span className="students__active"> · activo</span>
                  )}
                </span>
                {student.id !== activeStudent.id && (
                  <button type="button" onClick={() => switchStudent(student.id)}>
                    Elegir
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setEditing({ id: student.id, name: student.name })}
                >
                  Renombrar
                </button>
                {students.length > 1 && (
                  <button type="button" onClick={() => handleRemove(student)}>
                    Eliminar
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="students__row students__add">
        <input
          aria-label="Nombre del nuevo estudiante"
          placeholder="Nuevo estudiante"
          value={newName}
          maxLength={40}
          onChange={(event) => setNewName(event.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      <h2>Respaldo</h2>
      <p>
        Los datos viven solo en este navegador. Si borras los datos del sitio, se pierden: exporta
        un respaldo de vez en cuando.
      </p>
      <div className="students__row">
        <button type="button" onClick={handleExport}>
          Exportar respaldo
        </button>
        <label className="students__import">
          Importar respaldo
          <input type="file" accept="application/json,.json" onChange={handleImport} />
        </label>
      </div>
    </section>
  )
}

export default StudentsPage
