import assert from 'node:assert/strict'
import test from 'node:test'
import { courseFromDraft } from './routeFromAi.js'

const draft = {
  title: ' Ciclos en PSeInt ',
  summary: 'Mientras, Repetir y Para.',
  modules: [
    {
      title: 'Ciclos',
      lessons: [
        {
          title: 'Mientras',
          theory: [{ kind: 'text', text: 'Repite mientras la condición sea verdadera.' }, { kind: 'tip', text: ' ' }],
          exercises: [
            { type: 'choice', prompt: '¿Cuándo se evalúa?', options: ['Antes', 'Después', 'Antes'], answer: 'Antes', explanation: 'Al inicio.' },
            { type: 'choice', prompt: 'Roto', options: ['A', 'B'], answer: 'C', explanation: '' },
            { type: 'match', prompt: 'Relaciona', pairs: [{ left: 'Mientras', right: 'antes' }, { left: 'Repetir', right: 'después' }], explanation: '' },
            { type: 'typed', prompt: 'Completa', sentence: 'Fin___', answer: 'Mientras', alternatives: ['Mientras', 'mientras'], explanation: '' },
            { type: 'open', prompt: 'Explica', modelAnswer: 'Porque…', hints: [], explanation: '' },
          ],
        },
        { title: 'Vacía', theory: [], exercises: [{ type: 'open', prompt: 'x', modelAnswer: '', hints: [], explanation: '' }] },
      ],
    },
    { title: 'Sin lecciones', lessons: [] },
  ],
}

test('builds a valid course with derived ids and drops broken parts', () => {
  const course = courseFromDraft(draft, { id: 'ruta-abc' })
  assert.equal(course.title, 'Ciclos en PSeInt')
  assert.equal(course.generated, true)
  assert.equal(course.modules.length, 1)
  const [lesson] = course.modules[0].lessons
  assert.equal(course.modules[0].lessons.length, 1)
  assert.equal(lesson.id, 'ruta-abc-m1-l1')
  assert.deepEqual(lesson.theory, [{ type: 'text', text: 'Repite mientras la condición sea verdadera.' }])
  assert.deepEqual(lesson.exercises.map((e) => e.type), ['choice', 'match', 'typed', 'open'])
  assert.deepEqual(lesson.exercises[0].options, ['Antes', 'Después'])
  assert.deepEqual(lesson.exercises[1].pairs, [['Mientras', 'antes'], ['Repetir', 'después']])
  assert.deepEqual(lesson.exercises[2].alternatives, ['mientras'])
  assert.equal(lesson.exercises[3].hints, undefined)
})

test('a draft with nothing usable fails', () => {
  assert.throws(() => courseFromDraft({ title: 'x', modules: [] }, { id: 'ruta-x' }), TypeError)
  assert.throws(() => courseFromDraft(draft, { id: 'otro' }), TypeError)
})

test('strips the numbering models add to titles', () => {
  const numbered = {
    title: 'Ruta de Estudio: Ciclos',
    modules: [{ title: 'Módulo 1: Mientras', lessons: [{ title: 'Lección 2 - Repetir', theory: [], exercises: [{ type: 'open', prompt: 'p', modelAnswer: 'r' }] }] }],
  }
  const course = courseFromDraft(numbered, { id: 'ruta-n' })
  assert.equal(course.title, 'Ciclos')
  assert.equal(course.modules[0].title, 'Mientras')
  assert.equal(course.modules[0].lessons[0].title, 'Repetir')
})
