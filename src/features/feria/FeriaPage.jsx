import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../ui/Logo.jsx'
import MarkLast from '../../ui/MarkLast.jsx'
import './feria.css'

const VIDEO_SRC = '/video/explain-video.mp4'
// Optional: an embed URL (YouTube or Vimeo) takes precedence over the local file.
const VIDEO_EMBED_URL = null

const GLYPHS = {
  idea: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
  edge: 'M12 3l3 6 6 .9-4.5 4.3 1 6.3L12 17.5 6.5 20.5l1-6.3L3 9.9 9 9z',
  goals: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  team: 'M9 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17 14c2.5 0 4 2 4 6',
  plan: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 15l2 2 4-4',
  practice: 'M4 20l1-5L16 4l4 4L9 19zM14 6l4 4',
  mastery: 'M4 18h4v-4H4zM10 18h4v-8h-4zM16 18h4V6h-4z',
  mentor: 'M12 4l9 4-9 4-9-4zM7 10.5V16c0 1.5 2.2 3 5 3s5-1.5 5-3v-5.500',
  market: 'M3 20h18M6 20V10M12 20V4M18 20v-7',
  plans: 'M3 7h18v12H3zM3 11h18M7 15h4',
  ods4: 'M3 5c3 0 6 .5 9 2 3-1.5 6-2 9-2v13c-3 0-6 .5-9 2-3-1.5-6-2-9-2zM12 7v13',
  ods10: 'M5 8h14M5 16h14M16 5l3 3-3 3M8 13l-3 3 3 3',
  ods9: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5',
}

function Glyph({ name, size = 28 }) {
  return (
    <svg className="feria__glyph" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" focusable="false">
      <path d={GLYPHS[name]} pathLength="1" />
    </svg>
  )
}

const DIFFERENTIATORS = [
  ['plan', 'Un plan con meta', 'Una ruta con fecha hasta el examen: qué estudiar hoy y en qué orden. No es un chat.'],
  ['practice', 'Práctica primero', 'Respondes antes de ver la solución, y la repetición espaciada te devuelve lo que se te olvida.'],
  ['mastery', 'Dominio medido', 'Sabe qué tema ya manejas y cuál necesita otra vuelta.'],
  ['mentor', 'Capa de mentor', 'El mentor ve cómo avanza su grupo.', 'En desarrollo'],
]

// Colors of each goal as the United Nations defines them.
const GOALS = [
  ['4', 'Educación de calidad', 'Aprendizaje personalizado, y una IA que sirve para aprender mejor y no solo para copiar respuestas.', '#c5192d', '#ffffff', 'ods4'],
  ['10', 'Reducción de las desigualdades', 'Un estudiante de una seccional, sin tutor disponible, accede a un acompañamiento que hoy tienen pocos.', '#dd1367', '#ffffff', 'ods10'],
  ['9', 'Industria, innovación e infraestructura', 'Tecnología hecha desde una región intermedia, con costos bajos de operación.', '#f36d25', '#0d0f12', 'ods9'],
]

const AUDIENCES = [
  {
    id: 'usuarios',
    tab: 'Usuarios',
    title: 'Quien quiere aprender un tema o reforzarlo',
    text: 'Estudiantes de colegio (por ejemplo, para las pruebas Saber), universitarios y personas que aprenden un idioma o programación por su cuenta.',
    note: 'Se arranca con el entorno que ya conocemos: ingeniería, programación e inglés. Desde ahí se amplía.',
  },
  {
    id: 'multiplicadores',
    tab: 'Multiplicadores',
    title: 'Quien acompaña a un grupo',
    text: 'Mentores, docentes y tutores que quieren ver el avance de su grupo.',
    note: 'Llegan con sus estudiantes, y cada uno que entra trae a otros.',
  },
  {
    id: 'escala',
    tab: 'Cliente a escala',
    title: 'Quien necesita acompañar a muchos',
    text: 'Universidades, colegios, academias y programas de formación que deben acompañar a sus estudiantes y demostrar un uso responsable de la IA.',
    note: 'Es el plan Institucional: una licencia por estudiante al año.',
  },
]

const SEMESTER_MONTHS = 6
const MONTHLY = 14900
const SEMESTER = 49900

const PLANS = [
  {
    id: 'gratis',
    name: 'Gratis',
    pitch: 'Para probar',
    items: ['Pocas rutas al mes', 'Ejercicios y repaso'],
  },
  {
    id: 'estudiante',
    name: 'Estudiante',
    pitch: 'Para estudiar en serio',
    items: ['Más rutas al mes', 'Menos que Duolingo Super en Colombia (cerca de $27.900 al mes)'],
    featured: true,
  },
  {
    id: 'institucional',
    name: 'Institucional',
    pitch: 'Para quien acompaña a muchos',
    items: ['Panel de mentor con el avance del grupo', 'Para universidades, colegios y academias'],
  },
]

const STEPS = [0, 1, 2, 3, 4]

const formatCop = (value) => `$${Math.round(value).toLocaleString('es-CO')}`

// Eases a number toward its target so a price swap reads as a change, not a jump.
function useTween(target) {
  const [value, setValue] = useState(target)
  const current = useRef(target)

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const duration = reduced ? 0 : 450
    const from = current.current
    const start = performance.now()
    let frame
    const tick = (now) => {
      const t = duration ? Math.min((now - start) / duration, 1) : 1
      const next = from + (target - from) * (1 - (1 - t) ** 3)
      current.current = next
      setValue(next)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return value
}

function MarketBlock() {
  const [active, setActive] = useState(0)
  const current = AUDIENCES[active]

  const onKeyDown = (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (active + step + AUDIENCES.length) % AUDIENCES.length
    setActive(next)
    document.getElementById(`mercado-tab-${AUDIENCES[next].id}`)?.focus()
  }

  return (
    <section className="feria__block" aria-labelledby="mercado">
      <BlockTitle id="mercado" glyph="market">Mercado meta</BlockTitle>
      <div className="feria__body">
        <p className="feria__sector" data-reveal>
          <span className="feria__chip">Sector económico</span>
          Educativo y tecnológico (EdTech): una aplicación web que usa inteligencia artificial para el aprendizaje.
        </p>
        <div className="feria__tabs" role="tablist" aria-label="Mercado meta" data-reveal onKeyDown={onKeyDown}>
          {AUDIENCES.map((audience, i) => (
            <button
              key={audience.id}
              id={`mercado-tab-${audience.id}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls="mercado-panel"
              tabIndex={i === active ? 0 : -1}
              className="feria__tab"
              onClick={() => setActive(i)}
            >
              {audience.tab}
            </button>
          ))}
        </div>
        <div
          key={current.id}
          id="mercado-panel"
          role="tabpanel"
          aria-labelledby={`mercado-tab-${current.id}`}
          className="feria__panel"
        >
          <p className="feria__panel-title">{current.title}</p>
          <p>{current.text}</p>
          <p className="feria__panel-note">{current.note}</p>
        </div>
      </div>
    </section>
  )
}

function PlansBlock() {
  const [semester, setSemester] = useState(false)
  const price = useTween(semester ? SEMESTER : MONTHLY)
  const saving = MONTHLY * SEMESTER_MONTHS - SEMESTER

  return (
    <section className="feria__block" aria-labelledby="modelo">
      <BlockTitle id="modelo" glyph="plans">Modelo de negocio</BlockTitle>
      <div className="feria__body feria__body--wide">
        <p data-reveal>
          Es <em>freemium</em>: empiezas gratis y pagas solo si lo necesitas. Tres planes.
        </p>
        <div className="feria__switch" role="group" aria-label="Facturación del plan Estudiante" data-reveal>
          <button type="button" aria-pressed={!semester} onClick={() => setSemester(false)}>
            Mensual
          </button>
          <button type="button" aria-pressed={semester} onClick={() => setSemester(true)}>
            Semestral
            <span className="feria__save">Ahorras {formatCop(saving)}</span>
          </button>
        </div>
        <ul className="feria__plans">
          {PLANS.map((plan, i) => (
            <li
              key={plan.id}
              className={`feria__plan${plan.featured ? ' feria__plan--featured' : ''}`}
              data-reveal
              style={{ '--d': `${i * 90}ms` }}
            >
              <p className="feria__plan-name">{plan.name}</p>
              <p className="feria__plan-pitch">{plan.pitch}</p>
              {plan.id === 'gratis' && <p className="feria__price">$0</p>}
              {plan.id === 'estudiante' && (
                <>
                  <p className="feria__price" aria-live="polite">
                    {formatCop(price)}
                    <span> COP {semester ? 'por semestre' : 'al mes'}</span>
                  </p>
                  <p className="feria__plan-alt">
                    {semester
                      ? `Equivale a ${formatCop(SEMESTER / SEMESTER_MONTHS)} al mes`
                      : `O ${formatCop(SEMESTER)} por semestre`}
                  </p>
                </>
              )}
              {plan.id === 'institucional' && (
                <>
                  <p className="feria__price">
                    $20.000–30.000<span> COP por estudiante al año</span>
                  </p>
                  <p className="feria__plan-alt">Precio aproximado</p>
                </>
              )}
              <ul className="feria__plan-items">
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="feria__source" data-reveal>
          Son precios de partida que estamos validando con los propios estudiantes.
        </p>
      </div>
    </section>
  )
}

function RouteDiagram() {
  return (
    <svg className="feria__route" viewBox="0 0 480 280" role="img" aria-label="Tres archivos de apuntes se convierten en una ruta de cinco pasos hasta la fecha del parcial">
      {[0, 1, 2].map((i) => (
        <g key={i} className="feria__sheet" style={{ '--i': i }} transform={`translate(${10 + i * 8} ${40 + i * 62})`}>
          <rect width="84" height="52" />
          <path d="M12 16h44M12 28h60M12 40h32" />
        </g>
      ))}
      <path className="feria__trail" pathLength="1" d="M112 120h50v90h60v-45h60v-45h60v-45h60v-45h30" />
      {STEPS.map((i) => (
        <rect key={i} className="feria__step" style={{ '--i': i }} x={160 + i * 60} y={196 - i * 45} width="28" height="28" />
      ))}
      <g className="feria__flag">
        <path d="M430 56V16M430 16h38l-10 12 10 12h-38" />
      </g>
    </svg>
  )
}

function DotGrid({ lit, label }) {
  return (
    <figure className="feria__dots" data-reveal>
      <div className="feria__grid" role="img" aria-label={`${lit} de cada 100`}>
        {Array.from({ length: 100 }, (_, i) => (
          <span key={i} className={i < lit ? 'is-lit' : undefined} style={{ '--i': i }} />
        ))}
      </div>
      <figcaption>
        <strong>{lit}</strong> de cada 100 {label}
      </figcaption>
    </figure>
  )
}

function BlockTitle({ id, glyph, children }) {
  return (
    <div className="feria__title" data-reveal>
      <Glyph name={glyph} size={40} />
      <h2 id={id}>{children}</h2>
    </div>
  )
}

function FeriaPage() {
  const root = useRef(null)

  useEffect(() => {
    const previous = document.title
    document.title = 'APROPIA — Haz tuyo lo que aprendes'
    return () => {
      document.title = previous
    }
  }, [])

  // Sections settle in as they enter the viewport; without motion everything is simply visible.
  useEffect(() => {
    const node = root.current
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (!node || reduced || typeof IntersectionObserver === 'undefined') return undefined

    node.classList.add('feria--armed')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    node.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
      node.classList.remove('feria--armed')
    }
  }, [])

  return (
    <div className="feria" ref={root}>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <header className="feria__top">
        <Link to="/" className="app-brand" aria-label="APROPIA, plataforma">
          <Logo />
        </Link>
      </header>

      <main className="feria__main" id="contenido" tabIndex={-1}>
        <section className="feria__hero" aria-labelledby="feria-titulo">
          <h1 id="feria-titulo">
            <MarkLast text="Haz tuyo lo que aprendes" />
          </h1>
          <RouteDiagram />
        </section>

        <section className="feria__video" aria-label="Video explicativo" data-reveal>
          {VIDEO_EMBED_URL ? (
            <iframe
              src={VIDEO_EMBED_URL}
              title="Apropia: video explicativo"
              loading="lazy"
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={VIDEO_SRC}
              controls
              playsInline
              preload="metadata"
              aria-label="Apropia: video explicativo"
            >
              Tu navegador no reproduce video. <a href={VIDEO_SRC}>Descargar el video</a>
            </video>
          )}
        </section>

        <section className="feria__block" aria-labelledby="idea">
          <BlockTitle id="idea" glyph="idea">La idea</BlockTitle>
          <div className="feria__body">
            <div className="feria__dots-pair">
              <DotGrid lit={91} label="universitarios colombianos usan IA para estudiar." />
              <DotGrid lit={61} label="reconocen que nadie les enseñó a usarla bien." />
            </div>
            <p data-reveal>
              Muchos la usan para obtener la respuesta y seguir, y así no aprenden más. Apropia parte de tus
              apuntes, arma tu ruta con fecha hasta el parcial y te hace practicar antes de ver las respuestas.
            </p>
            <p className="feria__status-line" data-reveal>
              Hoy hay una demostración funcional y un piloto con un estudiante de inglés en marcha.
            </p>
            <p className="feria__source" data-reveal>Fuentes: GAD3 y Planeta Formación (2024); Fan et al. (2025).</p>
          </div>
        </section>

        <section className="feria__block" aria-labelledby="diferencial">
          <BlockTitle id="diferencial" glyph="edge">El factor diferencial</BlockTitle>
          <div className="feria__body">
            <p data-reveal>
              Generar preguntas y tarjetas ya no distingue a nadie. Apropia compite en todo lo que rodea al material.
            </p>
            <dl className="feria__list">
              {DIFFERENTIATORS.map(([glyph, term, text, status], i) => (
                <div key={term} className="feria__row" data-reveal style={{ '--d': `${i * 70}ms` }}>
                  <dt>
                    <Glyph name={glyph} />
                    <span>
                      {term}
                      {status && <span className="feria__status">{status}</span>}
                    </span>
                  </dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <MarketBlock />

        <PlansBlock />

        <section className="feria__block" aria-labelledby="ods">
          <BlockTitle id="ods" glyph="goals">Los ODS que impacta</BlockTitle>
          <div className="feria__body">
            <ul className="feria__list">
              {GOALS.map(([number, name, text, color, onColor, glyph], i) => (
                <li key={number} className="feria__row feria__row--goal" data-reveal style={{ '--d': `${i * 90}ms` }}>
                  <div className="feria__tile" style={{ background: color, color: onColor }}>
                    <span className="feria__tile-label">ODS</span>
                    <span className="feria__tile-number">{number}</span>
                    <Glyph name={glyph} size={32} />
                  </div>
                  <div>
                    <p className="feria__goal-name">{name}</p>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="feria__block" aria-labelledby="equipo">
          <BlockTitle id="equipo" glyph="team">Equipo</BlockTitle>
          <div className="feria__body">
            <div className="feria__row feria__row--person" data-reveal>
              <div className="feria__avatar" aria-hidden="true">MC</div>
              <div>
                <p className="feria__person">Manuel David Castro Tocora</p>
                <p>
                  Estudiante de ingeniería, fundador y desarrollador. La plataforma se está probando en una mentoría.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="feria__cta" aria-labelledby="probar" data-reveal>
          <h2 id="probar">Pruébala tú</h2>
          <p>5 preguntas contra el reloj, la IA comenta tu explicación y entras al ranking del día.</p>
          <Link to="/reto" className="btn-primary">
            Jugar el reto
          </Link>
        </section>
      </main>
    </div>
  )
}

export default FeriaPage
