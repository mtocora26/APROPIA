import assert from 'node:assert/strict'
import test from 'node:test'
import { WINFORMS_CSHARP } from './index.js'

const lessons = WINFORMS_CSHARP.modules.flatMap((module) => module.lessons)
const CONTROL_NAME = /\b(?:txt|btn|lbl|lst|chk|cmb)[A-Z]\w*/g

test('cada lección tiene un formulario dibujado y notas para el tutor', () => {
  for (const lesson of lessons) {
    assert.ok(lesson.theory.some((block) => block.type === 'form'), `${lesson.id} sin formulario`)
    assert.ok(lesson.tutorNotes?.length >= 3, `${lesson.id} sin notas del tutor`)
  }
})

test('los controles que usa el código existen en el formulario de la lección', () => {
  for (const lesson of lessons) {
    const known = new Set(lesson.theory.filter((block) => block.type === 'form').flatMap((block) => block.controls.map((control) => control.name)))
    const used = lesson.theory.filter((block) => block.type === 'code').flatMap((block) => block.text.match(CONTROL_NAME) ?? [])
    // Los manejadores se llaman btnX_Click: el control es btnX.
    const missing = [...new Set(used.map((name) => name.replace(/_\w+$/, '')))].filter((name) => !known.has(name))
    assert.deepEqual(missing, [], `${lesson.id}: el código usa controles que no están en el dibujo`)
  }
})

test('los ejercicios que mencionan un control lo conocen', () => {
  for (const lesson of lessons) {
    const known = new Set(lesson.theory.filter((block) => block.type === 'form').flatMap((block) => block.controls.map((control) => control.name)))
    const generic = new Set(['txtEdad', 'txtA', 'txtB', 'txtNota', 'txtNombre', 'lblResultado', 'lblEstado', 'lblMensaje', 'lstTabla', 'btnSaludar', 'btnAgregar', 'lblAprobados', 'lblPromedio'])
    for (const exercise of lesson.exercises) {
      const text = JSON.stringify(exercise)
      for (const name of text.match(CONTROL_NAME) ?? []) {
        assert.ok(known.has(name.replace(/_\w+$/, '')) || generic.has(name.replace(/_\w+$/, '')), `${exercise.id}: «${name}» no existe`)
      }
    }
  }
})
