import { useEffect, useEffectEvent, useState } from 'react'

const TICK_MS = 100
const HURRY_MS = 5_000

/**
 * Countdown bar for one question. Remount it (with `key`) for each question;
 * it calls `onExpire` once when time runs out and freezes while `running` is false.
 */
function QuestionTimer({ limitMs, startedAt, running, onExpire }) {
  const [now, setNow] = useState(startedAt)
  const expire = useEffectEvent(onExpire)

  useEffect(() => {
    if (!running) return undefined
    const timer = setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (current - startedAt >= limitMs) {
        clearInterval(timer)
        expire()
      }
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [limitMs, running, startedAt])

  const remaining = Math.max(0, limitMs - (now - startedAt))
  const seconds = Math.ceil(remaining / 1000)

  return (
    <div className={`reto-timer${remaining <= HURRY_MS ? ' reto-timer--hurry' : ''}`}>
      <span className="reto-timer__track" aria-hidden="true">
        <span className="reto-timer__bar" style={{ transform: `scaleX(${remaining / limitMs})` }} />
      </span>
      <span className="reto-timer__seconds" aria-label={`Quedan ${seconds} segundos`}>
        {seconds} s
      </span>
    </div>
  )
}

export default QuestionTimer
