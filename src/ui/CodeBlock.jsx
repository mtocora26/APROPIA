import { highlight } from './highlight.js'
import './codeBlock.css'

/** Fragmentos de una línea ya resaltada, como <span>. */
export function CodeLine({ parts }) {
  return parts.map((part, i) =>
    part.kind === 'plain' ? part.text : <span key={i} className={`tok tok--${part.kind}`}>{part.text}</span>,
  )
}

/** Bloque de código con colores por tipo de palabra (estructura, entrada/salida, tipos…). */
function CodeBlock({ text, lang = 'pseint', placeholders = false, className = '' }) {
  const lines = highlight(text, { lang, placeholders })
  return (
    <pre className={`code-block ${className}`.trim()}>
      <code>
        {lines.map((parts, i) => (
          <span key={i} className="code-block__line">
            <CodeLine parts={parts} />
            {'\n'}
          </span>
        ))}
      </code>
    </pre>
  )
}

/** Texto con `código en línea` entre acentos graves. */
export function RichText({ text }) {
  return text.split(/`([^`]+)`/).map((chunk, i) =>
    i % 2 === 1 ? <code key={i} className="inline-code">{chunk}</code> : chunk,
  )
}

export default CodeBlock
