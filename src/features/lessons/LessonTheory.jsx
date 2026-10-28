import CodeBlock, { RichText } from '../../ui/CodeBlock.jsx'
import SpeakButton from '../../ui/SpeakButton.jsx'
import PseintSandbox from '../sandbox/PseintSandbox.jsx'
import FormMock from './FormMock.jsx'
import './lesson.css'

/**
 * Renders the theory blocks of a lesson (see THEORY_BLOCK_TYPES).
 * `lang` is the voice language for examples, e.g. "it-IT".
 */
function LessonTheory({ blocks, lang }) {
  return (
    <div className="theory">
      {blocks.map((block, i) => (
        <TheoryBlock key={i} block={block} lang={lang} />
      ))}
    </div>
  )
}

function TheoryBlock({ block, lang }) {
  switch (block.type) {
    case 'text':
      return <p><RichText text={block.text} /></p>

    case 'tip':
      return (
        <aside className="theory__tip">
          <strong>Ojo: </strong>
          <RichText text={block.text} />
        </aside>
      )

    case 'try':
      return (
        <figure className="theory__try">
          <figcaption>
            <strong>Pruébalo: </strong><RichText text={block.ask} />
            {block.datos && <span className="theory__try-data"> Datos de prueba: {block.datos.join(', ')}.</span>}
          </figcaption>
          <PseintSandbox initialCode={block.code} rows={Math.min(18, block.code.split('\n').length + 1)} />
        </figure>
      )

    case 'form':
      return <FormMock block={block} />

    case 'code':
      return <CodeBlock text={block.text} lang={block.lang} className="theory__code" />

    case 'syntax':
      return (
        <figure className="theory__syntax">
          <figcaption>
            <strong>Estructura: </strong>{block.title}
          </figcaption>
          <CodeBlock text={block.template} lang={block.lang} placeholders className="theory__code" />
          {block.parts?.length > 0 && (
            <dl className="theory__parts">
              {block.parts.map((part) => (
                <div key={part.name}>
                  <dt><code className="tok tok--placeholder">{part.name}</code></dt>
                  <dd><RichText text={part.desc} /></dd>
                </div>
              ))}
            </dl>
          )}
        </figure>
      )

    case 'example':
      return (
        <figure className="theory__example">
          <div className="theory__example-text">
            <blockquote lang={lang}>{block.text}</blockquote>
            <SpeakButton text={block.text} lang={lang} />
          </div>
          <figcaption>{block.translation}</figcaption>
        </figure>
      )

    case 'scene':
      return (
        <figure className="theory__scene">
          {block.title && <figcaption><strong>{block.title}</strong></figcaption>}
          <ul className="theory__scene-grid">
            {block.items.map((item) => (
              <li key={item.text} className="theory__scene-card">
                <span className="theory__scene-emoji" aria-hidden="true">{item.emoji}</span>
                <span className="theory__scene-text" lang={lang}>{item.text}</span>
                {item.translation && <span className="theory__scene-translation">{item.translation}</span>}
                <SpeakButton text={item.text} lang={lang} />
              </li>
            ))}
          </ul>
        </figure>
      )

    case 'timeline':
      return (
        <figure className="theory__timeline">
          {block.title && <figcaption><strong>{block.title}</strong></figcaption>}
          <div className="theory__timeline-axis" aria-hidden="true">
            <span>Pasado</span>
            <span>Futuro</span>
          </div>
          <ol className="theory__timeline-rows" style={{ '--now': `${block.now}%` }}>
            {block.events.map((event) => (
              <li key={event.label} className="theory__timeline-row">
                <span className="theory__timeline-label">
                  <span aria-hidden="true">{event.emoji}</span> {event.label}
                </span>
                <span className="theory__timeline-track" aria-hidden="true">
                  {event.to === undefined || event.to === event.from ? (
                    <span className="theory__timeline-dot" style={{ left: `${event.from}%` }} />
                  ) : (
                    <span
                      className="theory__timeline-bar"
                      style={{ left: `${event.from}%`, width: `${event.to - event.from}%` }}
                    />
                  )}
                </span>
              </li>
            ))}
          </ol>
          <p className="theory__timeline-now">La línea verde marca el ahora.</p>
        </figure>
      )

    case 'table':
      return (
        <div className="theory__table-wrapper">
          <table className="theory__table">
            <thead>
              <tr>
                {block.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    default:
      return null
  }
}

export default LessonTheory
