import { useCallback, useRef, useState } from 'react'
import { PseintError, createProgram } from '../../core/pseint/index.js'

export const SANDBOX_STATUS = Object.freeze({
  IDLE: 'idle',
  PAUSED: 'paused',
  INPUT: 'input',
  DONE: 'done',
  ERROR: 'error',
})

const IDLE_VIEW = Object.freeze({
  status: SANDBOX_STATUS.IDLE,
  line: null,
  vars: [],
  changed: [],
  output: '',
  error: null,
  pending: null,
  steps: 0,
})

/**
 * Ejecuta un programa de PSeInt en la interfaz. `run` corre hasta terminar o
 * hasta un Leer; `step` avanza de línea en línea. El código no se interpreta
 * aquí: eso lo hace core/pseint.
 */
export function useSandbox() {
  const session = useRef(null)
  const [view, setView] = useState(IDLE_VIEW)

  const pump = useCallback((mode, reply) => {
    const current = session.current
    if (!current) return
    const { program, generator } = current
    const show = (patch) => setView({ ...IDLE_VIEW, output: current.output, vars: program.snapshot(), steps: program.stepCount(), ...patch })

    try {
      let message = reply
      for (;;) {
        const { value: event, done } = generator.next(message)
        message = undefined

        if (done) {
          show({ status: SANDBOX_STATUS.DONE, changed: program.takeChanged() })
          return
        }
        if (event.type === 'output') {
          current.output += event.newline === false ? event.text : `${event.text}\n`
        } else if (event.type === 'input') {
          current.mode = mode
          show({ status: SANDBOX_STATUS.INPUT, line: event.line, pending: event, changed: program.takeChanged() })
          return
        } else if (event.type === 'step' && mode === 'step') {
          show({ status: SANDBOX_STATUS.PAUSED, line: event.line, changed: program.takeChanged() })
          return
        }
      }
    } catch (error) {
      if (!(error instanceof PseintError)) throw error
      show({ status: SANDBOX_STATUS.ERROR, line: error.line, error: { message: error.message, line: error.line } })
    }
  }, [])

  const begin = useCallback((source, mode) => {
    try {
      const program = createProgram(source)
      session.current = { program, generator: program.start(), output: '', mode }
    } catch (error) {
      if (!(error instanceof PseintError)) throw error
      session.current = null
      setView({ ...IDLE_VIEW, status: SANDBOX_STATUS.ERROR, line: error.line, error: { message: error.message, line: error.line } })
      return
    }
    pump(mode)
  }, [pump])

  return {
    view,
    /** Ejecuta de corrido (o reanuda hasta el final). */
    run: useCallback((source) => {
      if (view.status === SANDBOX_STATUS.PAUSED) pump('run')
      else begin(source, 'run')
    }, [begin, pump, view.status]),
    /** Avanza una línea; si no había ejecución, la empieza. */
    step: useCallback((source) => {
      if (view.status === SANDBOX_STATUS.PAUSED) pump('step')
      else begin(source, 'step')
    }, [begin, pump, view.status]),
    /** Entrega el dato que pidió Leer. */
    submitInput: useCallback((text) => pump(session.current?.mode ?? 'run', text), [pump]),
    reset: useCallback(() => {
      session.current = null
      setView(IDLE_VIEW)
    }, []),
  }
}
