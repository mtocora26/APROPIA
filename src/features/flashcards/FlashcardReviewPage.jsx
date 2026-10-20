import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDeck } from '../../content/decks/index.js'
import {
  answerSession,
  buildReviewQueue,
  formatInterval,
  isSessionDone,
  startSession,
} from '../../core/flashcards/flashcardSession.js'
import { Rating, createEmptyCard, previewIntervals, reviewCard } from '../../core/fsrs/fsrs.js'
import { speechLang } from '../../core/speech/speech.js'
import SpeakButton from '../../ui/SpeakButton.jsx'
import { useFlashcardRepository, useStudents } from '../students/studentContext.js'
import './flashcards.css'

function FlashcardReviewPage() {
  const { deckId } = useParams()
  const deck = getDeck(deckId)

  if (!deck) {
    return (
      <p>
        No encontramos este mazo. <Link to="/flashcards">Volver a flashcards</Link>
      </p>
    )
  }

  return <FlashcardReview deck={deck} />
}

function FlashcardReview({ deck }) {
  const repository = useFlashcardRepository()
  const { activeStudent } = useStudents()
  // state: { cards, session, total, at } once loaded; { error } if loading failed
  const [state, setState] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    let ignore = false

    repository
      .getCards(deck.id)
      .then((cards) => {
        const at = new Date()
        const queue = buildReviewQueue(deck, cards, at)
        if (!ignore) setState({ cards, session: startSession(queue), total: queue.length, at })
      })
      .catch((error) => {
        if (!ignore) setState({ error })
      })

    return () => {
      ignore = true
    }
  }, [repository, deck])

  if (state === null) return <p>Cargando tarjetas…</p>
  if (state.error) return <p role="alert">No se pudo leer el avance: {state.error.message}</p>

  const { cards, session, total, at } = state

  if (isSessionDone(session)) {
    return (
      <section className="flashcards">
        <h1>{total === 0 ? 'Nada para repasar' : '¡Sesión terminada!'}</h1>
        <p>
          {total === 0
            ? `${activeStudent.name} no tiene tarjetas pendientes en este mazo.`
            : `${total} tarjeta(s) repasadas, ${session.forgotten} vez/veces que hubo que repetir.`}
        </p>
        <p>
          <Link to="/flashcards">Volver a flashcards</Link>
        </p>
      </section>
    )
  }

  const cardId = session.queue[0]
  const card = deck.cards.find((item) => item.id === cardId)
  const fsrsCard = cards[cardId] ?? createEmptyCard(at)
  const intervals = previewIntervals(fsrsCard, at)
  const lang = speechLang(deck.language)
  const buttons = [
    { rating: Rating.AGAIN, label: 'Otra vez', days: intervals.again },
    { rating: Rating.HARD, label: 'Difícil', days: intervals.hard },
    { rating: Rating.GOOD, label: 'Bien', days: intervals.good },
    { rating: Rating.EASY, label: 'Fácil', days: intervals.easy },
  ]

  async function rate(rating) {
    if (saving) return
    setSaving(true)
    setSaveError(null)

    const now = new Date()
    const { card: updated } = reviewCard(fsrsCard, rating, now)

    try {
      await repository.saveCard(deck.id, cardId, updated)
    } catch (error) {
      setSaveError(error)
      setSaving(false)
      return
    }

    setState((prev) => ({
      ...prev,
      cards: { ...prev.cards, [cardId]: updated },
      session: answerSession(prev.session, rating),
      at: now,
    }))
    setRevealed(false)
    setSaving(false)
  }

  return (
    <section className="flashcards">
      <p className="flashcards__progress">
        <Link to="/flashcards">← Mazos</Link>
        <span>
          {activeStudent.name} · {Math.min(session.reviewed, total)} / {total} · quedan {session.queue.length}
        </span>
      </p>

      <div className="flashcard">
        <span className="flashcard__label">{deck.frontLabel}</span>
        <p className="flashcard__text">
          {card.front} <SpeakButton text={card.front} lang={lang} />
        </p>

        {revealed ? (
          <>
            <span className="flashcard__label">{deck.backLabel}</span>
            <p className="flashcard__text flashcard__text--back">
              {card.back} <SpeakButton text={card.back} lang={lang} />
            </p>
            {card.hint && <p className="flashcard__hint">{card.hint}</p>}
          </>
        ) : (
          <button type="button" className="flashcard__reveal" onClick={() => setRevealed(true)}>
            Mostrar respuesta
          </button>
        )}
      </div>

      {revealed && (
        <div className="flashcards__rating" role="group" aria-label="¿Qué tan bien la recordaste?">
          {buttons.map(({ rating, label, days }) => (
            <button
              key={rating}
              type="button"
              disabled={saving}
              onClick={() => rate(rating)}
              className={`flashcards__rate flashcards__rate--${rating}`}
            >
              {label}
              <small>{formatInterval(days)}</small>
            </button>
          ))}
        </div>
      )}

      {saveError && (
        <p role="alert" className="flashcards__error">
          No se pudo guardar: {saveError.message}
        </p>
      )}
    </section>
  )
}

export default FlashcardReviewPage
