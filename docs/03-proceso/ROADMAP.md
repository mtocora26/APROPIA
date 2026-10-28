# Roadmap — APROPIA

Fases pensadas para avance **incremental y sostenible**, compatible con poco tiempo disponible y en paralelo a tus cursos de italiano e inglés de negocios. No son sprints con fecha fija — son un orden lógico de dependencias.

> **Actualizado 2026-09-22** tras decidir migrar a React y adoptar Firebase + Capacitor de forma progresiva (para uso real en celular). Ver [ADR-0002](../01-arquitectura/decisiones/ADR-0002-adopcion-react-vite.md) y [ADR-0004](../01-arquitectura/decisiones/ADR-0004-firebase-y-capacitor.md) (supera a ADR-0003). Contenido viejo archivado en `/legacy`.

## Fase 0 — Fundación de proceso ✅ (hecho)
- Documentar arquitectura, backlog, kanban y flujo de trabajo
- Decidir stack (React + Vite + Firebase + Capacitor) y archivar contenido viejo

## Fase 1 — Base técnica en React, local-first (EPIC-07)
_Meta: esqueleto de la app funcionando con los patrones clave, usando `LocalStorageRepository` — aprender React sin la complejidad de red todavía._
- Scaffold Vite+React, `ProgressRepository`/`LocalStorageRepository`, contrato de hook de ejercicio, `ExerciseContainer` genérico
- Criterio de salida: puedes crear un ejercicio "de prueba" y su progreso se guarda vía el Repository, 100% local.

## Fase 1.5 — Tutorías multiusuario local (EPIC-11, 07-04, 12, 13)
_Meta: usar APROPIA en clase con varios estudiantes, sin login ni base de datos (ADR-0006). Orden: estudiantes → FSRS → flashcards → recap/sesiones → ejercicios creativos._
- Criterio de salida: eliges estudiante, haces el recap de inicio de clase con sus tarjetas vencidas y registras la tutoría.

## Fase 2 — Firebase (EPIC-09) ⏸️ diferida
_Meta: el mismo contrato `ProgressRepository`, ahora respaldado por Firestore — demostración práctica de por qué se diseñó la interfaz desde el Paso A._
- Proyecto Firebase, Auth email/password (cuenta única), reglas de seguridad (obligatorias), `FirebaseRepository`, manejo de estados async en la UI
- Criterio de salida: cierras la app, la abres en otro navegador/perfil, y tu progreso sigue ahí (mismo `uid`).

## Fase 3 — Primer curso real de contenido (EPIC-08)
_Meta: validar el modelo `Course/Lesson/Exercise` con contenido de verdad._
- Modelar `domain/Course`, `Lesson`, `Exercise`
- Cargar 2-3 lecciones piloto de **Business English** y de **Italiano**
- Selector de curso en el dashboard
- Criterio de salida: puedes practicar una lección real de cada idioma, con progreso sincronizado por Firebase.

## Fase 4 — Empaquetado nativo (EPIC-10)
_Meta: instalar la app en tu celular de verdad, no solo abrirla en el navegador móvil._
- Capacitor + build Android, verificar que el login con Firebase Auth funcione bien en el WebView nativo
- Criterio de salida: ícono de la app en tu celular, abre y funciona con tu progreso de Firebase.

## Fase 5 — Teoría integrada (EPIC-03)
_Meta: cerrar el ciclo lección → ejercicio → refuerzo, no solo práctica mecánica suelta._
- Formato de mini-lección, componente de lección, flujo lección→ejercicio→quiz

## Fase 6 — Gamificación (EPIC-02)
_Meta: XP/logros construidos sobre el Repository/estado de React._
- Modelo de XP, `useGamification`, badges, barra de XP visible

## Fase 7 — Calidad y hábito de ingeniería (EPIC-05)
_Meta: dejar de depender solo de prueba manual, ahora que hay módulos aislados y testeables (hooks puros, Repository con doble implementación real para comparar en tests)._
- ESLint/Prettier, Vitest + RTL, GitHub Action de lint+test

## Fase 8 — Pulido (EPIC-06) y más contenido
- Accesibilidad, responsive real, más lecciones/cursos según avances en tus clases
- Reevaluar si hace falta login real (no anónimo) si compartes la app con alguien más

---
## Cómo usar este roadmap
1. Trabaja **una fase a la vez** — la Fase 2 (Firebase) depende de que la Fase 1 (Repository bien diseñado) esté sólida, o vuelves a acoplar todo.
2. Cada vez que termines una historia, muévela en el [KANBAN](../02-producto/KANBAN.md) y márcala en el [BACKLOG](../02-producto/BACKLOG.md).
3. Si tomas una decisión estructural, escribe un ADR corto — no hace falta perfección, 10 minutos bastan.


