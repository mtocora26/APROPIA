# Arquitectura de APROPIA

> ⚠️ **Pivote 2026-09-22**: se decidió migrar a React (ver [ADR-0002](./decisiones/ADR-0002-adopcion-react-vite.md)) y usar **Firebase (Firestore + Auth email/password, cuenta única) como backend**, más **Capacitor** para empaquetar app nativa (ver [ADR-0004](./decisiones/ADR-0004-firebase-y-capacitor.md), que supera a ADR-0003). El contenido viejo (verbos irregulares, ICFES, Context Hunt) se archiva en `/legacy` — ya no es el foco del producto. Las secciones 1-2 de abajo describen el estado *pre-pivote* como referencia histórica; la sección 4 describe el destino real actual.

## 1. Estado actual (línea base, sep-2026) — histórico, pre-pivote

Proyecto 100% estático (sin backend, sin build tool):

```
index.html / icfes.html / contextHunt.html
  └── assets/css/*.css        (style.css 1281L, icfes.css 1299L, contextHunt.css 824L)
  └── assets/js/*.js          (cargados como <script> globales, sin módulos)
        app.js            2062L  → dashboard, verbos irregulares, stats, listas custom
        icfes.js          2245L  → simulacro ICFES completo (UI + lógica + estado)
        icfes.questionBank.js    → banco de preguntas (datos)
        contextHunt.js     641L  → mini-juego "Context Hunt"
        fsrs.js             467L → algoritmo de repetición espaciada (FSRS)
        fsrsPractice.js     351L → UI de práctica usando fsrs.js
        flashcardsNormal.js 133L → flashcards
        pastContinuous.js  356L → ejercicios de pasado continuo
Persistencia: localStorage directo (sin capa de abstracción)
```

### Problemas identificados
- **God files**: `app.js` e `icfes.js` mezclan datos, lógica de dominio, DOM y persistencia en un solo archivo.
- **Scope global**: todo se comunica por variables/funciones globales vía `<script>` (riesgo de colisión, difícil de testear).
- **Acoplamiento a `localStorage`**: cada módulo lee/escribe claves directamente, no hay contrato único.
- **Datos mezclados con lógica**: bancos de verbos/oraciones viven dentro del código (excepto `icfes.questionBank.js`, que ya es el patrón correcto a replicar).
- **Sin pruebas, sin lint, sin CI.**
- **Cada modo de ejercicio reinventa su propio ciclo** (flashcards, context hunt, FSRS, ICFES) sin una interfaz común.

Esto no es "malo" para un side-project que arrancó como vibe coding — es el punto de partida normal. El objetivo ahora es **evolucionarlo con intención**, no reescribirlo de golpe.

## 2. Arquitectura objetivo (destino, incremental)

Seguimos siendo estáticos (GitHub Pages friendly), pero introducimos capas y contratos:

```
src/
  core/                 # motor genérico, reutilizable, sin conocimiento de "verbos" o "ICFES"
    storage/            # Repository Pattern sobre localStorage (StorageRepository)
    events/             # EventBus (Observer/PubSub) → progreso, XP, logros
    fsrs/               # motor de repaso espaciado (ya existe, se mueve aquí)
    session/            # State Pattern: idle → in-progress → reviewing → completed
  domain/                # modelos planos + validación (Verb, Question, Deck, ExerciseResult)
  content/               # bancos de datos puros (verbs.js, sentences.js, icfes.questionBank.js)
  features/              # un folder por modo de ejercicio, cada uno implementa ExerciseModule
    flashcards/
    context-hunt/
    icfes/
    past-continuous/
    fsrs-practice/
    gamification/        # XP, rachas, logros — consume EventBus, no acopla a features
  ui/                    # componentes/render helpers compartidos (nav, stats bar, modales)
docs/                    # este directorio
assets/css, index.html...
```

### Patrones de diseño a introducir (uno por fase, no todos a la vez)
| Patrón | Dónde | Para qué |
|---|---|---|
| **Módulos ES (`import`/`export`)** | todo `src/` | Eliminar globals, dependencias explícitas |
| **Repository** | `core/storage` | Un único punto para leer/escribir progreso; permite migrar a IndexedDB o backend después sin tocar features |
| **Observer / PubSub (EventBus)** | `core/events` | Gamificación reacciona a `exercise:completed`, `answer:correct`, etc. sin acoplarse a cada feature |
| **Strategy** | `features/*` | Todo ejercicio implementa el mismo contrato: `start()`, `render()`, `evaluate()`, `getStats()` |
| **Factory** | `core/session` | Crear el módulo de ejercicio correcto según tipo seleccionado |
| **State** | `core/session` | Ciclo de vida de una sesión de estudio con transiciones explícitas y válidas |

Esto se documenta formalmente con **ADRs** (Architecture Decision Records) en [`decisiones/`](./decisiones/) cada vez que se tome una decisión estructural relevante.

### Principios guía (siguen vigentes tras el pivote)
1. **Incremental, no big-bang**: cada feature se migra cuando se toca, no todas a la vez.
2. **Datos separados de lógica**: todo banco de contenido va en `content/`, organizado por idioma/curso.
3. **Contratos antes que implementación**: toda pieza nueva (componente, hook, servicio) primero define su interfaz antes de escribir código.
4. **Documentar decisiones, no solo código**: ADR corto (10 min) > refactor sin justificar.
5. **Diseñar costuras de reemplazo (seams)**: la capa de persistencia se esconde detrás de un `ProgressRepository` para poder cambiar `localStorage` por una API sin tocar UI.

## 3. Arquitectura destino (post-pivote): React + Vite, multi-idioma, Firebase, Capacitor

### Por qué React (resumen — detalle en ADR-0002)
Se buscaba aprender: componentes, hooks, patrones de estado, separación de capas. Vite+React da eso sin la complejidad extra de un meta-framework (Next.js), y sigue desplegando como sitio estático (sin servidor propio que mantener).

### Por qué Firebase + Capacitor (resumen — detalle en ADR-0004)
El plan real es usar la app desde el celular de forma recurrente y eventualmente tener una app instalable. Firebase (Firestore + Auth email/password con una sola cuenta) da persistencia + identidad **que sí sincroniza entre dispositivos** (a diferencia de auth anónima, que crea un `uid` distinto por instalación) sin operar un servidor propio; Capacitor empaqueta la misma app React como instalable en Android/iOS sin reescribir UI. Se integra **progresivamente**: primero `LocalStorageRepository` (aprender React sin ruido de red), luego `FirebaseRepository` (mismo contrato), luego el empaquetado con Capacitor.

### Estructura de carpetas propuesta
```
src/
  app/                    # entrada, layout, routing (React Router)
  core/
    storage/              # ProgressRepository (interfaz)
      LocalStorageRepository.js   # implementación inicial (Paso A)
      FirebaseRepository.js       # implementación con Firestore (Paso B)
    firebase/              # inicialización del SDK de Firebase (config, auth email/password)
    fsrs/                  # motor de repetición espaciada (portado del legacy, reutilizable)
  domain/                 # tipos/modelos: Course, Lesson, Exercise, ExerciseResult, Achievement
  content/
    courses/
      italian-a1/         # lecciones + ejercicios del curso de italiano
      business-english/   # lecciones + ejercicios del curso de inglés de negocios
  features/
    lessons/              # componentes + hooks para consumir una mini-lección
    exercises/             # un subfolder por tipo de ejercicio, cada uno con su hook `useXxxExercise`
    gamification/          # XP, rachas, logros — hook/contexto propio
    dashboard/
  ui/                      # componentes compartidos (Button, Card, ProgressBar, Nav)
  hooks/                   # hooks genéricos reutilizables entre features
legacy/                    # código vanilla JS anterior, archivado, no se toca
capacitor.config.ts        # configuración de empaquetado nativo (se agrega en el Paso C)
docs/
```

### Patrones de diseño en el mundo React (reemplazan/adaptan a los de la sección 2)
| Patrón (era vanilla JS) | Equivalente en React | Para qué |
|---|---|---|
| Repository (`core/storage`) | **Igual, se mantiene** — `ProgressRepository` interfaz + `LocalStorageRepository` / `FirebaseRepository` intercambiables | Aislar persistencia; la UI nunca sabe si los datos vienen de `localStorage` o de Firestore |
| EventBus (Observer) | **Context + reducer**, o hook `useEventBus` si de verdad hace falta desacoplar módulos que no comparten árbol de componentes | Gamificación reacciona a eventos de progreso sin acoplarse a cada ejercicio |
| Strategy (`ExerciseModule`) | **Custom Hooks** (`useFlashcardExercise`, `useQuizExercise`) que devuelven el mismo "shape" (`{ state, answer, next, stats }`) | Cada tipo de ejercicio es intercambiable desde el componente contenedor |
| Factory | Un mapa `exerciseType → hook/componente` + `React.lazy` si crece | Cargar el ejercicio correcto según el tipo de contenido |
| State (ciclo de sesión) | Reducer (`useReducer`) con estados explícitos: `idle → active → reviewing → done` | Transiciones de una sesión de estudio, testeables sin DOM |
| Container/Presentational | Nuevo, propio de React | Separar "qué datos/lógica" (container/hook) de "cómo se ve" (componente presentacional puro, fácil de testear) |
| **Adapter** (nuevo, con Firebase) | `FirebaseRepository` adapta el SDK de Firestore (asíncrono, con su propio formato de documento) a la interfaz simple de `ProgressRepository` | El resto de la app no conoce la forma de los documentos de Firestore ni maneja el SDK directamente |

### Modelo de contenido (multi-curso, multi-idioma)
Cada curso (`italian-a1`, `business-english`) es un módulo de `content/courses/` con la misma forma:
```
content/courses/<curso>/
  meta.js         # { id, title, language, level }
  lessons/        # mini-lecciones (texto + ejemplos)
  exercises/      # bancos de preguntas/ejercicios, mismo shape que domain/Exercise
```
Esto permite agregar un curso nuevo sin tocar código de `features/` — solo se agrega contenido siguiendo el contrato. El contenido en sí (lecciones/ejercicios) vive en el bundle de la app (no en Firestore); **Firestore solo guarda progreso del usuario** (qué completó, XP, rachas, resultados de FSRS) — separación clara entre "contenido estático" y "estado del usuario".

### Seguridad (obligatoria, no opcional, ver ADR-0004)
Firestore necesita **reglas de seguridad** desde el primer día que se conecte, del estilo:
```
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```
Sin esto, cualquiera con la configuración pública del proyecto (que viaja en el bundle del cliente, es normal en Firebase) podría leer/escribir los datos de cualquier usuario.
