/** Ranking rows; `highlightId` marks the player who just saved. */
function Leaderboard({ entries, highlightId, size = 'normal' }) {
  if (entries.length === 0) {
    return <p className="leaderboard__empty">Todavía nadie juega hoy. El primer puesto está libre.</p>
  }

  return (
    <ol className={`leaderboard leaderboard--${size}`}>
      {entries.map((entry, i) => (
        <li
          key={entry.id}
          className={`leaderboard__row${entry.id === highlightId ? ' leaderboard__row--you' : ''}`}
          style={{ '--i': i }}
        >
          <span className="leaderboard__rank">{i + 1}</span>
          <span className="leaderboard__who">
            <span className="leaderboard__alias">{entry.alias}</span>
            <small>
              {entry.topic} · {entry.correct}/{entry.total}
            </small>
          </span>
          <span className="leaderboard__score">{entry.score}</span>
        </li>
      ))}
    </ol>
  )
}

export default Leaderboard
