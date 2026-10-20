# Kanban — Tukola

Tablero simple en markdown. Muévete de columna editando este archivo (o migra a GitHub Projects cuando quieras algo visual — ver nota al final).

**WIP limit sugerido: máx. 1 tarjeta en "In Progress"** — tienes poco tiempo, terminar > empezar muchas cosas.

## 📋 Backlog
> Todo lo que vive en [BACKLOG.md](./BACKLOG.md) y no está priorizado para ahora.

## ✅ Ready (próximas 1-2 semanas)

## 🔨 In Progress
- [ ] EPIC-11-01 — Estudiantes locales (#22) — rama `feature/EPIC-11-01-estudiantes-locales`
- [ ] EPIC-07-04 — FSRS como módulo ES puro (#7) — rama `feature/EPIC-07-04-fsrs`
- [ ] EPIC-12-01 — Flashcards con FSRS por estudiante (#23) — rama `feature/EPIC-12-01-flashcards`
- [ ] EPIC-12-02 — Recap de inicio de clase y sesiones de tutoría (#24) — rama `feature/EPIC-12-02-recap-sesiones`
- [ ] EPIC-13-01 — Ejercicios creativos y modo clase (#25) — rama `feature/EPIC-13-01-ejercicios-creativos`

## 👀 Review (autorevisión antes de mergear)
- [ ] EPIC-07-05 — `ExerciseContainer` genérico (#6) — rama `feature/EPIC-07-05-exercise-container`
- [ ] EPIC-08-01 — Modelo Course/Module/Lesson/Exercise + módulo 1 de italiano — rama `feature/EPIC-08-01-modelo-curso`
- [ ] EPIC-08 — Tipos de ejercicio choice/typed/reorder/match/spelling — rama `feature/EPIC-08-tipos-ejercicio`
- [ ] EPIC-07-06 — Reducer de sesión (#5) + reproductor de lección (teoría, repaso, estrellas, XP) — rama `feature/EPIC-07-06-sesion-y-reproductor`
- [ ] EPIC-08-04 — Mapa del curso con desbloqueo, estrellas, XP y repaso de módulo — rama `feature/EPIC-08-04-mapa-curso`
- [ ] EPIC-02-01/02/04/05 — XP total y niveles, racha diaria, audio TTS (ADR-0005) — rama `feature/EPIC-02-audio-racha-niveles`

## 🎉 Done
- [x] EPIC-07-03 — Contrato de hook de ejercicio `useExercise` (PR #11) — 2026-09-23
- [x] EPIC-07-02 — ProgressRepository / LocalStorageRepository (PR #10) — 2026-09-23
- [x] EPIC-07-01 — Scaffold Vite + React + Router (PR #2) — 2026-09-23
- [x] Definir estructura de documentación (arquitectura, backlog, roadmap) — 2026-09-22
- [x] Decidir stack: React + Vite, Firebase (Firestore + Auth email/password), Capacitor, contenido viejo archivado — 2026-09-22

---
### Nota (2026-09-22)
Seguimos con este tablero en markdown por ahora. Cuando definas tu propio formato de GitHub Projects, lo migramos manteniendo el historial de "Done" como referencia.

---
### Definition of Done (checklist antes de mover algo a Done)
- [ ] Código en rama `feature/...`, mergeado a `main`
- [ ] Sin `console.log` de debug olvidados
- [ ] Probado manualmente en el navegador (flujo feliz + 1 caso raro)
- [ ] README/docs actualizados si cambió algo visible para el usuario o la arquitectura
- [ ] Commit(s) siguen [Conventional Commits](../03-proceso/CONTRIBUTING.md#commits)

### Nota sobre herramientas
Este archivo es suficiente mientras trabajas solo. Si más adelante quieres un tablero visual con drag&drop (arrastrar tarjetas), usa **GitHub Projects** (gratis, vinculado a Issues de este mismo repo) y deja este archivo como historial/resumen.
