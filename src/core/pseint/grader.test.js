import assert from 'node:assert/strict'
import test from 'node:test'
import { gradeProgram } from './grader.js'

const EDAD = `Definir edad Como Entero
Leer edad
Si (edad >= 18) Y (edad <= 65) Entonces
    Escribir "Edad válida"
Sino
    Escribir "Edad inválida"
FinSi`

const tests = [
  { inputs: ['17'], contains: ['inválida'] },
  { inputs: ['18'], contains: ['válida'], notContains: ['inválida'] },
  { inputs: ['66'], contains: ['inválida'] },
]

test('aprueba cuando todos los casos pasan', () => {
  assert.equal(gradeProgram(EDAD, tests).passed, true)
})

test('señala el caso que falla y por qué', () => {
  const wrong = EDAD.replace('<= 65', '< 65')
  const grade = gradeProgram(wrong, [...tests, { inputs: ['65'], contains: ['válida'], notContains: ['inválida'] }])
  assert.equal(grade.passed, false)
  assert.equal(grade.results.filter((r) => !r.passed).length, 1)
  assert.match(grade.results.at(-1).reason, /no debería incluir/)
})

test('un error del programa cuenta como fallo con su línea', () => {
  const grade = gradeProgram('Escribir z', [{ inputs: [] }])
  assert.equal(grade.passed, false)
  assert.match(grade.results[0].reason, /línea 1/)
})

test('usesAllInputs exige que la validación repita', () => {
  const noValidation = 'Leer n\nEscribir "ok"'
  const grade = gradeProgram(noValidation, [{ inputs: ['0', '2'], usesAllInputs: true }])
  assert.equal(grade.passed, false)
  assert.match(grade.results[0].reason, /leyó 1/)
})

test('lines compara las últimas líneas de la salida', () => {
  const grade = gradeProgram('Para i <- 1 Hasta 3 Hacer\n Escribir i\nFinPara', [{ lines: ['2', '3'] }])
  assert.equal(grade.passed, true)
})
