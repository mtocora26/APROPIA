import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildRecap,
  createSession,
  deckTopic,
  lessonTopic,
  suggestTopics,
  topicKey,
} from './tutoringSession.js'

const COURSE = {
  id: 'english',
  modules: [{ id: 'm1', lessons: [{ id: 'l1', title: 'Past simple' }, { id: 'l2', title: 'Questions' }] }],
}
const DECK = { id: 'verbs', title: 'Verbos' }
const l1 = lessonTopic(COURSE, COURSE.modules[0].lessons[0])
const l2 = lessonTopic(COURSE, COURSE.modules[0].lessons[1])

test('creates a session, dropping repeated topics and trimming the note', () => {
  const session = createSession({
    id: 's1',
    date: '2026-10-20',
    createdAt: '2026-10-20T15:00:00.000Z',
    topics: [l1, l1, deckTopic(DECK)],
    note: '  Repasar was/were  ',
  })

  assert.deepEqual(session.topics.map(topicKey), ['lesson:english:l1', 'deck:verbs'])
  assert.equal(session.note, 'Repasar was/were')
})

test('needs a topic or a note, and a valid date', () => {
  const base = { id: 's1', date: '2026-10-20', createdAt: 'x' }

  assert.throws(() => createSession({ ...base, topics: [], note: ' ' }), /al menos un tema/)
  assert.equal(createSession({ ...base, note: 'solo nota' }).topics.length, 0)
  assert.throws(() => createSession({ ...base, date: '20/10/2026', note: 'x' }), TypeError)
  assert.throws(() => createSession({ ...base, note: 'x'.repeat(1001) }), /nota/)
})

test('suggests what the student practiced today', () => {
  const today = '2026-10-20'
  const at = new Date(2026, 9, 20, 12).toISOString()
  const before = new Date(2026, 9, 19, 12).toISOString()

  const topics = suggestTopics({
    courses: [COURSE],
    decks: [DECK],
    progressByCourse: {
      english: { exercises: { l1: { updatedAt: at }, l2: { updatedAt: before } } },
    },
    cardsByDeck: { verbs: { go: { lastReview: at } } },
    today,
  })

  assert.deepEqual(topics.map(topicKey), ['lesson:english:l1', 'deck:verbs'])
})

test('suggests nothing when there is no activity today', () => {
  assert.deepEqual(
    suggestTopics({ courses: [COURSE], decks: [DECK], progressByCourse: {}, cardsByDeck: {}, today: '2026-10-20' }),
    [],
  )
})

test('recap orders the last session lessons from weakest to strongest', () => {
  const sessions = [
    { id: 'old', topics: [l2] },
    { id: 'last', topics: [l1, l2, deckTopic(DECK)] },
  ]
  const progressByCourse = { english: { exercises: { l1: { bestScore: 90 } } } }

  const recap = buildRecap({
    sessions,
    progressByCourse,
    decksDue: [{ deck: DECK, dueCount: 3 }, { deck: { id: 'x' }, dueCount: 0 }],
  })

  assert.equal(recap.lastSession.id, 'last')
  assert.deepEqual(recap.lessons.map((item) => [item.topic.id, item.bestScore]), [
    ['l2', null],
    ['l1', 90],
  ])
  assert.deepEqual(recap.decks.map((item) => item.deck.id), ['verbs'])
})

test('recap works for a student with no sessions', () => {
  const recap = buildRecap({ sessions: [], progressByCourse: {}, decksDue: [] })

  assert.deepEqual(recap, { lastSession: null, lessons: [], decks: [] })
})
