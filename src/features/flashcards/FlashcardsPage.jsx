import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DECKS } from '../../content/decks/index.js'
import { VERB_DECKS } from '../../content/decks/verbDecks.js'
import { MIXED_SESSION_SIZE } from '../../core/flashcards/flashcardSession.js'
import { getDeckStats } from '../../core/fsrs/fsrs.js'
import Icon from '../../ui/Icon.jsx'
import Meter from '../../ui/Meter.jsx'
import Panel from '../../ui/Panel.jsx'
import EnglishNav from '../english/EnglishNav.jsx'
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
      <EnglishNav />
      <h1>Flashcards</h1>
      <p className="flashcards__intro">
        Repaso espaciado de <strong>{activeStudent.name}</strong>: cada tarjeta vuelve cuando está por
        olvidarse.
      </p>

      {result.error && (
        <p role="alert" className="flashcards__error">
          No se pudo leer el avance: {result.error.message}
        </p>
      )}

      <Panel featured className="flashcards__mixed">
        <h2>Práctica mixta de verbos</h2>
        <p>
          Los {VERB_DECKS.length} modos se turnan, así ves cada verbo de varias formas. Sesiones de{' '}
          {MIXED_SESSION_SIZE} tarjetas.
        </p>
        <div className="flashcards__actions">
          <Link to="/flashcards/verbos-mixto" className="btn-primary">
            Practicar
          </Link>
          <Link to="/verbos" className="btn-secondary">
            Estudiar la lista de verbos
          </Link>
        </div>
      </Panel>

      <h2 className="label flashcards__section">Mazos por modo</h2>
      <ul className="flashcards__decks">
        {DECKS.map((deck) => (
          <li key={deck.id} className="deck">
            <DeckLink deck={deck} stats={result.stats?.[deck.id]} />
            {deck.packs?.length > 0 && <DeckPacks deck={deck} />}
          </li>
        ))}
      </ul>
    </section>
  )
}

function DeckLink({ deck, stats }) {
  const total = deck.cards.length
  const seen = stats ? total - stats.newCount : 0
  // «dueCount» counts new cards too: what is left are reviews that came due.
  const reviews = stats ? stats.dueCount - stats.newCount : 0

  return (
    <Link to={`/flashcards/${deck.id}`} className="deck__link">
      <span className="deck__title">{deck.title}</span>
      <span className="deck__desc">{deck.description}</span>
      <span className="deck__stats">
        <Meter value={seen} max={total} label={`${seen} de ${total} tarjetas vistas`} />
        {stats ? (
          <>
            <span>
              {seen} de {total} vistas
            </span>
            {stats.dueCount === 0 ? (
              <span>Al día</span>
            ) : (
              <span className="deck__due">
                {reviews} para repasar · {stats.newCount} nuevas
              </span>
            )}
          </>
        ) : (
          <span>{total} tarjetas</span>
        )}
      </span>
      <span className="deck__arrow" aria-hidden="true">
        <Icon name="forward" size={20} />
      </span>
    </Link>
  )
}

/** Practise only a theme or a pattern of the deck, e.g. «Viajes» or «sing – sang – sung». */
function DeckPacks({ deck }) {
  const groups = [...new Set(deck.packs.map((pack) => pack.group))].map((group) => [
    group,
    deck.packs.filter((pack) => pack.group === group),
  ])

  return (
    <details className="deck__packs">
      <summary>Paquetes por tema o patrón</summary>
      {groups.map(([group, packs]) => (
        <div key={group}>
          <p className="deck__pack-group">{group}</p>
          <ul>
            {packs.map((pack) => (
              <li key={pack.id}>
                <Link to={`/flashcards/${deck.id}?pack=${pack.id}`}>
                  {pack.title} <small>({pack.cardIds.length})</small>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </details>
  )
}

export default FlashcardsPage
