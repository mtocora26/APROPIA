import { NavLink } from 'react-router-dom'
import { coursePath } from '../lessons/paths.js'
import { ENGLISH_COURSE_ID } from './useStudiedEnglish.js'
import './english.css'

const SECTIONS = [
  { to: coursePath(ENGLISH_COURSE_ID), label: 'Módulos', end: true },
  { to: '/ingles/estudiado', label: 'Lo estudiado' },
  { to: '/practica', label: 'Práctica' },
  { to: '/verbos', label: 'Verbos' },
  { to: '/flashcards', label: 'Flashcards' },
]

/** Sections of the English route: modules, what was studied, practice, verbs and flashcards. */
function EnglishNav() {
  return (
    <nav className="english-nav" aria-label="Ruta de inglés">
      {SECTIONS.map(({ to, label, end }) => (
        <NavLink key={to} to={to} end={end} className="english-nav__link">
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default EnglishNav
