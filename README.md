# APROPIA — Plataforma de aprendizaje personalizado

Proyecto personal de aprendizaje de idiomas (italiano + inglés de negocios), construido como ejercicio deliberado de ingeniería de software: arquitectura, patrones de diseño, backlog y kanban — no solo "vibe coding".

> 🔄 **En migración a React** (Vite, sin backend por ahora). El código original en vanilla JS (verbos irregulares, ICFES, Context Hunt) quedó archivado en [`/legacy`](./legacy/README.md) como referencia.

## 📚 Documentación de arquitectura y proceso

- [Arquitectura actual y objetivo](./docs/01-arquitectura/ARQUITECTURA.md)
- [Decisiones de arquitectura (ADRs)](./docs/01-arquitectura/decisiones/)
- [Backlog por épicas](./docs/02-producto/BACKLOG.md)
- [Tablero Kanban](./docs/02-producto/KANBAN.md)
- [Roadmap por fases](./docs/03-proceso/ROADMAP.md)
- [Flujo de trabajo (ramas, commits, Definition of Done)](./docs/03-proceso/CONTRIBUTING.md)

## Desarrollo (React + Vite)

Requisitos: Node.js LTS instalado.

```bash
npm install       # instalar dependencias
npm run dev       # levantar servidor de desarrollo (http://localhost:5173)
npm run build     # generar build de producción en /dist
npm run lint      # correr ESLint
npm test          # correr pruebas automatizadas
```

## Persistencia local de progreso

En el selector de perfiles, **Tutor (admin)** puede abrir cualquier lección de
cualquier curso sin completar las anteriores. Su progreso se guarda por separado
del de los estudiantes. Es un perfil local de navegación, no una cuenta con
contraseña: la aplicación aún no tiene autenticación ni control de acceso seguro.
Los perfiles existentes reciben esta opción automáticamente sin perder su avance.

El código de aplicación consume el contrato asíncrono
`src/core/storage/ProgressRepository.js`. La implementación inicial,
`LocalStorageRepository`, guarda un documento versionado bajo la clave
`apropia.progress`:

```js
{
  version: 1,
  courses: {
    "italian-a1": {
      courseId: "italian-a1",
      exercises: {
        "essere-1": {
          exerciseId: "essere-1",
          status: "completed", // not_started | in_progress | completed
          score: 100,
          attempts: 1,
          updatedAt: "2026-09-23T02:43:00.000Z",
          completedAt: "2026-09-23T02:43:00.000Z"
        }
      },
      updatedAt: "2026-09-23T02:45:00.000Z"
    }
  }
}
```

Una lectura sin datos devuelve un progreso vacío. Los datos inválidos o de
una versión desconocida producen un error explícito y no se eliminan
automáticamente. El contrato usa promesas para que una futura implementación
con Firebase pueda sustituir el almacenamiento local sin cambiar sus
consumidores.

Para validar la persistencia manualmente en el navegador, crea una instancia
de `LocalStorageRepository`, llama a `saveProgress`, recarga la página y
consulta el mismo curso con `getProgress`. Las pruebas automatizadas cubren
este flujo creando una segunda instancia conectada al mismo almacenamiento.

## Ejercicios

Todo ejercicio usa el hook `useExercise` (`src/hooks/useExercise.js`), que
devuelve siempre la misma forma `{ state, answer, next, start, stats }`.
Por dentro usa la máquina de estados de sesión
(`src/core/session/studySession.js`): `idle → active → reviewing → done`.
Con `reviewMistakes: true`, los ítems fallados se repiten al final hasta
acertarlos; la puntuación solo cuenta la primera pasada.
`ExerciseContainer` (`src/features/exercises/`) pinta el flujo común
(progreso, feedback, siguiente, resumen final) para cualquier ejercicio que
cumpla ese contrato. Cada tipo de ejercicio solo aporta:

- `renderPrompt(item)`: cómo se muestra el ítem.
- `renderAnswer({ item, onAnswer, disabled })`: cómo se responde (por ejemplo
  `TextAnswerInput`).
- `renderFeedback({ item, answer, result })` (opcional): feedback específico,
  como la respuesta esperada.

`useExerciseProgress` guarda un intento al completar el ejercicio a través de
`ProgressRepository`. La instancia concreta se crea solo en
`src/app/progressRepository.js`. Hay un ejemplo completo en `/practica/demo`
(`src/features/exercises/demo/`).

## Cursos y lecciones

El contenido vive en `src/content/courses/<curso>/` y sigue el modelo de
`src/domain/course.js` (curso → módulos → lecciones → teoría + ejercicios).
Tipos de ejercicio: `choice`, `typed`, `reorder`, `match` y `spelling`. Un test
valida todo el contenido, así que un error de datos falla en `npm test` con la
ruta exacta del campo.

Para agregar un tipo de ejercicio: su lógica (preparar, corregir, respuesta
correcta) va en `src/features/exercises/types/exerciseLogic.js` y su
componente se registra en `answerComponents.js`.

Cada lección (`/curso/:courseId/leccion/:lessonId`) muestra la teoría, luego
los ejercicios, un repaso de errores y el resultado con estrellas y XP
(reglas en `src/core/gamification/scoring.js`).

El mapa del curso (`/curso/:courseId`) muestra las lecciones en orden, con
estrellas, XP total y candados: cada lección se desbloquea al completar la
anterior. Los módulos con 2 o más lecciones terminan con un "Repaso del
módulo" generado automáticamente (10 ejercicios al azar de todo el módulo).
La lógica está en `src/features/course/courseMap.js`.

## Gamificación y audio

- **XP y niveles**: el XP de cada lección se acumula en su registro; el nivel
  se calcula del total (nivel n desde 100 · (1 + … + (n−1)) XP).
- **Racha diaria**: días seguidos con al menos una lección terminada, guardados
  en `activityDays` del progreso de cada curso.
- **Audio 🔊**: los ejemplos de teoría y las respuestas se pueden escuchar con la
  voz del navegador (`speechSynthesis`).

Reglas en `src/core/gamification/`; decisiones en
[ADR-0005](./docs/01-arquitectura/decisiones/ADR-0005-gamificacion-local-y-audio.md).

## Código archivado (`/legacy`)

La versión anterior (vanilla JS) sigue funcionando abriendo [`legacy/index.html`](./legacy/index.html) directamente en el navegador. Ver [`legacy/README.md`](./legacy/README.md) para instrucciones (incluye cómo agregar preguntas al simulacro ICFES, si algún día se retoma).
