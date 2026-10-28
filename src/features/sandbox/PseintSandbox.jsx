import { useId, useState } from 'react'
import { CodeLine } from '../../ui/CodeBlock.jsx'
import Icon from '../../ui/Icon.jsx'
import { highlight } from '../../ui/highlight.js'
import { SANDBOX_STATUS, useSandbox } from './useSandbox.js'
import './sandbox.css'

const STATUS_TEXT = {
  [SANDBOX_STATUS.IDLE]: 'Listo para ejecutar',
  [SANDBOX_STATUS.PAUSED]: 'Pausado: esta línea es la siguiente que se ejecuta',
  [SANDBOX_STATUS.INPUT]: 'Esperando un dato',
  [SANDBOX_STATUS.DONE]: 'Programa terminado',
  [SANDBOX_STATUS.ERROR]: 'El programa se detuvo',
}

/**
 * Editor + ejecución de PSeInt con variables a la vista. Controlado si recibe
 * `code` y `onCodeChange`; si no, guarda su propio texto.
 */
function PseintSandbox({ code: controlled, onCodeChange, initialCode = '', rows = 14, children }) {
  const [own, setOwn] = useState(initialCode)
  const code = controlled ?? own
  const setCode = onCodeChange ?? setOwn
  const { view, run, step, submitInput, reset } = useSandbox()
  const editing = view.status === SANDBOX_STATUS.IDLE
  const inputId = useId()

  return (
    <div className="sandbox">
      <div className="sandbox__toolbar" role="toolbar" aria-label="Ejecución">
        <button type="button" className="sandbox__btn sandbox__btn--primary" onClick={() => run(code)} disabled={view.status === SANDBOX_STATUS.DONE || view.status === SANDBOX_STATUS.ERROR || view.status === SANDBOX_STATUS.INPUT}>
          <Icon name="play" size={16} /> {view.status === SANDBOX_STATUS.PAUSED ? 'Seguir' : 'Ejecutar'}
        </button>
        <button type="button" className="sandbox__btn" onClick={() => step(code)} disabled={view.status === SANDBOX_STATUS.DONE || view.status === SANDBOX_STATUS.ERROR || view.status === SANDBOX_STATUS.INPUT}>
          Paso a paso
        </button>
        {!editing && (
          <button type="button" className="sandbox__btn" onClick={reset}>
            Editar código
          </button>
        )}
        {children}
        <span className="sandbox__status" role="status">{STATUS_TEXT[view.status]}</span>
      </div>

      <div className="sandbox__grid">
        <div className="sandbox__code">
          {editing ? (
            <textarea
              className="sandbox__editor"
              aria-label="Código en PSeInt"
              rows={rows}
              value={code}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={(event) => onEditorKey(event, code, setCode, () => run(code))}
            />
          ) : (
            <ol className="sandbox__lines" aria-label="Código en ejecución">
              {highlight(code).map((parts, index) => {
                const number = index + 1
                const isCurrent = number === view.line
                const kind = isCurrent ? (view.status === SANDBOX_STATUS.ERROR ? 'error' : 'current') : null
                return (
                  <li key={number} className={kind ? `sandbox__line sandbox__line--${kind}` : 'sandbox__line'} aria-current={isCurrent ? 'step' : undefined}>
                    <span className="sandbox__num" aria-hidden="true">{number}</span>
                    <code>{parts.length ? <CodeLine parts={parts} /> : ' '}</code>
                  </li>
                )
              })}
            </ol>
          )}
        </div>

        <div className="sandbox__side">
          <section aria-labelledby={`${inputId}-vars`}>
            <h3 id={`${inputId}-vars`} className="sandbox__title">Variables</h3>
            {view.vars.length === 0 ? (
              <p className="sandbox__empty">Aquí verás cada variable y su valor mientras corre el programa.</p>
            ) : (
              <table className="sandbox__vars">
                <thead>
                  <tr><th scope="col">Nombre</th><th scope="col">Tipo</th><th scope="col">Valor</th></tr>
                </thead>
                <tbody>
                  {view.vars.map((variable) => (
                    <tr key={variable.name} className={view.changed.includes(variable.name) ? 'sandbox__changed' : undefined}>
                      <th scope="row">{variable.name}</th>
                      <td>{variable.type}</td>
                      <td>{variable.text}{view.changed.includes(variable.name) && <span className="sandbox__tag"> cambió</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section aria-labelledby={`${inputId}-out`}>
            <h3 id={`${inputId}-out`} className="sandbox__title">Salida</h3>
            <pre className="sandbox__output" aria-live="polite">{view.output || 'Sin salida todavía.'}</pre>
          </section>

          {view.status === SANDBOX_STATUS.INPUT && (
            <InputPrompt key={view.steps} pending={view.pending} onSubmit={submitInput} />
          )}

          {view.error && (
            <p className="sandbox__error" role="alert">
              <strong>{view.error.line ? `Línea ${view.error.line}` : 'Error'}: </strong>
              {view.error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function InputPrompt({ pending, onSubmit }) {
  const [text, setText] = useState('')
  return (
    <form
      className="sandbox__input"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(text)
      }}
    >
      <label>
        Dato para «{pending.name}» ({pending.vtype})
        <input value={text} onChange={(event) => setText(event.target.value)} autoFocus autoComplete="off" />
      </label>
      <button type="submit" className="sandbox__btn sandbox__btn--primary">Enviar</button>
    </form>
  )
}

/** Tab inserta sangría; Ctrl/Cmd+Enter ejecuta. */
function onEditorKey(event, code, setCode, run) {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    run()
  } else if (event.key === 'Tab') {
    event.preventDefault()
    const { selectionStart: start, selectionEnd: end } = event.target
    const next = `${code.slice(0, start)}    ${code.slice(end)}`
    setCode(next)
    requestAnimationFrame(() => {
      event.target.selectionStart = event.target.selectionEnd = start + 4
    })
  }
}

export default PseintSandbox
