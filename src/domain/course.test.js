import assert from 'node:assert/strict'
import test from 'node:test'
import {
  findLesson,
  findNextLesson,
  listLessons,
  sampleReview,
  validateCourse,
} from './course.js'

function minimalCourse(exercises, extra = {}) {
  return {
    id: 'test-course',
    title: 'Test',
    language: 'it',
    level: 'A1',
    modules: [
      {
        id: 'm1',
        title: 'Module',
        lessons: [{ id: 'l1', title: 'Lesson', theory: [], exercises }],
      },
    ],
    ...extra,
  }
}

const choice = {
  id: 'e1',
  type: 'choice',
  prompt: '?',
  options: ['a', 'b'],
  answer: 'a',
}

test('accepts a valid course', () => {
  const course = minimalCourse([choice])
  assert.equal(validateCourse(course), course)
})

test('reports the path of the invalid field', () => {
  assert.throws(
    () => validateCourse(minimalCourse([{ ...choice, answer: 'z' }])),
    /course\.modules\[0\]\.lessons\[0\]\.exercises\[0\]\.answer must be one of the options/,
  )
})

test('rejects duplicated ids across the course', () => {
  assert.throws(
    () => validateCourse(minimalCourse([choice, { ...choice }])),
    /"e1" is duplicated/,
  )
})

test('rejects unknown exercise types', () => {
  assert.throws(
    () => validateCourse(minimalCourse([{ ...choice, type: 'quiz' }])),
    /type must be one of/,
  )
})

test('requires reorder answers to use exactly the given tokens', () => {
  const reorder = {
    id: 'e1',
    type: 'reorder',
    prompt: '?',
    tokens: ['sono', 'Io'],
    answer: ['Io', 'sono'],
  }

  assert.doesNotThrow(() => validateCourse(minimalCourse([reorder])))
  assert.throws(
    () => validateCourse(minimalCourse([{ ...reorder, answer: ['Io', 'sei'] }])),
    /answer must use exactly the same tokens/,
  )
  assert.throws(
    () =>
      validateCourse(
        minimalCourse([{ ...reorder, alternatives: [['Io', 'Io']] }]),
      ),
    /alternatives\[0\] must use exactly the same tokens/,
  )
})

test('rejects match exercises with repeated sides', () => {
  const match = {
    id: 'e1',
    type: 'match',
    prompt: '?',
    pairs: [
      ['io', 'sono'],
      ['loro', 'sono'],
    ],
  }

  assert.throws(
    () => validateCourse(minimalCourse([match])),
    /pairs must not contain duplicates/,
  )
})

test('requires every spelled letter to have a city in the alphabet', () => {
  const alphabet = [
    { letter: 'A', name: 'a', cities: ['Ancona'] },
    { letter: 'K', name: 'cappa', cities: [] },
  ]
  const spelling = { id: 'e1', type: 'spelling', prompt: '?', word: 'AKA' }

  assert.throws(
    () => validateCourse(minimalCourse([{ ...spelling, word: 'AA' }])),
    /need a course\.alphabet/,
  )
  assert.throws(
    () => validateCourse(minimalCourse([spelling], { alphabet })),
    /letter "K" has no city/,
  )
})

test('rejects alphabet cities that do not start with their letter', () => {
  const alphabet = [{ letter: 'A', name: 'a', cities: ['Bologna'] }]

  assert.throws(
    () => validateCourse(minimalCourse([choice], { alphabet })),
    /cities\[0\] must start with "A"/,
  )
})

test('requires table rows to match the number of columns', () => {
  const course = minimalCourse([choice])
  course.modules[0].lessons[0].theory = [
    { type: 'table', columns: ['a', 'b'], rows: [['1']] },
  ]

  assert.throws(() => validateCourse(course), /rows\[0\] must have 2 cells/)
})

function twoLessonCourse() {
  const course = minimalCourse([choice])
  course.modules[0].lessons.push({
    id: 'l2',
    title: 'Lesson 2',
    theory: [],
    exercises: [{ ...choice, id: 'e2' }],
  })
  return course
}

test('modules with 2+ lessons end with a generated review lesson', () => {
  const course = twoLessonCourse()
  const lessons = listLessons(course)

  assert.deepEqual(
    lessons.map((lesson) => lesson.id),
    ['l1', 'l2', 'm1-repaso'],
  )
  assert.deepEqual(
    lessons[2].exercises.map((exercise) => exercise.id),
    ['e1', 'e2'],
  )
  assert.equal(findLesson(course, 'm1-repaso').lesson.review, true)
  assert.equal(findNextLesson(course, 'l2').id, 'm1-repaso')
  assert.equal(findNextLesson(course, 'm1-repaso'), null)
})

test('single-lesson modules have no review lesson', () => {
  assert.deepEqual(
    listLessons(minimalCourse([choice])).map((lesson) => lesson.id),
    ['l1'],
  )
})

test('the review lesson id is reserved', () => {
  const course = twoLessonCourse()
  course.modules[0].lessons[1].id = 'm1-repaso'

  assert.throws(() => validateCourse(course), /reserved for the module review/)
})

test('review draws from module reviewExercises, balanced across lessons', () => {
  const course = twoLessonCourse()
  course.modules[0].reviewExercises = [
    { ...choice, id: 'r1', from: 'l1' },
    { ...choice, id: 'r2', from: 'l1' },
    { ...choice, id: 'r3', from: 'l2' },
  ]
  validateCourse(course)

  const review = findLesson(course, 'm1-repaso').lesson
  assert.deepEqual(review.exercises.map((exercise) => exercise.id), ['r1', 'r2', 'r3'])

  const picked = sampleReview(review.exerciseGroups, 2).map((exercise) => exercise.from)
  assert.deepEqual([...picked].sort(), ['l1', 'l2'])
  assert.equal(sampleReview(review.exerciseGroups, 10).length, 3)
})

test('reviewExercises must cover every lesson of the module', () => {
  const course = twoLessonCourse()
  course.modules[0].reviewExercises = [{ ...choice, id: 'r1', from: 'l1' }]

  assert.throws(() => validateCourse(course), /needs at least one exercise from "l2"/)
})
