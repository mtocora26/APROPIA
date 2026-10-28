import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isDemoMode } from '../../app/demoMode.js'
import { todayIso } from '../../core/routes/studyPlan.js'
import Logo from '../../ui/Logo.jsx'
import Leaderboard from './Leaderboard.jsx'
import { leaderboard } from './leaderboardStore.js'
import { CHALLENGE_PATH } from './paths.js'
import './challenge.css'

const REFRESH_MS = 3_000

/**
 * Full-screen ranking for a second screen at the booth. Open it in another
 * tab or window of the same browser: it updates when a player saves.
 */
function ChallengeBoardPage() {
  const [entries, setEntries] = useState(() => leaderboard.top(todayIso(), 10))

  useEffect(() => {
    const refresh = () => setEntries(leaderboard.top(todayIso(), 10))
    const onStorage = (event) => {
      if (event.key === leaderboard.STORAGE_KEY) refresh()
    }
    window.addEventListener('storage', onStorage)
    const timer = setInterval(refresh, REFRESH_MS)
    return () => {
      window.removeEventListener('storage', onStorage)
      clearInterval(timer)
    }
  }, [])

  function handleClear() {
    if (!window.confirm('¿Borrar todos los puntajes de hoy? No se puede deshacer.')) return
    leaderboard.clearDay(todayIso())
    setEntries([])
  }

  return (
    <main className="reto-board">
      <header className="reto-board__header">
        <Logo />
        <div>
          <p className="label">Reto APROPIA · XV Feria de Emprendimiento</p>
          <h1>Ranking del día</h1>
        </div>
      </header>
      <Leaderboard entries={entries} size="large" />
      <p className="reto-board__cta">
        Juega en el stand: 5 preguntas contra el reloj. <Link to={CHALLENGE_PATH}>Ir al reto</Link>
      </p>
      {/* For the booth staff, outside modo feria: wipe the test runs before opening. */}
      {!isDemoMode() && (
        <button type="button" className="reto-board__clear" onClick={handleClear}>
          Borrar el ranking de hoy
        </button>
      )}
    </main>
  )
}

export default ChallengeBoardPage
