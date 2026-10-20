import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DECKS } from '../../content/decks/index.js'
import { getDeckStats } from '../../core/fsrs/fsrs.js'
import { useFlashcardRepository, useStudents } from '../students/studentContext.js'
import './flashcards.css'

/** Deck list with how many cards the active student has due in each. */
function FlashcardsPage() {
  const repository = useFlashcardRepository()
  const { activeStudent } = useStudents()
  const [result, setResult] = useState({ stats: null, error: null })

  useEffect(() => {
    let ignore = false

    Promise.all(DECKS.map((deck) => repository.getCards(deck.id)))
      .then((cardsByDeck) => {
        const now = new Date()
        const stats = Object.fromEntries(
          DECKS.map((deck, index) => [
            deck.id,
            getDeckStats(deck.cards.map((card) => card.id), cardsByDeck[index], now),
          ]),
        )
        if (!ignore) setResult({ stats, error: null })
      })
      .catch((error) => {
        if (!ignore) setResult({ stats: null, error })
      })

    return () => {
      ignore = true
    }
  }, [repository])

  return (
    <section className="flashcards">
      <h1>Flashcards</h1>
      <p>
        Repaso espaciado de <strong>{activeStudent.name}</strong>: cada tarjeta vuelve cuando está por
        olvidarse.
      </p>

      {result.error && <p role="alert">No se pudo leer el avance: {result.error.message}</p>}

      <ul className="flashcards__decks">
        {DECKS.map((deck) => {
          const stats = result.stats?.[deck.id]
          return (
            <li key={deck.id}>
              <Link to={`/flashcards/${deck.id}`} className="course-card">
                <span className="course-card__title">{deck.title}</span>
                <span className="course-card__meta">{deck.description}</span>
                <span className="course-card__meta">
                  {deck.cards.length} tarjetas
                  {stats && ` · ${stats.dueCount} para repasar · ${stats.newCount} nuevas`}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default FlashcardsPage
