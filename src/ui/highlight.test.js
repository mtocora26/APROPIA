import assert from 'node:assert/strict'
import test from 'node:test'
import { highlight } from './highlight.js'

const kinds = (line) => line.filter((part) => part.kind !== 'plain').map((part) => `${part.kind}:${part.text}`)

test('marca estructuras, E/S, tipos, números y la flecha de asignación', () => {
  const [a, b, c] = highlight('Mientras x <= 3 Hacer\n    Escribir "hola";\nDefinir n Como Entero; x <- 2')
  assert.deepEqual(kinds(a), ['struct:Mientras', 'op:<=', 'number:3', 'struct:Hacer'])
  assert.deepEqual(kinds(b), ['io:Escribir', 'string:"hola"'])
  assert.deepEqual(kinds(c), ['io:Definir', 'io:Como', 'type:Entero', 'arrow:<-', 'number:2'])
})

test('no distingue mayúsculas ni tildes en las palabras clave', () => {
  assert.deepEqual(kinds(highlight('FINSI; sino')[0]), ['struct:FINSI', 'struct:sino'])
  assert.deepEqual(kinds(highlight('(a >= 1) Y (b <> 2)')[0]), ['op:>=', 'number:1', 'logic:Y', 'op:<>', 'number:2'])
})

test('los comentarios cubren hasta el final de la línea', () => {
  assert.deepEqual(kinds(highlight('x <- 1 // si esto no es Si')[0]), ['arrow:<-', 'number:1', 'comment:// si esto no es Si'])
})

test('los huecos de plantilla solo existen si se piden', () => {
  assert.deepEqual(kinds(highlight('Si <condición> Entonces', { placeholders: true })[0]), ['struct:Si', 'placeholder:<condición>', 'struct:Entonces'])
  assert.deepEqual(kinds(highlight('a <b> c')[0]), ['op:<', 'op:>'])
})

test('resalta C#', () => {
  const line = highlight('if (nota >= 3 && ok) return;', { lang: 'csharp' })[0]
  assert.deepEqual(kinds(line), ['struct:if', 'op:>=', 'number:3', 'op:&&', 'struct:return'])
})

test('resalta Python sin interpretar // como comentario', () => {
  const line = highlight('for i in range(3):  # vueltas', { lang: 'python' })[0]
  assert.deepEqual(kinds(line), ['struct:for', 'struct:in', 'io:range', 'number:3', 'comment:# vueltas'])
  assert.deepEqual(kinds(highlight('x = 5 // 2', { lang: 'python' })[0]), ['op:=', 'number:5', 'op://', 'number:2'])
})

test('conserva el texto original al unir los fragmentos', () => {
  const source = 'Si (a >= 1) Entonces\n    Escribir "x";'
  const rebuilt = highlight(source).map((line) => line.map((part) => part.text).join('')).join('\n')
  assert.equal(rebuilt, source)
})
