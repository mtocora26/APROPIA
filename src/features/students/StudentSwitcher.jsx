import { Link } from 'react-router-dom'
import { ADMIN_STUDENT_ID } from '../../core/students/studentModel.js'
import { useStudents } from './studentContext.js'

/** Header control to pick which student is being tutored. */
function StudentSwitcher() {
  const { students, activeStudent, switchStudent } = useStudents()

  return (
    <div className="student-switcher">
      <label className="student-switcher__label">
        <span className="visually-hidden">Perfil activo</span>
        <select
          value={activeStudent.id}
          onChange={(event) => switchStudent(event.target.value)}
        >
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.id === ADMIN_STUDENT_ID ? 'Tutor (admin) · acceso libre' : student.name}
            </option>
          ))}
        </select>
      </label>
      <Link to="/estudiantes" className="student-switcher__manage">
        Gestionar
      </Link>
    </div>
  )
}

export default StudentSwitcher
