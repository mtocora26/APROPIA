import Meter from '../../ui/Meter.jsx'
import Panel from '../../ui/Panel.jsx'

/** Level progress, total XP and streak status for the home page. */
function PlayerStatsCard({ stats }) {
  if (!stats) return null

  return (
    <Panel as="section" className="player-card" aria-label="Tu progreso">
      <div className="player-card__row">
        <span className="player-card__level">Nivel {stats.level}</span>
        <span>{stats.totalXp} XP</span>
      </div>
      <Meter
        value={stats.xpInLevel}
        max={stats.xpForNext}
        label={`${stats.xpInLevel} de ${stats.xpForNext} XP para el nivel ${stats.level + 1}`}
      />
      <p className="player-card__hint">
        {stats.xpForNext - stats.xpInLevel} XP para el nivel {stats.level + 1}
      </p>
      <p className="player-card__streak">{streakMessage(stats)}</p>
    </Panel>
  )
}

function streakMessage({ streak, studiedToday }) {
  if (streak === 0) return 'Completa una lección hoy para empezar una racha.'
  const days = `${streak} ${streak === 1 ? 'día' : 'días'}`
  return studiedToday
    ? `Racha de ${days}. Hoy ya cumpliste.`
    : `Racha de ${days}. Estudia hoy para no perderla.`
}

export default PlayerStatsCard
