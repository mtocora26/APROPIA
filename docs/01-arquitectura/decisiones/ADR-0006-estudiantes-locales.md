# ADR-0006: Multiusuario local por estudiante, sin login ni backend (por ahora)

- **Fecha**: 2026-10-20
- **Estado**: Aceptada
- **Relacionada con**: [ADR-0004](./ADR-0004-firebase-y-capacitor.md) (Firebase queda **diferido**, no descartado)

## Contexto
APROPIA pasa de ser solo una herramienta de estudio personal a usarse **durante tutorías**: el tutor elige con qué estudiante está y cada uno tiene su propio avance (lecciones, flashcards, recap). No hay login para estudiantes: solo el tutor abre la app. No hay tiempo ahora para configurar y operar una base de datos.

## Decisión
- **Estudiante** = `{ id, name, createdAt }`. La lista y el estudiante activo se guardan en `localStorage` (`apropia.students`) vía `StudentRepository`.
- **Progreso por estudiante**: cada estudiante tiene su propio `LocalStorageRepository` con clave `apropia.progress.<id>`. El estudiante por defecto (`yo`) usa la clave histórica `apropia.progress`, así el progreso existente queda asignado sin migrar datos.
- **Cambio de estudiante**: la app monta el contenido bajo `key={studentId}`; todos los hooks recargan desde el repositorio del nuevo estudiante. Los componentes obtienen el repositorio del contexto (`useProgressRepository`), no de un singleton.
- **Respaldo**: sin base de datos, el navegador es el único almacén; borrar los datos del sitio borra a todos los estudiantes. Se agrega exportar/importar un JSON con todas las claves `apropia.*`.
- **Firebase**: se difiere. Si más adelante hace falta usar varios dispositivos, el plan de ADR-0004 sigue vigente con una cuenta del tutor y datos bajo `students/{id}/...`; solo cambia el *composition root*.

## Alternativas consideradas
- *Login por estudiante*: descartado, complica la tutoría sin aportar (los estudiantes no abren la app).
- *Un solo documento con todos los estudiantes*: más simple de exportar, pero cada guardado reescribe los datos de todos y se rompe el contrato por curso del `ProgressRepository`.
- *Migrar el progreso actual a una clave nueva*: innecesario con la regla del estudiante por defecto.

## Consecuencias
- ✅ Cero infraestructura, y el contrato `ProgressRepository` no cambia.
- ✅ Todo lo que se construya después (FSRS, flashcards, recap) puede guardarse por estudiante con la misma técnica.
- ⚠️ Los datos viven en un solo navegador/dispositivo; el respaldo JSON es responsabilidad del tutor.
- ⚠️ Sin autenticación: cualquiera con acceso al navegador ve a todos los estudiantes (aceptado, uso personal).

## Nota: renombre a APROPIA (2026-10-20)
La plataforma pasó de llamarse Tukola a APROPIA. Las claves `tukola.*` de `localStorage` se renombran a `apropia.*` con una migración única al arrancar (`core/storage/legacyKeys.js`, que no pisa datos ya existentes), y los respaldos JSON viejos siguen pudiéndose importar.
