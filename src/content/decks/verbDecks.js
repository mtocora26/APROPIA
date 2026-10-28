import { VERBS, VERB_PATTERNS, VERB_THEMES } from './verbData.js'

/**
 * Los cuatro modos de práctica de verbos salen de UNA sola lista (verbData.js).
 * Cada modo es un mazo con su propio avance de repaso espaciado, y todos
 * comparten los mismos paquetes (por tema y por patrón).
 *
 *   Pack { id, title, group, cardIds }
 */

const THEME_PACKS = VERB_THEMES.map((theme) => ({
  id: `theme-${theme.id}`,
  title: theme.title,
  group: 'Por tema',
  verbs: VERBS.filter((verb) => verb.theme === theme.id),
}))

const PATTERN_PACKS = VERB_PATTERNS.map((pattern) => ({
  id: `pattern-${pattern.id}`,
  title: `${pattern.title} · ${pattern.example}`,
  group: 'Por patrón',
  verbs: VERBS.filter((verb) => verb.pattern === pattern.id),
}))

const PACKS = [...THEME_PACKS, ...PATTERN_PACKS].filter((pack) => pack.verbs.length > 0)

// «be» tiene dos formas en pasado; la tarjeta las acepta juntas.
const pastOf = (verb) => verb.past
const participleOf = (verb) => verb.participle

function buildDeck({ id, title, description, frontLabel, backLabel, cardsOf }) {
  const cards = VERBS.flatMap(cardsOf)
  const packs = PACKS.map((pack) => {
    const verbIds = new Set(pack.verbs.map((verb) => verb.id))
    const cardIds = cards.filter((card) => verbIds.has(card.verbId)).map((card) => card.id)
    return { id: pack.id, title: pack.title, group: pack.group, cardIds }
  }).filter((pack) => pack.cardIds.length > 0)

  return {
    id,
    title,
    description,
    language: 'en',
    frontLabel,
    backLabel,
    cards: cards.map(({ verbId, ...card }) => card), // eslint-disable-line no-unused-vars
    packs,
  }
}

export const VERB_DECKS = [
  buildDeck({
    id: 'verbs-es-base',
    title: 'Verbos: español → inglés',
    description: 'Ves el significado en español y recuerdas el verbo en inglés (forma base).',
    frontLabel: 'Español',
    backLabel: 'English',
    cardsOf: (verb) => [{ id: verb.id, verbId: verb.id, front: verb.es, back: verb.base }],
  }),
  buildDeck({
    id: 'verbs-base-past',
    title: 'Verbos: presente → pasado',
    description: 'Del verbo base a su pasado simple (went, bought, studied…).',
    frontLabel: 'Present',
    backLabel: 'Past simple',
    cardsOf: (verb) => [{ id: verb.id, verbId: verb.id, front: verb.base, back: pastOf(verb), hint: verb.es }],
  }),
  buildDeck({
    id: 'verbs-three-forms',
    title: 'Verbos: las 3 formas',
    description: 'Presente, pasado y participio juntos: go → went → gone.',
    frontLabel: 'Present',
    backLabel: 'Past · Participle',
    cardsOf: (verb) => [{
      id: verb.id,
      verbId: verb.id,
      front: verb.base,
      back: `${pastOf(verb)} · ${participleOf(verb)}`,
      hint: verb.es,
    }],
  }),
  buildDeck({
    id: 'verbs-sentences',
    title: 'Verbos en contexto: completa la frase',
    description: 'Elige la forma correcta según el marcador de tiempo: Yesterday… (pasado) o have/ever/already… (participio).',
    frontLabel: 'Completa',
    backLabel: 'Respuesta',
    cardsOf: (verb) => [
      { id: `${verb.id}-past`, verbId: verb.id, front: verb.sentencePast, back: pastOf(verb), hint: `${verb.es} · pasado simple` },
      { id: `${verb.id}-pp`, verbId: verb.id, front: verb.sentencePp, back: participleOf(verb), hint: `${verb.es} · participio` },
    ],
  }),
]
