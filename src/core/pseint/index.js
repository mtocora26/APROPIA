// API pública del motor de PSeInt. La interfaz y los ejercicios solo importan de aquí.
import { PseintError } from './lexer.js'
import { createProgram } from './interpreter.js'

export { PseintError } from './lexer.js'
export { formatValue, createProgram, DEFAULT_MAX_STEPS } from './interpreter.js'

/**
 * Ejecuta un programa completo con los datos de entrada dados y devuelve todo
 * lo que pasó: salida, errores y una traza línea por línea (para el modo
 * «ver paso a paso» y para calificar ejercicios de código).
 *
 * @param {string} source
 * @param {{ inputs?: string[], maxSteps?: number, random?: () => number }} [options]
 * @returns {{
 *   ok: boolean,
 *   output: string,
 *   error: { message: string, line: number|null } | null,
 *   needsInput: boolean,
 *   inputsUsed: number,
 *   steps: number,
 *   trace: { line: number, vars: object[], changed: string[] }[],
 * }}
 */
export function runProgram(source, { inputs = [], maxSteps, random } = {}) {
  const result = { ok: false, output: '', error: null, needsInput: false, inputsUsed: 0, steps: 0, trace: [] }
  let program
  try {
    program = createProgram(source, { maxSteps, random })
  } catch (error) {
    return { ...result, error: toError(error) }
  }

  const queue = [...inputs]
  const generator = program.start()
  let reply

  try {
    for (;;) {
      const { value: event, done } = generator.next(reply)
      reply = undefined
      if (done) break

      if (event.type === 'step') {
        result.trace.push({ line: event.line, vars: program.snapshot(), changed: program.takeChanged() })
      } else if (event.type === 'output') {
        result.output += event.newline ? `${event.text}\n` : event.text
      } else if (event.type === 'input') {
        if (queue.length === 0) {
          result.needsInput = true
          break
        }
        reply = queue.shift()
        result.inputsUsed += 1
      }
    }
    result.ok = !result.needsInput
  } catch (error) {
    result.error = toError(error)
  }

  result.steps = program.stepCount()
  return result
}

function toError(error) {
  if (error instanceof PseintError) return { message: error.message, line: error.line }
  throw error
}
