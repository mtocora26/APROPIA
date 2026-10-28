import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import PlayerBadge from '../features/gamification/PlayerBadge.jsx'
import { NOTES_UPLOAD_PATH } from '../features/routes/paths.js'
import StudentSwitcher from '../features/students/StudentSwitcher.jsx'
import Logo from '../ui/Logo.jsx'

// "Rutas" stays lit inside a course, a lesson or a generated route.
const ROUTES_SECTIONS = ['/inicio', '/curso/', '/ruta/', '/clase/']

const LINKS = [
  { to: '/inicio', label: 'Rutas', match: (path) => ROUTES_SECTIONS.some((prefix) => path.startsWith(prefix)) },
  { to: '/reto', label: 'Reto' },
  { to: '/laboratorio', label: 'Laboratorio' },
]


/**
 * App header. On lessons and card reviews (`immersive`) it shrinks to the
 * logo so the task has the screen. Under 768px the links fold into a menu.
 * In modo feria (`demo`) there is no navigation at all: just the logo, back
 * to the fair presentation.
 */
function AppHeader({ stats, immersive, demo = false }) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  if (immersive || demo) {
    return (
      <header className="app-header app-header--compact">
        <Link to={demo ? '/feria' : '/inicio'} className="app-brand" aria-label={demo ? 'APROPIA, presentación' : 'APROPIA, rutas'}>
          <Logo />
        </Link>
      </header>
    )
  }

  return (
    <header className={`app-header${open ? ' app-header--open' : ''}`}>
      <Link to="/" className="app-brand" aria-label="APROPIA, qué es">
        <Logo />
      </Link>

      <button
        type="button"
        className="app-header__toggle"
        aria-expanded={open}
        aria-controls="app-nav"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Cerrar' : 'Menú'}
      </button>

      {/* Any link inside closes the mobile menu. */}
      <div className="app-header__panel" id="app-nav" onClick={(event) => event.target.closest('a') && setOpen(false)}>
        <nav aria-label="Navegación principal" className="app-nav">
          <NavLink
            to={NOTES_UPLOAD_PATH}
            className={({ isActive }) => `app-nav__cta${isActive ? ' app-nav__cta--active' : ''}`}
          >
            Sube tus apuntes
          </NavLink>
          {LINKS.map(({ to, label, match }) => {
            const active = match ? match(pathname) : pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={`app-nav__link${active ? ' app-nav__link--active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            )
          })}
          <Link to="/" className="app-nav__about">
            Qué es APROPIA
          </Link>
        </nav>

        <div className="app-header__tools">
          <StudentSwitcher />
          <PlayerBadge stats={stats} />
        </div>
      </div>
    </header>
  )
}

export default AppHeader
