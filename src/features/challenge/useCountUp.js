import { useEffect, useRef, useState } from 'react'

const DURATION_MS = 600

/**
 * Eases a number toward `target` so a new score reads as points being added,
 * not a jump. `from` sets where the first count starts. With reduced motion
 * it jumps straight to the value.
 */
export function useCountUp(target, { duration = DURATION_MS, from = target } = {}) {
  const [value, setValue] = useState(from)
  const current = useRef(from)

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const from = current.current
    const length = reduced ? 0 : duration
    const start = performance.now()
    let frame
    const tick = (now) => {
      const t = length ? Math.min((now - start) / length, 1) : 1
      const next = from + (target - from) * (1 - (1 - t) ** 3)
      current.current = next
      setValue(next)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return Math.round(value)
}
