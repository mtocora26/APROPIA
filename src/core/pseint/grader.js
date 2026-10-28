// Califica código de PSeInt corriéndolo contra casos de prueba.
//
// Un caso: { name, inputs?: string[], contains?: string[], notContains?: string[],
//            lines?: string[], usesAllInputs?: boolean }
//   contains      cada texto debe aparecer en la salida (sin distinguir mayúsculas)
//   notContains   ninguno debe aparecer
//   lines         la salida, línea a línea, debe terminar exactamente en estas líneas
//   usesAllInputs el programa debe haber leído todos los datos (p. ej. validación que repite)
import { runProgram } from './index.js'

const fold = (text) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/**
 * @param {string} source
 * @param {object[]} tests
 * @param {{ maxSteps?: number }} [options]
 * @returns {{ passed: boolean, results: { name: string, passed: boolean, reason: string|null, output: string }[] }}
 */
export function gradeProgram(source, tests, { maxSteps = 5000 } = {}) {
  const results = tests.map((test) => gradeCase(source, test, maxSteps))
  return { passed: results.every((result) => result.passed), results }
}

function gradeCase(source, test, maxSteps) {
  const run = runProgram(source, { inputs: test.inputs ?? [], maxSteps, random: () => 0.5 })
  const name = test.name ?? `Entradas: ${(test.inputs ?? []).join(', ') || 'ninguna'}`
  const fail = (reason) => ({ name, passed: false, reason, output: run.output })

  if (run.error) {
    const where = run.error.line ? ` (línea ${run.error.line})` : ''
    return fail(`${run.error.message}${where}`)
  }
  if (run.needsInput) return fail('El programa pidió más datos de los que esta prueba entrega.')

  const output = fold(run.output)
  for (const wanted of test.contains ?? []) {
    if (!output.includes(fold(wanted))) return fail(`La salida debería incluir «${wanted}».`)
  }
  for (const banned of test.notContains ?? []) {
    if (output.includes(fold(banned))) return fail(`La salida no debería incluir «${banned}».`)
  }
  if (test.lines) {
    const got = run.output.split('\n').filter((line) => line !== '').slice(-test.lines.length)
    const same = got.length === test.lines.length && got.every((line, i) => fold(line.trim()) === fold(test.lines[i]))
    if (!same) return fail(`Se esperaba terminar con: ${test.lines.join(' / ')}.`)
  }
  if (test.usesAllInputs && run.inputsUsed < (test.inputs ?? []).length) {
    return fail(`Debía leer los ${test.inputs.length} datos y solo leyó ${run.inputsUsed}.`)
  }

  return { name, passed: true, reason: null, output: run.output }
}
