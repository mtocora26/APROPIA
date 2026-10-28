import assert from 'node:assert/strict'
import test from 'node:test'
import { runProgram } from './index.js'

const run = (source, inputs) => runProgram(source, { inputs })

test('asigna, calcula y escribe', () => {
  const result = run('Algoritmo A\n  x <- 2\n  x <- (x + 3) * 2\n  Escribir x\nFinAlgoritmo')
  assert.equal(result.ok, true)
  assert.equal(result.output, '10\n')
})

test('Leer recibe datos y Si decide', () => {
  const source = `Algoritmo PrimerosPasos
    Definir nota Como Real;
    Leer nota;
    Si nota >= 3 Entonces
        Escribir "Aprueba";
    Sino
        Escribir "No aprueba";
    FinSi;
FinAlgoritmo`
  assert.equal(run(source, ['2.9']).output, 'No aprueba\n')
  assert.equal(run(source, ['3']).output, 'Aprueba\n')
})

test('pide un dato cuando no hay más entradas', () => {
  const result = run('Leer x\nEscribir x', [])
  assert.equal(result.needsInput, true)
  assert.equal(result.ok, false)
})

test('Mientras con centinela: suma y contador', () => {
  const source = `suma <- 0
contador <- 0
Leer nota
Mientras nota <> -1 Hacer
    suma <- suma + nota
    contador <- contador + 1
    Leer nota
FinMientras
Escribir suma, " y ", contador`
  assert.equal(run(source, ['4', '3', '-1']).output, '7 y 2\n')
  assert.equal(run(source, ['-1']).output, '0 y 0\n')
})

test('Mientras puede ejecutarse cero veces y detecta ciclos infinitos', () => {
  const infinite = runProgram('x <- 1\nMientras x <= 3 Hacer\n  Escribir x\nFinMientras', { maxSteps: 200 })
  assert.equal(infinite.ok, false)
  assert.match(infinite.error.message, /pasos/)
})

test('Repetir ejecuta al menos una vez y vuelve a pedir si es inválido', () => {
  const source = `Repetir
    Escribir "Nota:"
    Leer nota
Hasta Que (nota >= 0) Y (nota <= 5)
Escribir "ok ", nota`
  const result = run(source, ['-2', '6', '5'])
  assert.equal(result.output, 'Nota:\nNota:\nNota:\nok 5\n')
})

test('Para cuenta, con paso y hacia atrás', () => {
  assert.equal(run('Para i <- 1 Hasta 5 Con Paso 2 Hacer\n Escribir i\nFinPara').output, '1\n3\n5\n')
  assert.equal(run('Para i <- 3 Hasta 1 Con Paso -1 Hacer\n Escribir i\nFinPara').output, '3\n2\n1\n')
  assert.equal(run('Para i <- 5 Hasta 1 Hacer\n Escribir i\nFinPara').output, '')
})

test('programa completo del reto final', () => {
  const source = `Algoritmo NotasDelGrupo
    Definir n, i, aprobados Como Entero;
    Definir nota, suma, promedio Como Real;
    Repetir
        Escribir "Cantidad de estudiantes (> 0):";
        Leer n;
    Hasta Que n > 0;
    suma <- 0;
    aprobados <- 0;
    Para i <- 1 Hasta n Con Paso 1 Hacer
        Repetir
            Escribir "Nota de estudiante ", i, " (0 a 5):";
            Leer nota;
        Hasta Que (nota >= 0) Y (nota <= 5);
        suma <- suma + nota;
        Si nota >= 3 Entonces
            aprobados <- aprobados + 1;
        FinSi;
    FinPara;
    promedio <- suma / n;
    Escribir "Promedio: ", promedio;
    Escribir "Aprobados: ", aprobados;
FinAlgoritmo`
  const result = run(source, ['0', '2', '-1', '0', '5'])
  assert.equal(result.ok, true)
  assert.match(result.output, /Promedio: 2\.5\nAprobados: 1\n$/)
})

test('la traza dice qué línea corre y qué variable cambió', () => {
  const result = run('x <- 1\nx <- x + 1')
  assert.deepEqual(result.trace.map((step) => step.line), [1, 2])
  assert.deepEqual(result.trace[1].changed, ['x'])
  assert.equal(result.trace[1].vars[0].text, '1')
})

test('errores en español con número de línea', () => {
  assert.deepEqual(run('Escribir y').error, { message: 'La variable «y» no existe. ¿La definiste o le diste un valor antes?', line: 1 })
  assert.match(run('x <- 1 / 0').error.message, /cero/)
  assert.match(run('Si x Entonces\nFinSi').error.message, /no existe/)
  assert.match(run('Mientras 1 < 2 Hacer\nEscribir 1').error.message, /FinMientras/)
  assert.match(run('Definir n Como Entero\nLeer n', ['2.5']).error.message, /Entero/)
  assert.match(run('Definir n Como Real\nn <- "hola"').error.message, /Real/)
})

test('sintaxis sin mayúsculas ni tildes, comentarios y operadores', () => {
  const source = `// comentario
proceso demo
  definir a como entero
  a <- 7 mod 3
  si a = 1 y no (a > 2) entonces
    escribir "uno" sin saltar
  finsi
  escribir 2 ^ 3, " ", Verdadero
finproceso`
  assert.equal(run(source).output, 'uno8 VERDADERO\n')
})

test('una estructura sin cerrar dice cuál falta, no «quisiste asignar»', () => {
  const sinFinSi = 'Algoritmo A\n  Si 1 < 2 Entonces\n    Escribir 1\nFinAlgoritmo'
  assert.deepEqual(run(sinFinSi).error, { message: 'Falta FinSi.', line: 4 })
  const sinFinMientras = 'Algoritmo A\n  Mientras 1 < 2 Hacer\n    Escribir 1\nFinAlgoritmo'
  assert.match(run(sinFinMientras).error.message, /FinMientras/)
})

test('Si anidado: el Sino pertenece al Si más cercano', () => {
  const source = `Leer n
Si n > 0 Entonces
    Si n > 10 Entonces
        Escribir "grande"
    Sino
        Escribir "chico"
    FinSi
Sino
    Escribir "no positivo"
FinSi`
  assert.equal(run(source, ['20']).output, 'grande\n')
  assert.equal(run(source, ['5']).output, 'chico\n')
  assert.equal(run(source, ['-1']).output, 'no positivo\n')
})
