import assert from 'node:assert/strict'
import test from 'node:test'
import { isExplanation, isQuickExercise, pickQuestions } from '../../core/challenge/challenge.js'
import { validateCourse } from '../../domain/course.js'
import { CHALLENGE_TOPICS } from './index.js'

// The Reto is played cold: a question cannot lean on a lesson the visitor never saw.
const NEEDS_CONTEXT = /\b(el|los|del) ejemplo\b|según (los|tus|el|la) (apuntes|texto|lección|material)|como (vimos|viste)|en la lección|anterior/i

for (const topic of CHALLENGE_TOPICS) {
  test(`${topic.id}: every question follows the content rules`, () => {
    validateCourse({
      id: topic.id,
      title: topic.title,
      language: topic.language,
      level: 'Reto',
      modules: [{ id: `${topic.id}-m`, title: topic.title, lessons: [{ id: `${topic.id}-l`, title: topic.title, theory: [], exercises: topic.questions }] }],
    })
  })

  test(`${topic.id}: enough questions for varied rounds, none needing context`, () => {
    assert.ok(topic.questions.filter(isQuickExercise).length >= 8, 'at least 8 quick questions')
    assert.ok(topic.questions.filter(isExplanation).length >= 2, 'at least 2 explanations')
    for (const question of topic.questions) {
      const text = [question.prompt, question.sentence].filter(Boolean).join(' ')
      assert.doesNotMatch(text, NEEDS_CONTEXT, `${question.id} needs context`)
    }
    const round = pickQuestions([topic.questions])
    assert.equal(round.length, 5)
    assert.ok(isExplanation(round.at(-1)))
  })
}
