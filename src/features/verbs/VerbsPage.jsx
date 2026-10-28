import { useState } from 'react'
import { Link } from 'react-router-dom'
import { VERBS, VERB_PATTERNS, VERB_THEMES } from '../../content/decks/verbData.js'
import { speechLang } from '../../core/speech/speech.js'
import SpeakButton from '../../ui/SpeakButton.jsx'
import EnglishNav from '../english/EnglishNav.jsx'
import './verbs.css'

const FILTERS = [
  { group: 'Por tema', options: VERB_THEMES.map((theme) => ({ id: `theme-${theme.id}`, title: theme.title, test: (verb) => verb.theme === theme.id })) },
  { group: 'Por patrón', options: VERB_PATTERNS.map((pattern) => ({ id: `pattern-${pattern.id}`, title: pattern.title, test: (verb) => verb.pattern === pattern.id })) },
]
const OPTIONS = FILTERS.flatMap((filter) => filter.options)

function matches(verb, query) {
  const text = query.trim().toLowerCase()
  return text === '' || [verb.base, verb.past, verb.participle, verb.es].some((form) => form.toLowerCase().includes(text))
}

/** Study the verbs on their own: three forms side by side, filtered by theme or pattern, with audio. */
function VerbsPage() {
  const [filterId, setFilterId] = useState('all')
  const [query, setQuery] = useState('')
  const [onlyIrregular, setOnlyIrregular] = useState(false)
  const lang = speechLang('en')
  const filter = OPTIONS.find((option) => option.id === filterId)
  const verbs = VERBS.filter(
    (verb) => (!filter || filter.test(verb)) && (!onlyIrregular || !verb.regular) && matches(verb, query),
  )
  const packQuery = filter ? `?pack=${filter.id}` : ''

  return (
    <section className="verbs">
      <EnglishNav />
      <h1>Verbos</h1>
      <p>
        Mira las tres formas juntas, escúchalas y practícalas con repaso espaciado.
        <span className="verbs__legend">
          <b className="verbs__tag verbs__tag--present">Presente</b>
          <b className="verbs__tag verbs__tag--past">Pasado</b>
          <b className="verbs__tag verbs__tag--participle">Participio</b>
        </span>
      </p>

      <div className="verbs__actions">
        <Link to={`/flashcards/verbos-mixto${packQuery}`} className="verbs__primary">
          Práctica mixta{filter ? ' de este paquete' : ''}
        </Link>
        <Link to="/flashcards">Todos los modos de práctica</Link>
      </div>

      <div className="verbs__filters">
        <label>
          Paquete
          <select value={filterId} onChange={(event) => setFilterId(event.target.value)}>
            <option value="all">Todos los verbos</option>
            {FILTERS.map(({ group, options }) => (
              <optgroup key={group} label={group}>
                {options.map((option) => (
                  <option key={option.id} value={option.id}>{option.title}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label>
          Buscar
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="go, fui, bought…" />
        </label>
        <label className="verbs__check">
          <input type="checkbox" checked={onlyIrregular} onChange={(event) => setOnlyIrregular(event.target.checked)} />
          Solo irregulares
        </label>
      </div>

      <p className="verbs__count" role="status">{verbs.length} verbos</p>

      <div className="verbs__table-wrapper">
        <table className="verbs__table">
          <thead>
            <tr>
              <th scope="col">Presente</th>
              <th scope="col">Pasado</th>
              <th scope="col">Participio</th>
              <th scope="col">Español</th>
            </tr>
          </thead>
          <tbody>
            {verbs.map((verb) => (
              <tr key={verb.id}>
                <td className="verbs__present" lang="en">{verb.base} <SpeakButton text={verb.base} lang={lang} /></td>
                <td className="verbs__past" lang="en">{verb.past} <SpeakButton text={verb.past.split('/')[0]} lang={lang} /></td>
                <td className="verbs__participle" lang="en">{verb.participle} <SpeakButton text={verb.participle} lang={lang} /></td>
                <td>{verb.es}{!verb.regular && <small className="verbs__irregular"> irregular</small>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default VerbsPage
