/** Compact streak + level for the app header. */
function PlayerBadge({ stats }) {
  if (!stats) return null

  return (
    <p className="player-badge">
      <span
        className={`player-badge__streak${stats.studiedToday ? '' : ' player-badge__streak--pending'}`}
        aria-label={`Racha de ${stats.streak} días${stats.studiedToday ? '' : ', todavía no estudias hoy'}`}
        title={stats.studiedToday ? 'Racha asegurada hoy' : 'Estudia hoy para mantener la racha'}
      >
        <span className="label">Racha</span> {stats.streak}
      </span>
      <span className="player-badge__level" aria-label={`Nivel ${stats.level}`}>
        Nv {stats.level}
      </span>
    </p>
  )
}

export default PlayerBadge
