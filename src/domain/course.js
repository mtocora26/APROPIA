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
  'hunt',
  'code',
])

export const THEORY_BLOCK_TYPES = Object.freeze([
  'text',
  'tip',
  'example',
  'table',
  'code',
  'form',
  'try',
  'syntax',
  'timeline',
  'scene',
])

export const FORM_CONTROL_KINDS = Object.freeze(['label', 'textbox', 'button', 'checkbox', 'listbox', 'combobox'])

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

      if (lesson.tutorNotes !== undefined) {
        assertStringArray(lesson.tutorNotes, `${lessonPath}.tutorNotes`)
      }

      if (lesson.classExercises !== undefined) {
        assertNonEmptyArray(lesson.classExercises, `${lessonPath}.classExercises`)
        lesson.classExercises.forEach((exercise, e) => {
          const exercisePath = `${lessonPath}.classExercises[${e}]`
          assertRecord(exercise, exercisePath)
          assertUniqueId(exercise.id, ids, `${exercisePath}.id`)
          validateExercise(exercise, exercisePath, course.alphabet)
        })
      }
    })
  })

  course.modules.forEach((module, m) => {
    if (module.reviewSize !== undefined && !(Number.isInteger(module.reviewSize) && module.reviewSize > 0)) {
      fail(`course.modules[${m}].reviewSize`, 'must be a positive integer')
    }

    if (module.reviewExercises !== undefined) {
      const lessonIds = new Set(module.lessons.map((lesson) => lesson.id))
      assertNonEmptyArray(module.reviewExercises, `course.modules[${m}].reviewExercises`)
      module.reviewExercises.forEach((exercise, e) => {
        const exercisePath = `course.modules[${m}].reviewExercises[${e}]`
        assertRecord(exercise, exercisePath)
        assertUniqueId(exercise.id, ids, `${exercisePath}.id`)
        if (!lessonIds.has(exercise.from)) fail(`${exercisePath}.from`, 'must be the id of a lesson of the module')
        validateExercise(exercise, exercisePath, course.alphabet)
      })
      for (const lessonId of lessonIds) {
        if (!module.reviewExercises.some((exercise) => exercise.from === lessonId)) {
          fail(`course.modules[${m}].reviewExercises`, `needs at least one exercise from "${lessonId}"`)
        }
      }
    }

    if (ids.has(reviewLessonId(module))) {
      fail(`course.modules[${m}]`, `"${reviewLessonId(module)}" is reserved for the module review`)
    }
  })

  return course
}

export const MODULE_REVIEW_SAMPLE_SIZE = 6

/**
 * Lessons of a module in order. Modules with 2+ lessons end with a generated
 * "review" lesson: a short, balanced sample (see `sampleReview`) with the same
 * number of exercises from every lesson. If the module defines
 * `reviewExercises` (each tagged with `from: <lessonId>`), the review draws only
 * from those, so the student practises the topic in new contexts instead of
 * repeating the exercises already done.
 */
export function moduleLessons(module) {
  if (module.lessons.length < 2) return module.lessons

  const groups = module.reviewExercises
    ? module.lessons.map((lesson) => module.reviewExercises.filter((exercise) => exercise.from === lesson.id))
    : module.lessons.map((lesson) => lesson.exercises)

  return [
    ...module.lessons,
    {
      id: reviewLessonId(module),
      title: 'Repaso del módulo',
      review: true,
      sampleSize: module.reviewSize ?? MODULE_REVIEW_SAMPLE_SIZE,
      theory: [
        {
          type: 'text',
          text: 'Un repaso corto con ejercicios de cada lección del módulo, en situaciones distintas a las que ya practicaste.',
        },
      ],
      exercises: groups.flat(),
      exerciseGroups: groups,
    },
  ]
}

/**
 * Picks up to `size` exercises taking turns between the groups (one per
 * lesson), so every lesson is represented before any is repeated.
 *
 * @param {object[][]} groups
 * @param {number} size
 * @param {() => number} random
 */
export function sampleReview(groups, size, random = Math.random) {
  const queues = shuffled(groups.filter((group) => group.length > 0), random).map((group) => shuffled(group, random))
  const picked = []

  while (picked.length < size && queues.some((queue) => queue.length > 0)) {
    for (const queue of queues) {
      if (picked.length < size && queue.length > 0) picked.push(queue.shift())
    }
  }

  return picked
}

function shuffled(list, random) {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
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

  if (block.type === 'code') {
    assertString(block.text, `${path}.text`)
  }

  if (block.type === 'syntax') {
    assertString(block.title, `${path}.title`)
    assertString(block.template, `${path}.template`)
    if (block.parts !== undefined) {
      assertNonEmptyArray(block.parts, `${path}.parts`)
      block.parts.forEach((part, p) => {
        assertRecord(part, `${path}.parts[${p}]`)
        assertString(part.name, `${path}.parts[${p}].name`)
        assertString(part.desc, `${path}.parts[${p}].desc`)
      })
    }
  }

  if (block.type === 'try') {
    assertString(block.code, `${path}.code`)
    assertString(block.ask, `${path}.ask`)
    if (block.datos !== undefined) assertStringArray(block.datos, `${path}.datos`)
  }

  if (block.type === 'form') {
    assertString(block.title, `${path}.title`)
    assertPositive(block.width, `${path}.width`)
    assertPositive(block.height, `${path}.height`)
    assertNonEmptyArray(block.controls, `${path}.controls`)
    const names = new Set()
    block.controls.forEach((control, c) => {
      const controlPath = `${path}.controls[${c}]`
      assertRecord(control, controlPath)
      assertOneOf(control.kind, FORM_CONTROL_KINDS, `${controlPath}.kind`)
      assertUniqueId(control.name, names, `${controlPath}.name`)
      for (const key of ['x', 'y']) assertPositive(control[key], `${controlPath}.${key}`, { allowZero: true })
      for (const key of ['w', 'h']) assertPositive(control[key], `${controlPath}.${key}`)
      if (control.x + control.w > block.width || control.y + control.h > block.height) {
        fail(controlPath, 'must fit inside the form')
      }
      if (control.text !== undefined && typeof control.text !== 'string') fail(`${controlPath}.text`, 'must be a string')
      if (control.items !== undefined) assertStringArray(control.items, `${controlPath}.items`, { allowEmpty: true })
    })
  }

  if (block.type === 'example') {
    assertString(block.text, `${path}.text`)
    assertString(block.translation, `${path}.translation`)
  }

  if (block.type === 'scene') {
    assertOptionalString(block.title, `${path}.title`)
    assertNonEmptyArray(block.items, `${path}.items`)
    block.items.forEach((item, i) => {
      assertRecord(item, `${path}.items[${i}]`)
      assertString(item.emoji, `${path}.items[${i}].emoji`)
      assertString(item.text, `${path}.items[${i}].text`)
      assertOptionalString(item.translation, `${path}.items[${i}].translation`)
    })
  }

  if (block.type === 'timeline') {
    assertOptionalString(block.title, `${path}.title`)
    assertNonEmptyArray(block.events, `${path}.events`)
    if (!Number.isFinite(block.now) || block.now < 0 || block.now > 100) {
      fail(`${path}.now`, 'must be a number between 0 and 100')
    }
    block.events.forEach((event, i) => {
      const eventPath = `${path}.events[${i}]`
      assertRecord(event, eventPath)
      assertString(event.emoji, `${eventPath}.emoji`)
      assertString(event.label, `${eventPath}.label`)
      for (const key of ['from', 'to']) {
        if (event[key] !== undefined && !(Number.isFinite(event[key]) && event[key] >= 0 && event[key] <= 100)) {
          fail(`${eventPath}.${key}`, 'must be a number between 0 and 100')
        }
      }
      if (event.from === undefined) fail(`${eventPath}.from`, 'is required')
      if (event.to !== undefined && event.to < event.from) fail(`${eventPath}.to`, 'must be >= from')
    })
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
  assertOptionalString(exercise.snippet, `${path}.snippet`)
  assertOptionalString(exercise.picture, `${path}.picture`)
  if (exercise.snippetLang !== undefined) {
    if (!exercise.snippet) fail(`${path}.snippetLang`, 'requires snippet')
    assertString(exercise.snippetLang, `${path}.snippetLang`)
  }
  assertOptionalString(exercise.explanation, `${path}.explanation`)
  assertOptionalString(exercise.classInstruction, `${path}.classInstruction`)

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
      assertOptionalString(exercise.codeLanguage, `${path}.codeLanguage`)
      if (exercise.codeLanguage !== undefined && !exercise.code) {
        fail(`${path}.codeLanguage`, 'requires code: true')
      }
      if (exercise.code !== undefined && typeof exercise.code !== 'boolean') {
        fail(`${path}.code`, 'must be a boolean')
      }
      if (exercise.practiceMinutes !== undefined &&
          (!exercise.code || !Number.isFinite(exercise.practiceMinutes) || exercise.practiceMinutes <= 0)) {
        fail(`${path}.practiceMinutes`, 'requires code and a positive number')
      }
      if (exercise.hints !== undefined) {
        assertStringArray(exercise.hints, `${path}.hints`)
      }
      break

    case 'code': {
      assertString(exercise.modelAnswer, `${path}.modelAnswer`)
      assertOptionalString(exercise.starter, `${path}.starter`)
      assertNonEmptyArray(exercise.tests, `${path}.tests`)
      exercise.tests.forEach((item, t) => {
        const testPath = `${path}.tests[${t}]`
        assertRecord(item, testPath)
        if (item.inputs !== undefined) assertStringArray(item.inputs, `${testPath}.inputs`, { allowEmpty: true })
        for (const key of ['contains', 'notContains', 'lines']) {
          if (item[key] !== undefined) assertStringArray(item[key], `${testPath}.${key}`, { allowEmpty: true })
        }
        if (!item.contains && !item.notContains && !item.lines && !item.usesAllInputs) {
          fail(testPath, 'needs contains, notContains, lines or usesAllInputs')
        }
      })
      if (exercise.hints !== undefined) assertStringArray(exercise.hints, `${path}.hints`)
      if (exercise.theory !== undefined) {
        assertArray(exercise.theory, `${path}.theory`)
        if (!exercise.theory.every((index) => Number.isInteger(index) && index >= 0)) {
          fail(`${path}.theory`, 'must be indexes of the lesson theory blocks')
        }
      }
      if (exercise.practiceMinutes !== undefined &&
          (!Number.isFinite(exercise.practiceMinutes) || exercise.practiceMinutes <= 0)) {
        fail(`${path}.practiceMinutes`, 'must be a positive number')
      }
      break
    }

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

    case 'hunt':
      assertStringArray(exercise.tokens, `${path}.tokens`)
      assertString(exercise.correction, `${path}.correction`)
      if (!Number.isInteger(exercise.wrongIndex) || exercise.wrongIndex < 0 || exercise.wrongIndex >= exercise.tokens.length) {
        fail(`${path}.wrongIndex`, 'must be an index of tokens')
      }
      break

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

function assertPositive(value, path, { allowZero = false } = {}) {
  if (!Number.isFinite(value) || (allowZero ? value < 0 : value <= 0)) {
    fail(path, allowZero ? 'must be a number >= 0' : 'must be a positive number')
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
