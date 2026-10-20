/**
 * Content model shared by every course, whatever the language:
 *
 *   Course { id, title, language, level, alphabet?, modules: Module[] }
 *   Module { id, title, lessons: Lesson[] }
 *   Lesson { id, title, theory: TheoryBlock[], exercises: Exercise[] }
 *
 * Content lives in the bundle (`src/content/courses/`); only the user's
 * progress is persisted. `validateCourse` runs in tests so a typo in content
 * fails CI instead of breaking a lesson at runtime.
 */

export const EXERCISE_TYPES = Object.freeze([
  'choice',
  'typed',
  'reorder',
  'match',
  'spelling',
  'open',
  'dialogue',
])

export const THEORY_BLOCK_TYPES = Object.freeze([
  'text',
  'tip',
  'example',
  'table',
])

/**
 * @param {object} course
 * @returns {object} the same course, if valid
 * @throws {TypeError} with the path of the first invalid field
 */
export function validateCourse(course) {
  assertRecord(course, 'course')
  assertString(course.id, 'course.id')
  assertString(course.title, 'course.title')
  assertString(course.language, 'course.language')
  assertString(course.level, 'course.level')

  if (course.alphabet !== undefined) {
    validateAlphabet(course.alphabet, 'course.alphabet')
  }

  const ids = new Set()
  assertNonEmptyArray(course.modules, 'course.modules')
  course.modules.forEach((module, m) => {
    const modulePath = `course.modules[${m}]`
    assertRecord(module, modulePath)
    assertUniqueId(module.id, ids, `${modulePath}.id`)
    assertString(module.title, `${modulePath}.title`)

    assertNonEmptyArray(module.lessons, `${modulePath}.lessons`)
    module.lessons.forEach((lesson, l) => {
      const lessonPath = `${modulePath}.lessons[${l}]`
      assertRecord(lesson, lessonPath)
      assertUniqueId(lesson.id, ids, `${lessonPath}.id`)
      assertString(lesson.title, `${lessonPath}.title`)

      assertArray(lesson.theory, `${lessonPath}.theory`)
      lesson.theory.forEach((block, b) =>
        validateTheoryBlock(block, `${lessonPath}.theory[${b}]`),
      )

      assertNonEmptyArray(lesson.exercises, `${lessonPath}.exercises`)
      lesson.exercises.forEach((exercise, e) => {
        const exercisePath = `${lessonPath}.exercises[${e}]`
        assertRecord(exercise, exercisePath)
        assertUniqueId(exercise.id, ids, `${exercisePath}.id`)
        validateExercise(exercise, exercisePath, course.alphabet)
      })
    })
  })

  course.modules.forEach((module, m) => {
    if (ids.has(reviewLessonId(module))) {
      fail(`course.modules[${m}]`, `"${reviewLessonId(module)}" is reserved for the module review`)
    }
  })

  return course
}

export const MODULE_REVIEW_SAMPLE_SIZE = 10

/**
 * Lessons of a module in order. Modules with 2+ lessons end with a generated
 * "review" lesson that mixes a random sample of all their exercises.
 */
export function moduleLessons(module) {
  if (module.lessons.length < 2) return module.lessons

  return [
    ...module.lessons,
    {
      id: reviewLessonId(module),
      title: 'Repaso del módulo',
      review: true,
      sampleSize: MODULE_REVIEW_SAMPLE_SIZE,
      theory: [
        {
          type: 'text',
          text: 'Una mezcla de ejercicios de todas las lecciones del módulo, para fijar lo aprendido.',
        },
      ],
      exercises: module.lessons.flatMap((lesson) => lesson.exercises),
    },
  ]
}

/** @returns {{ module: object, lesson: object } | null} */
export function findLesson(course, lessonId) {
  for (const module of course.modules) {
    const lesson = moduleLessons(module).find((item) => item.id === lessonId)
    if (lesson) return { module, lesson }
  }
  return null
}

/** Lessons in course order, across modules (including module reviews). */
export function listLessons(course) {
  return course.modules.flatMap(moduleLessons)
}

export function findNextLesson(course, lessonId) {
  const lessons = listLessons(course)
  const index = lessons.findIndex((lesson) => lesson.id === lessonId)
  return index === -1 ? null : (lessons[index + 1] ?? null)
}

function reviewLessonId(module) {
  return `${module.id}-repaso`
}

function validateAlphabet(alphabet, path) {
  assertNonEmptyArray(alphabet, path)
  const letters = new Set()

  alphabet.forEach((entry, i) => {
    const entryPath = `${path}[${i}]`
    assertRecord(entry, entryPath)
    assertUniqueId(entry.letter, letters, `${entryPath}.letter`)
    assertString(entry.name, `${entryPath}.name`)
    assertStringArray(entry.cities, `${entryPath}.cities`, { allowEmpty: true })
    entry.cities.forEach((city, c) => {
      if (city[0].toUpperCase() !== entry.letter) {
        fail(`${entryPath}.cities[${c}]`, `must start with "${entry.letter}"`)
      }
    })
  })
}

function validateTheoryBlock(block, path) {
  assertRecord(block, path)
  assertOneOf(block.type, THEORY_BLOCK_TYPES, `${path}.type`)

  if (block.type === 'text' || block.type === 'tip') {
    assertString(block.text, `${path}.text`)
  }

  if (block.type === 'example') {
    assertString(block.text, `${path}.text`)
    assertString(block.translation, `${path}.translation`)
  }

  if (block.type === 'table') {
    assertStringArray(block.columns, `${path}.columns`)
    assertNonEmptyArray(block.rows, `${path}.rows`)
    block.rows.forEach((row, r) => {
      assertStringArray(row, `${path}.rows[${r}]`, { allowEmpty: true })
      if (row.length !== block.columns.length) {
        fail(`${path}.rows[${r}]`, `must have ${block.columns.length} cells`)
      }
    })
  }
}

function validateExercise(exercise, path, alphabet) {
  assertOneOf(exercise.type, EXERCISE_TYPES, `${path}.type`)
  assertString(exercise.prompt, `${path}.prompt`)
  assertOptionalString(exercise.explanation, `${path}.explanation`)

  switch (exercise.type) {
    case 'choice':
      assertOptionalString(exercise.sentence, `${path}.sentence`)
      assertStringArray(exercise.options, `${path}.options`)
      assertString(exercise.answer, `${path}.answer`)
      if (exercise.options.length < 2) {
        fail(`${path}.options`, 'must have at least 2 options')
      }
      if (!exercise.options.includes(exercise.answer)) {
        fail(`${path}.answer`, 'must be one of the options')
      }
      assertNoDuplicates(exercise.options, `${path}.options`)
      break

    case 'typed':
      assertOptionalString(exercise.sentence, `${path}.sentence`)
      assertString(exercise.answer, `${path}.answer`)
      if (exercise.alternatives !== undefined) {
        assertStringArray(exercise.alternatives, `${path}.alternatives`)
      }
      break

    case 'reorder':
      assertStringArray(exercise.tokens, `${path}.tokens`)
      assertStringArray(exercise.answer, `${path}.answer`)
      assertSameTokens(exercise.answer, exercise.tokens, `${path}.answer`)
      if (exercise.alternatives !== undefined) {
        assertArray(exercise.alternatives, `${path}.alternatives`)
        exercise.alternatives.forEach((alternative, a) => {
          const alternativePath = `${path}.alternatives[${a}]`
          assertStringArray(alternative, alternativePath)
          assertSameTokens(alternative, exercise.tokens, alternativePath)
        })
      }
      break

    case 'match':
      assertNonEmptyArray(exercise.pairs, `${path}.pairs`)
      exercise.pairs.forEach((pair, p) => {
        assertStringArray(pair, `${path}.pairs[${p}]`)
        if (pair.length !== 2) fail(`${path}.pairs[${p}]`, 'must have 2 items')
      })
      if (exercise.pairs.length < 2) {
        fail(`${path}.pairs`, 'must have at least 2 pairs')
      }
      assertNoDuplicates(exercise.pairs.map(([left]) => left), `${path}.pairs`)
      assertNoDuplicates(exercise.pairs.map(([, right]) => right), `${path}.pairs`)
      break

    case 'open':
      assertOptionalString(exercise.sentence, `${path}.sentence`)
      assertString(exercise.modelAnswer, `${path}.modelAnswer`)
      if (exercise.hints !== undefined) {
        assertStringArray(exercise.hints, `${path}.hints`)
      }
      break

    case 'dialogue': {
      assertNonEmptyArray(exercise.lines, `${path}.lines`)
      let yourLines = 0
      exercise.lines.forEach((line, i) => {
        const linePath = `${path}.lines[${i}]`
        assertRecord(line, linePath)
        assertString(line.who, `${linePath}.who`)
        if (line.options === undefined) {
          assertString(line.text, `${linePath}.text`)
          return
        }
        yourLines += 1
        assertStringArray(line.options, `${linePath}.options`)
        assertString(line.answer, `${linePath}.answer`)
        if (line.options.length < 2) fail(`${linePath}.options`, 'must have at least 2 options')
        if (!line.options.includes(line.answer)) fail(`${linePath}.answer`, 'must be one of the options')
        assertNoDuplicates(line.options, `${linePath}.options`)
      })
      if (yourLines === 0) fail(`${path}.lines`, 'needs at least one line with options')
      break
    }

    case 'spelling':
      assertString(exercise.word, `${path}.word`)
      if (!alphabet) {
        fail(path, 'spelling exercises need a course.alphabet')
      }
      for (const letter of exercise.word.toUpperCase()) {
        const entry = alphabet.find((item) => item.letter === letter)
        if (!entry || entry.cities.length === 0) {
          fail(`${path}.word`, `letter "${letter}" has no city in the alphabet`)
        }
      }
      break
  }
}

function assertSameTokens(order, tokens, path) {
  const sorted = (list) => [...list].sort().join('\u0000')
  if (sorted(order) !== sorted(tokens)) {
    fail(path, 'must use exactly the same tokens')
  }
}

function assertUniqueId(value, seen, path) {
  assertString(value, path)
  if (seen.has(value)) fail(path, `"${value}" is duplicated`)
  seen.add(value)
}

function assertNoDuplicates(values, path) {
  if (new Set(values).size !== values.length) {
    fail(path, 'must not contain duplicates')
  }
}

function assertOneOf(value, allowed, path) {
  if (!allowed.includes(value)) {
    fail(path, `must be one of: ${allowed.join(', ')}`)
  }
}

function assertString(value, path) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(path, 'must be a non-empty string')
  }
}

function assertOptionalString(value, path) {
  if (value !== undefined) assertString(value, path)
}

function assertStringArray(value, path, { allowEmpty = false } = {}) {
  if (allowEmpty) assertArray(value, path)
  else assertNonEmptyArray(value, path)

  value.forEach((item, i) => {
    if (allowEmpty && item === '') return
    assertString(item, `${path}[${i}]`)
  })
}

function assertNonEmptyArray(value, path) {
  assertArray(value, path)
  if (value.length === 0) fail(path, 'must not be empty')
}

function assertArray(value, path) {
  if (!Array.isArray(value)) fail(path, 'must be an array')
}

function assertRecord(value, path) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    fail(path, 'must be an object')
  }
}

function fail(path, message) {
  throw new TypeError(`${path} ${message}`)
}
