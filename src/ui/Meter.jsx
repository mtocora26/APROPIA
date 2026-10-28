import './hud.css'

/** Segmented meter. `value` of `max`, drawn as `segments` blocks. */
function Meter({ value, max, label, segments = 10 }) {
  const filled = max > 0 ? Math.min(segments, Math.max(0, Math.round((value / max) * segments))) : 0

  return (
    <span className="meter" role="img" aria-label={label}>
      {Array.from({ length: segments }, (_, i) => (
        <i key={i} className={i < filled ? 'meter__block meter__block--on' : 'meter__block'} />
      ))}
    </span>
  )
}

export default Meter
