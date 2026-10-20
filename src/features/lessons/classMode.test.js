import assert from 'node:assert/strict'
import test from 'node:test'
import { buildClassSlides, exerciseMaterial, moveSlide, revealedAnswer } from './classMode.js'

const lesson = {
  theory: [{ type: 'text', text: 'a' }, { type: 'tip', text: 'b' }],
  exercises: [
    { id: 'e1', type: 'choice', options: ['x', 'y'], answer: 'y' },
    { id: 'e2', type: 'open', modelAnswer: 'I have eaten.', hints: ['eat'] },
  ],
}

test('slides: theory blocks first, then the exercises', () => {
  const slides = buildClassSlides(lesson)

  assert.deepEqual(slides.map((slide) => slide.kind), ['theory', 'theory', 'exercise', 'exercise'])
})

test('reveals the answer of each exercise type', () => {
  assert.equal(revealedAnswer(lesson.exercises[0], {}), 'y')
  assert.equal(revealedAnswer(lesson.exercises[1], {}), 'I have eaten.')
})

test('shows what the class needs before the answer', () => {
  assert.deepEqual(exerciseMaterial(lesson.exercises[0]), ['x', 'y'])
  assert.deepEqual(exerciseMaterial(lesson.exercises[1]), ['eat'])
  assert.deepEqual(exerciseMaterial({ type: 'typed', answer: 'z' }), [])
})

test('moving between slides stays inside the deck', () => {
  assert.equal(moveSlide(0, -1, 4), 0)
  assert.equal(moveSlide(1, 1, 4), 2)
  assert.equal(moveSlide(3, 1, 4), 3)
})
