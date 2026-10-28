# Backlog — Tukola

Convención de ID: `EPIC-XX` para épicas, `EPIC-XX-YY` para historias.
Prioridad: 🔴 Alta · 🟡 Media · 🟢 Baja. Estimación en "sesiones de estudio" (≈1-2h cada una, pensado para tu ritmo actual).

> **Nota (2026-09-22)**: tras el pivote a React (ver [ADR-0002](../01-arquitectura/decisiones/ADR-0002-adopcion-react-vite.md)), la antigua EPIC-01 (fundamentos de arquitectura sobre vanilla JS) y EPIC-04 (nuevos ejercicios sobre el motor viejo) quedan **archivadas**. El código correspondiente vive en `/legacy` como referencia. Se reemplazan por EPIC-07 y EPIC-08 abajo.

## 🗄️ Archivado (pre-pivote, referencia)
<details>
<summary>EPIC-01 y EPIC-04 originales (click para ver)</summary>

- ~~EPIC-01-01/02/03/04/05/06~~ — Repository/EventBus/contrato de ejercicio sobre vanilla JS
- ~~EPIC-04-01/02~~ — ejercicio de ordenar oración / listening sobre el motor viejo

Los aprendizajes de diseño (Repository, Strategy, Observer) siguen aplicando — solo cambia el vehículo técnico a React (ver EPIC-07).
</details>

## EPIC-07 — Migración a React (base técnica)
_Objetivo: tener el esqueleto de la app en React con los patrones clave funcionando, antes de meter contenido real._

| ID | Historia | Prioridad | Est. |
|---|---|---|---|
| ✅ EPIC-07-01 | Scaffold Vite + React + React Router | 🔴 | 1 |
| ✅ EPIC-07-02 | `core/storage/ProgressRepository.js` (interfaz) + `LocalStorageRepository.js` (impl inicial — se reemplaza en EPIC-09 sin tocar UI) | 🔴 | 2 |
| ✅ EPIC-07-03 | Definir "shape" común de ejercicio vía custom hook (contrato `useExercise`: `state, answer(), next(), stats`) | 🔴 | 2 |
| EPIC-07-04 | Portar `fsrs.js` (repetición espaciada) a `core/fsrs/` como módulo ES puro, con tests | 🟡 | 2 |
| EPIC-07-05 | Componente `ExerciseContainer` genérico (Container/Presentational) que consuma cualquier hook de ejercicio | 🟡 | 2 |
| EPIC-07-06 | Reducer de sesión de estudio (`idle → active → reviewing → done`) con `useReducer` | 🟢 | 1 |

## EPIC-08 — Contenido multi-idioma (Italiano + Business English)
_Objetivo: modelar el contenido para que agregar un curso sea "solo agregar datos", no tocar código._

| ID | Historia | Prioridad | Est. |
|---|---|---|---|
| EPIC-08-01 | Definir modelo de datos `Course / Lesson / Exercise` en `domain/` (mismo shape para cualquier idioma) | 🔴 | 1 |
| EPIC-08-02 | Crear `content/courses/business-english/` con tu material actual (2-3 lecciones piloto) | 🔴 | 3 |
| EPIC-08-03 | Crear `content/courses/italian-a1/` con tu material actual (2-3 lecciones piloto) | 🔴 | 3 |
| EPIC-08-04 | Selector de curso en el dashboard (elegir idioma/curso activo) | 🟡 | 2 |
| EPIC-08-05 | Definir proceso repetible: "cómo convierto una clase de mi curso en contenido de la app" (plantilla) | 🟡 | 1 |
| ✅ EPIC-08-06 | Curso `english-tenses`: un módulo por tiempo verbal, contenido migrado de legacy (#20) + despliegue en Vercel | 🔴 | 2 |

## EPIC-09 — Firebase (Firestore + Auth email/password)
_Objetivo: sincronizar progreso entre dispositivos, con el mismo contrato `ProgressRepository` ya en uso._

| ID | Historia | Prioridad | Est. |
|---|---|---|---|
| EPIC-09-01 | Crear proyecto Firebase, agregar Firestore + Auth email/password al SDK del cliente, crear la cuenta única de usuario | 🔴 | 1 |
| EPIC-09-02 | Escribir reglas de seguridad de Firestore (`request.auth.uid == userId`) — **no es opcional** | 🔴 | 1 |
| EPIC-09-03 | Implementar `FirebaseRepository` cumpliendo la interfaz `ProgressRepository` (Adapter) + pantalla/formulario simple de login | 🔴 | 3 |
| EPIC-09-04 | Manejar estados de carga/error en la UI (async ahora es real, antes `localStorage` era síncrono) | 🟡 | 2 |
| EPIC-09-05 | Migración de datos: si ya hay progreso en `localStorage`, subirlo una vez a Firestore | 🟢 | 1 |

## EPIC-10 — Empaquetado nativo (Capacitor)
_Objetivo: app instalable en el celular, misma base de código React._

| ID | Historia | Prioridad | Est. |
|---|---|---|---|
| EPIC-10-01 | Agregar Capacitor al proyecto (`npx cap init`, `npx cap add android`) | 🟡 | 1 |
| EPIC-10-02 | Build y correr en emulador/dispositivo Android | 🟡 | 1 |
| EPIC-10-03 | Revisar que el login con Firebase Auth (email/password) funcione correctamente en el contexto nativo (WebView) | 🟡 | 1 |
| EPIC-10-04 | (Opcional) notificaciones locales para recordar repasos FSRS pendientes | 🟢 | 2 |

## EPIC-02 — Gamificación
_Objetivo: XP, rachas, logros — la razón principal por la que quieres reforzar la arquitectura ahora, antes de que esto crezca sin orden._

| ID | Historia | Prioridad | Est. |
|---|---|---|---|
| EPIC-02-01 | Diseñar modelo de XP/niveles (¿qué acción da cuánto XP?) — documentar en ADR | 🔴 | 1 |
| EPIC-02-02 | Contexto/hook `useGamification` que reacciona a resultados de ejercicios (vía `ProgressRepository`) | 🔴 | 2 |
| EPIC-02-03 | Sistema de logros/badges (ej: "7 días seguidos", "primera lección de italiano completa") | 🟡 | 3 |
| EPIC-02-04 | Componente UI: barra de XP + notificación de logro desbloqueado | 🟡 | 2 |
| EPIC-02-05 | Rachas diarias | 🟢 | 1 |

## EPIC-03 — Contenido teórico integrado
_Objetivo: mini-lecciones antes/durante los ejercicios, no solo práctica mecánica. Se apoya en el modelo de EPIC-08._

| ID | Historia | Prioridad | Est. |
|---|---|---|---|
| EPIC-03-01 | Definir formato de "mini-lección" (markdown/MDX + ejemplos) dentro de `content/courses/<curso>/lessons/` | 🔴 | 1 |
| EPIC-03-02 | Componente UI "Lección" que se muestra antes de desbloquear un ejercicio | 🟡 | 2 |
| EPIC-03-03 | Vincular lección → ejercicio → quiz de cierre (ciclo teoría→práctica) | 🟢 | 3 |

## EPIC-05 — Calidad y automatización
| ID | Historia | Prioridad | Est. |
|---|---|---|---|
| EPIC-05-01 | ESLint + Prettier (config recomendada de Vite+React) | 🟡 | 1 |
| EPIC-05-02 | Vitest + React Testing Library — tests de `core/fsrs`, `ProgressRepository` y un hook de ejercicio | 🟡 | 2 |
| EPIC-05-03 | GitHub Action: lint + test en cada push/PR | 🟢 | 1 |

## EPIC-06 — UX y accesibilidad
| ID | Historia | Prioridad | Est. |
|---|---|---|---|
| EPIC-06-01 | Auditoría rápida de accesibilidad (contraste, `aria-label`, foco de teclado) | 🟢 | 2 |
| EPIC-06-02 | Revisión responsive en móvil real (no solo devtools) | 🟢 | 1 |

---
> Regla simple: cuando una historia se mueve a "In Progress" en el [KANBAN](./KANBAN.md), se le agrega una rama `feature/EPIC-XX-YY-slug`.

> Gestión del tablero: por ahora seguimos en markdown (`KANBAN.md`). Cuando definas tu formato para GitHub Projects, lo migramos.