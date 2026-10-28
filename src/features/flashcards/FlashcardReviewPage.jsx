import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getDeck } from '../../content/decks/index.js'
import { VERB_DECKS } from '../../content/decks/verbDecks.js'
import { deckPack } from '../../domain/deck.js'
import {
  answerSession,
  buildMixedQueue,
  buildReviewQueue,
  cardKey,
  formatInterval,
  isSessionDone,
  parseCardKey,
  startSession,
} from '../../core/flashcards/flashcardSession.js'
import { Rating, createEmptyCard, previewIntervals, reviewCard } from '../../core/fsrs/fsrs.js'
import { speechLang } from '../../core/speech/speech.js'
import Icon from '../../ui/Icon.jsx'
import Meter from '../../ui/Meter.jsx'
import Panel from '../../ui/Panel.jsx'
import SpeakButton from '../../ui/SpeakButton.jsx'
import { useFlashcardRepository, useStudents } from '../students/studentContext.js'
import './flashcards.css'

export const MIXED_DECK_ID = 'verbos-mixto'

const MODE_NAMES = {
  'verbs-es-base': 'Español → inglés',
  'verbs-base-past': 'Pasado',
  'verbs-three-forms': '3 formas',
  'verbs-sentences': 'En contexto',
}

function FlashcardReviewPage() {
  const { deckId } = useParams()
  const [searchParams] = useSearchParams()
  const packId = searchParams.get('pack')
  const mixedDecks = useMemo(() => VERB_DECKS.map((deck) => deckPack(deck, packId).deck), [packId])

  if (deckId === MIXED_DECK_ID) {
    const packTitle = deckPack(VERB_DECKS[0], packId).pack?.title
    return <FlashcardReview key={packId ?? 'all'} decks={mixedDecks} title="Verbos: práctica mixta" packTitle={packTitle} mixed />
  }

  const fullDeck = getDeck(deckId)

  if (!fullDeck) {
    return (
      <p>
        No encontramos este mazo. <Link to="/flashcards">Volver a flashcards</Link>
      </p>
    )
  }

  const { deck, pack } = deckPack(fullDeck, packId)

  return <FlashcardReview key={pack?.id ?? 'all'} decks={[deck]} title={deck.title} packTitle={pack?.title} />
}

const LONG_TEXT = 28

const countCards = (n) => `${n} ${n === 1 ? 'tarjeta' : 'tarjetas'}`

/** Reviews one deck, or (mixed) takes turns between several, saving each card in its own deck. */
function FlashcardReview({ decks, title, packTitle, mixed = false }) {
  const repository = useFlashcardRepository()
  const { activeStudent } = useStudents()
  // state: { cards, session, total, at } once loaded; { error } if loading failed
  const [state, setState] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    let ignore = false

    Promise.all(decks.map((deck) => repository.getCards(deck.id)))
      .then((saved) => {
        const cards = Object.fromEntries(decks.map((deck, i) => [deck.id, saved[i]]))
        const at = new Date()
        const queue = mixed
          ? buildMixedQueue(decks, cards, at)
          : buildReviewQueue(decks[0], cards[decks[0].id], at).map((id) => cardKey(decks[0].id, id))
        if (!ignore) setState({ cards, session: startSession(queue), total: queue.length, at })
      })
      .catch((error) => {
        if (!ignore) setState({ error })
      })

    return () => {
      ignore = true
    }
  }, [repository, decks, mixed])

  const current = state?.session && !isSessionDone(state.session) ? parseCardKey(state.session.queue[0]) : null
  const currentKey = state?.session?.queue[0]

  async function rate(rating) {
    if (saving || !current) return
    setSaving(true)
    setSaveError(null)

    const { deckId, cardId } = current
    const now = new Date()
    const { card: updated } = reviewCard(state.cards[deckId][cardId] ?? createEmptyCard(state.at), rating, now)

    try {
      await repository.saveCard(deckId, cardId, updated)
    } catch (error) {
      setSaveError(error)
      setSaving(false)
      return
    }

    setState((prev) => ({
      ...prev,
      cards: { ...prev.cards, [deckId]: { ...prev.cards[deckId], [cardId]: updated } },
      session: answerSession(prev.session, rating),
      at: now,
    }))
    setSaving(false)
  }

  if (state === null) return <p role="status">Cargando tarjetas…</p>
  if (state.error) return <p role="alert" className="flashcards__error">No se pudo leer el avance: {state.error.message}</p>

  const { cards, session, total, at } = state

  if (!current) {
    return (
      <section className="flashcards">
        <h1 className="page-title">{total === 0 ? 'Nada para repasar' : 'Sesión terminada'}</h1>
        <Panel featured className="flashcards__done">
          {total === 0 ? (
            <p>{activeStudent.name} no tiene tarjetas pendientes en este mazo.</p>
          ) : (
            <>
              <Meter value={total} max={total} segments={Math.min(total, 15)} label={`${countCards(total)} repasadas`} />
              <p>{countCards(total)} repasadas.</p>
              {session.forgotten > 0 && (
                <p>
                  <span className="state state--refuerzo">Reforzar</span> {session.forgotten}{' '}
                  {session.forgotten === 1 ? 'repetición' : 'repeticiones'} hasta recordar.
                </p>
              )}
            </>
          )}
          <Link to="/flashcards" className="btn-primary">
            Volver a mazos
          </Link>
        </Panel>
      </section>
    )
  }

  const { deckId, cardId } = current
  const deck = decks.find((item) => item.id === deckId)
  const card = deck.cards.find((item) => item.id === cardId)
  const intervals = previewIntervals(cards[deckId][cardId] ?? createEmptyCard(at), at)
  const finished = total - session.queue.length

  return (
    <section className="flashcards">
      <div className="flashcards__progress">
        <Link to="/flashcards" className="app-back">
          <Icon name="back" size={16} /> Mazos
        </Link>
        <span>
          {finished} de {total} · quedan {session.queue.length}
        </span>
      </div>
      <Meter
        value={finished}
        max={total}
        segments={Math.min(total, 15)}
        label={`${finished} de ${countCards(total)} repasadas`}
      />

      <div className="flashcards__heading">
        <h1 className="page-title">{title}</h1>
        <p className="flashcards__sub">
          {packTitle && `Paquete: ${packTitle} · `}
          Repaso de {activeStudent.name}
        </p>
      </div>

      <ReviewCard
        key={currentKey}
        deck={deck}
        card={card}
        mixed={mixed}
        intervals={intervals}
        saving={saving}
        onRate={rate}
      />

      {saveError && (
        <p role="alert" className="flashcards__error">
          No se pudo guardar: {saveError.message}
        </p>
      )}
    </section>
  )
}

/**
 * One card. It remounts for every card (see `key`), so «revealed» starts closed.
 * Space reveals and 1–4 rate; none of it animates, because a session repeats
 * these actions dozens of times.
 */
function ReviewCard({ deck, card, mixed, intervals, saving, onRate }) {
  const [revealed, setRevealed] = useState(false)
  const answerRef = useRef(null)
  const lang = speechLang(deck.language)
  const buttons = [
    { rating: Rating.AGAIN, label: 'Otra vez', days: intervals.again },
    { rating: Rating.HARD, label: 'Difícil', days: intervals.hard },
    { rating: Rating.GOOD, label: 'Bien', days: intervals.good },
    { rating: Rating.EASY, label: 'Fácil', days: intervals.easy },
  ]

  useEffect(() => {
    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.defaultPrevented) return
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('input, textarea, select, a, summary, [contenteditable]')) return

      if (!revealed) {
        // On a focused button the browser already clicks it.
        if ((event.key === ' ' || event.key === 'Enter') && !target?.closest('button')) {
          event.preventDefault()
          setRevealed(true)
        }
        return
      }

      const picked = buttons[Number(event.key) - 1]
      if (picked) onRate(picked.rating)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => {
    // The reveal button unmounts: keep focus in the card so Tab continues to the ratings.
    if (revealed) answerRef.current?.focus()
  }, [revealed])

  return (
    <>
      <Panel featured className="flashcard">
        <div className="flashcard__side">
          <span className="flashcard__label">{mixed ? `${MODE_NAMES[deck.id]} · ${deck.frontLabel}` : deck.frontLabel}</span>
          <CardLine text={card.front} lang={lang} />
        </div>

        <div className="flashcard__answer" ref={answerRef} tabIndex={-1} aria-live="polite">
          {revealed ? (
            <>
              <span className="flashcard__label">{deck.backLabel}</span>
              <CardLine text={card.back} lang={lang} back />
              {card.hint && <p className="flashcard__hint">{card.hint}</p>}
            </>
          ) : (
            <button
              type="button"
              className="flashcard__reveal"
              aria-keyshortcuts="Space"
              onClick={() => setRevealed(true)}
            >
              Mostrar respuesta
              <kbd className="flashcards__key" aria-hidden="true">Espacio</kbd>
            </button>
          )}
        </div>
      </Panel>

      {revealed && (
        <div className="flashcards__rating" role="group" aria-label="¿Qué tan bien la recordaste?">
          {buttons.map(({ rating, label, days }, index) => (
            <button
              key={rating}
              type="button"
              disabled={saving}
              aria-keyshortcuts={String(index + 1)}
              onClick={() => onRate(rating)}
              className={`flashcards__rate flashcards__rate--${rating}`}
            >
              <span className="flashcards__rate-label">{label}</span>
              <small>{formatInterval(days)}</small>
              <kbd className="flashcards__key" aria-hidden="true">{index + 1}</kbd>
            </button>
          ))}
        </div>
      )}
    </>
  )
}

function CardLine({ text, lang, back = false }) {
  const classes = ['flashcard__text', back && 'flashcard__text--back', text.length > LONG_TEXT && 'flashcard__text--long']
    .filter(Boolean)
    .join(' ')

  return (
    <div className="flashcard__line">
      <p className={classes}>{text}</p>
      <SpeakButton text={text} lang={lang} />
    </div>
  )
}

export default FlashcardReviewPage
