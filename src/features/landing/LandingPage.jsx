import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NOTES_UPLOAD_PATH } from '../routes/paths.js'
import Icon from '../../ui/Icon.jsx'
import Logo from '../../ui/Logo.jsx'
import Meter from '../../ui/Meter.jsx'
import Panel from '../../ui/Panel.jsx'
import './landing.css'

const COURSES_PATH = '/inicio'

const STAGES = [
  { id: 'subir', name: 'Subir apuntes' },
  { id: 'ruta', name: 'Generar ruta' },
  { id: 'practicar', name: 'Practicar' },
  { id: 'evaluar', name: 'Evaluar' },
  { id: 'reforzar', name: 'Reforzar' },
]

const FILES = [
  ['apuntes-calculo-II.pdf', '24 páginas'],
  ['guia-derivadas.pdf', '8 páginas'],
  ['clase-05.pptx', '31 diapositivas'],
]

const PATH_STEPS = ['Guía', 'Concepto', 'Ejemplo', 'Práctica', 'Aplicar']

const TOPICS = [
  ['Definición de derivada', 'dominio', 'Dominio'],
  ['Regla del producto', 'proceso', 'En proceso'],
  ['Regla de la cadena', 'refuerzo', 'Reforzar'],
]

const LOOP = [
  ['refuerzo', 'Reforzar'],
  ['proceso', 'En proceso'],
  ['dominio', 'Dominio'],
]

function Availability({ ready }) {
  return (
    <span className={`landing__availability${ready ? '' : ' landing__availability--soon'}`}>
      {ready ? 'Ya funciona' : 'Próximamente'}
    </span>
  )
}

function LandingPage() {
  const [active, setActive] = useState(0)

  // The route follows the section that crosses the middle of the viewport.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number(entry.target.dataset.stage))
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('.landing [data-stage]').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="landing__top">
        <Link to="/" className="app-brand" aria-label="APROPIA, inicio">
          <Logo />
        </Link>
        <nav className="landing__top-nav" aria-label="Entrar a la plataforma">
          <Link to="/reto" className="landing__top-link">
            Reto
          </Link>
          <Link to={COURSES_PATH} className="landing__top-link">
            Cursos
          </Link>
          <Link to={NOTES_UPLOAD_PATH} className="btn-primary landing__top-cta">
            Sube tus apuntes
          </Link>
        </nav>
      </header>

      <div className="landing__body">
        <aside className="landing__route" aria-label="Ruta de aprendizaje">
          <p className="label landing__route-title">Tu ruta · Cálculo II</p>
          <p className="landing__mobile-stage">
            Etapa {active + 1} de {STAGES.length} · {STAGES[active].name}
          </p>
          <ol className="landing__stages">
            {STAGES.map((stage, i) => {
              const state = i < active ? 'listo' : i === active ? 'actual' : 'pendiente'
              return (
                <li
                  key={stage.id}
                  className={`landing__stage landing__stage--${state}`}
                  aria-current={state === 'actual' ? 'step' : undefined}
                >
                  <span className="landing__block" aria-hidden="true" />
                  <span className="landing__stage-name">{stage.name}</span>
                  <span className="landing__stage-state">{state}</span>
                </li>
              )
            })}
          </ol>
          <div className="landing__meter">
            <p className="label">Comprensión</p>
            <Meter
              value={active + 1}
              max={STAGES.length}
              label={`Etapa ${active + 1} de ${STAGES.length}`}
            />
          </div>
        </aside>

        <main className="landing__main" id="contenido" tabIndex={-1}>
          <section className="landing__hero" data-stage="0" id="inicio">
            <h1>
              Entiende lo que <span className="mark">estudias</span>
            </h1>
            <p className="landing__lead">
              Sube tus apuntes. APROPIA arma la ruta, mide si comprendes y refuerza lo que te falta.
            </p>
            <div className="landing__actions">
              <Link to={NOTES_UPLOAD_PATH} className="btn-primary">
                Sube tus apuntes
              </Link>
              <Link to={COURSES_PATH} className="btn-secondary">
                Ver los cursos
              </Link>
            </div>
            <p className="landing__honest">
              Hoy funciona: subir tus apuntes, generar la ruta con IA y practicar con ejercicios y repaso. Medir la comprensión tema por tema es lo que sigue.
            </p>
          </section>

          <section className="landing__section" data-stage="0" aria-labelledby="t-subir">
            <h2 id="t-subir">Sube lo que ya tienes</h2>
            <Availability ready />
            <p>Apuntes, guías y presentaciones son el punto de partida. No empiezas de cero.</p>
            <div className="landing__example landing__plain">
              <p className="label">Ejemplo ilustrativo</p>
              <ul className="landing__files">
                {FILES.map(([name, size]) => (
                  <li key={name}>
                    <span className="landing__file">
                      <Icon name="file" size={20} />
                      {name}
                    </span>
                    <span>{size}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            className="landing__section"
            data-stage="1"
            id="ruta"
            aria-labelledby="t-ruta"
          >
            <h2 id="t-ruta">La IA arma tu ruta</h2>
            <Availability ready />
            <p>De tus materiales salen una ruta con fecha hasta el parcial y ejercicios ordenados para ir de lo básico a lo aplicado.</p>
            <div className="landing__example landing__plain">
              <p className="label">Ejemplo ilustrativo</p>
              <ol className="landing__path">
                {PATH_STEPS.map((step, i) => (
                  <li key={step} className="landing__path-step cut-corners">
                    <span className="landing__path-n">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="landing__section" data-stage="2" aria-labelledby="t-practicar">
            <h2 id="t-practicar">Practica activamente</h2>
            <Availability ready />
            <p>Responder, ordenar, explicar con tus palabras. Estudiar no es releer.</p>
            <div className="landing__example landing__plain">
              <p className="label">Ejemplo ilustrativo</p>
              <p className="landing__question">¿Qué mide la derivada de una función en un punto?</p>
              <ul className="landing__tiles">
                <li>El área bajo la curva</li>
                <li className="landing__tile--ok">
                  <span className="state state--dominio">Correcta</span> La pendiente de la tangente
                </li>
                <li>El valor máximo de la función</li>
              </ul>
              <span className="btn-primary landing__check" aria-hidden="true">Siguiente</span>
            </div>
          </section>

          <section className="landing__section" data-stage="3" aria-labelledby="t-evaluar">
            <h2 id="t-evaluar">Mide si <span className="mark">comprendes</span></h2>
            <Availability ready={false} />
            <p>No cuenta aciertos: detecta qué entiendes y qué no, tema por tema.</p>
            <Panel as="div" featured className="landing__example">
              <p className="label">Ejemplo ilustrativo</p>
              <div className="landing__topic-meter">
                <span className="label">Cálculo II</span>
                <Meter value={5} max={10} label="Comprensión del curso: 5 de 10" />
              </div>
              <ul className="landing__files">
                {TOPICS.map(([name, kind, word]) => (
                  <li key={name}>
                    <span>{name}</span>
                    <span className={`state state--${kind}`}>{word}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </section>

          <section className="landing__section" data-stage="4" aria-labelledby="t-reforzar">
            <h2 id="t-reforzar">Se adapta a ti</h2>
            <Availability ready={false} />
            <p>Lo que marcas para reforzar vuelve en nuevas actividades hasta que pasa a dominio. La ruta cambia contigo.</p>
            <Panel as="div" featured className="landing__example">
              <p className="label">Ejemplo ilustrativo</p>
              <ol className="landing__loop">
                {LOOP.map(([kind, word], i) => (
                  <li key={kind}>
                    <span className={`state state--${kind}`}>{word}</span>
                    {i < LOOP.length - 1 && <Icon name="forward" size={18} />}
                  </li>
                ))}
              </ol>
            </Panel>
            <div className="landing__example landing__plain landing__now cut-corners">
              <p className="label">Qué funciona hoy</p>
              <p>
                Rutas generadas con IA desde tus apuntes, lecciones y ejercicios, flashcards con repaso
                espaciado, recap de inicio de clase y registro de tutorías.
              </p>
              <p className="landing__who">
                Pensada para estudiantes. Mentores y, más adelante, docentes también podrán ver el avance.
              </p>
            </div>
            <div className="landing__actions">
              <Link to={NOTES_UPLOAD_PATH} className="btn-primary">
                Sube tus apuntes
              </Link>
              <Link to={COURSES_PATH} className="btn-secondary">
                Ver los cursos
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default LandingPage
