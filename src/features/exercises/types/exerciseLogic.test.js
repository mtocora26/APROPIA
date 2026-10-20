import assert from 'node:assert/strict'
import test from 'node:test'
import { ITALIAN_ALPHABET } from '../../../content/courses/italian-a1/alphabet.js'
import {
  checkAnswer,
  correctAnswerText,
  prepareExercise,
  shuffle,
  speakableText,
  visibleDialogueLines,
} from './exerciseLogic.js'

const context = { alphabet: ITALIAN_ALPHABET }

// Deterministic "random" so shuffles are reproducible in tests.
function seededRandom(seed = 1) {
  let state = seed
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

const choice = { type: 'choice', options: ['a', 'b', 'c'], answer: 'b' }
const typed = { type: 'typed', answer: 'Buonanotte', alternatives: ['Buona notte'] }
const reorder = {
  type: 'reorder',
  tokens: ['sono', 'Io', 'Eva'],
  answer: ['Io', 'sono', 'Eva'],
  alternatives: [['Eva', 'sono', 'Io']],
}
const match = {
  type: 'match',
  pairs: [
    ['io', 'sono'],
    ['tu', 'sei'],
  ],
}
const spelling = { type: 'spelling', word: 'ROSSI' }

test('shuffle keeps every element', () => {
  const result = shuffle([1, 2, 3, 4, 5], seededRandom())
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5])
})

test('choice: only the answer is correct', () => {
  assert.equal(checkAnswer('b', choice), true)
  assert.equal(checkAnswer('a', choice), false)
})

test('typed: accepts the answer and its alternatives, normalized', () => {
  assert.equal(checkAnswer('buonanotte!', typed), true)
  assert.equal(checkAnswer(' Buona  notte ', typed), true)
  assert.equal(checkAnswer('buonasera', typed), false)
})

test('reorder: accepts the answer and alternative orders', () => {
  assert.equal(checkAnswer(['Io', 'sono', 'Eva'], reorder), true)
  assert.equal(checkAnswer(['Eva', 'sono', 'Io'], reorder), true)
  assert.equal(checkAnswer(['sono', 'Io', 'Eva'], reorder), false)
})

test('reorder: the prepared bank never starts solved', () => {
  for (let seed = 1; seed < 50; seed++) {
    const prepared = prepareExercise(reorder, { random: seededRandom(seed) })
    const texts = prepared.view.tokens.map((token) => token.text)
    assert.equal(checkAnswer(texts, reorder), false, `seed ${seed}`)
  }
})

test('match: correct only when every attempt was a right pair', () => {
  assert.equal(checkAnswer({ attempts: [['io', 'sono'], ['tu', 'sei']] }, match), true)
  assert.equal(
    checkAnswer({ attempts: [['io', 'sei'], ['io', 'sono'], ['tu', 'sei']] }, match),
    false,
  )
})

test('spelling: accepts any city of each letter', () => {
  assert.equal(
    checkAnswer(['Roma', 'Otranto', 'Savona', 'Salerno', 'Imola'], spelling, context),
    true,
  )
  assert.equal(
    checkAnswer(['Roma', 'Otranto', 'Savona', 'Imola'], spelling, context),
    false,
  )
  assert.equal(
    checkAnswer(['Rimini', 'Otranto', 'Savona', 'Savona', 'Ancona'], spelling, context),
    false,
  )
})

test('spelling: the bank has the needed cities plus distractors', () => {
  const prepared = prepareExercise(spelling, { ...context, random: seededRandom() })
  const bank = prepared.view.bank

  for (const city of ['Roma', 'Otranto', 'Savona', 'Imola']) {
    assert.ok(bank.includes(city), city)
  }
  assert.equal(bank.length, 4 + 3)
  assert.equal(new Set(bank).size, bank.length)
})

test('correctAnswerText describes the expected answer', () => {
  assert.equal(correctAnswerText(choice), 'b')
  assert.equal(correctAnswerText(reorder), 'Io sono Eva')
  assert.equal(
    correctAnswerText({ type: 'spelling', word: 'ANNA' }, context),
    'A di Ancona – N di Napoli – N di Napoli – A di Ancona',
  )
  assert.equal(correctAnswerText(match), 'io → sono · tu → sei')
})

test('speakableText skips match exercises', () => {
  assert.equal(speakableText(reorder), 'Io sono Eva')
  assert.equal(speakableText(match), null)
})

const open = {
  type: 'open',
  prompt: 'Cuéntale a un compañero qué has hecho hoy.',
  modelAnswer: 'I have had a busy day.',
}
const dialogue = {
  type: 'dialogue',
  lines: [
    { who: 'Waiter', text: 'Ready to order?' },
    { who: 'You', options: ['Yes, a coffee please.', 'Yesterday I coffee.'], answer: 'Yes, a coffee please.' },
    { who: 'Waiter', text: 'Anything else?' },
    { who: 'You', options: ['No, thanks.', 'No, thank.'], answer: 'No, thanks.' },
    { who: 'Waiter', text: 'Enjoy!' },
  ],
}

test('open: the result is whatever the student rated themselves', () => {
  assert.equal(checkAnswer({ selfRating: 'ok', text: '' }, open), true)
  assert.equal(checkAnswer({ selfRating: 'miss', text: 'x' }, open), false)
  assert.equal(checkAnswer(undefined, open), false)
  assert.equal(speakableText(open, context), 'I have had a busy day.')
  assert.equal(correctAnswerText(open, context), null)
})

test('dialogue: every chosen line must be the right one, in order', () => {
  assert.equal(checkAnswer({ choices: ['Yes, a coffee please.', 'No, thanks.'] }, dialogue), true)
  assert.equal(checkAnswer({ choices: ['Yes, a coffee please.', 'No, thank.'] }, dialogue), false)
  assert.equal(checkAnswer({ choices: ['Yes, a coffee please.'] }, dialogue), false)
  assert.equal(checkAnswer({}, dialogue), false)
})

test('dialogue: shows the conversation up to the next line to answer', () => {
  assert.equal(visibleDialogueLines(dialogue, 0).length, 2)
  assert.equal(visibleDialogueLines(dialogue, 1).length, 4)
  assert.equal(visibleDialogueLines(dialogue, 2).length, 5)
})

test('dialogue: shuffles options per line and writes the full correct text', () => {
  const prepared = prepareExercise(dialogue, { random: seededRandom() })

  assert.equal(prepared.view.options[0], null)
  assert.deepEqual([...prepared.view.options[1]].sort(), [...dialogue.lines[1].options].sort())
  assert.equal(
    correctAnswerText(dialogue, context),
    'Waiter: Ready to order? / You: Yes, a coffee please. / Waiter: Anything else? / You: No, thanks. / Waiter: Enjoy!',
  )
  assert.equal(speakableText(dialogue, context), null)
})
