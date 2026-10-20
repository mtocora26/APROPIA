# Flujo de trabajo — APROPIA

Guía corta para trabajar este proyecto como un proceso de ingeniería real, adaptado a un side-project part-time.

## Ramas
- `main`: siempre desplegable/funcional.
- `feature/EPIC-XX-YY-slug-corto`: una historia del backlog → una rama.
- `fix/descripcion-corta`: bug que no está en el backlog.
- `docs/descripcion-corta`: solo documentación.

## Commits — [Conventional Commits](https://www.conventionalcommits.org/)
Formato: `tipo(scope): descripción corta en imperativo`

Tipos usados en este repo:
- `feat`: nueva funcionalidad visible para el usuario
- `fix`: corrección de bug
- `refactor`: cambio de estructura interna sin cambiar comportamiento
- `docs`: cambios solo en documentación
- `chore`: tareas de mantenimiento (config, dependencias)
- `test`: agregar o corregir pruebas

Ejemplos:
```
feat(gamification): agregar barra de XP en dashboard
refactor(core): extraer StorageRepository desde app.js
docs(arquitectura): documentar ADR-0001
```

## Definition of Ready (antes de mover una historia a "In Progress")
- [ ] La historia tiene un criterio de éxito claro (¿cómo sé que terminé?)
- [ ] No depende de otra historia sin terminar

## Definition of Done
Ver checklist completo en [KANBAN.md](../02-producto/KANBAN.md#definition-of-done).

## Ciclo por historia (mini-SDLC)
1. **Elegir** 1 historia de "Ready" en el kanban → moverla a "In Progress"
2. **Diseñar** brevemente si toca una decisión estructural → ADR si aplica
3. **Implementar** en su rama
4. **Auto-revisar** con la Definition of Done
5. **Mergear** a `main` (squash merge recomendado, commit final con formato Conventional Commits)
6. **Retro de 2 minutos**: ¿qué aprendí?, ¿qué anoto en `docs/`? — si aplica, actualiza `ARQUITECTURA.md` o crea un ADR
