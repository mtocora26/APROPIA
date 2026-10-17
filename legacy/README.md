# Legacy (archivado)

Este es el código original del proyecto (vanilla JS, sin build tool): verbos irregulares, flashcards, FSRS, Context Hunt y simulacro ICFES.

Se archiva aquí el **2026-09-22** tras decidir migrar a React y cambiar el contenido hacia italiano + inglés de negocios (ver [ADR-0002](../docs/01-arquitectura/decisiones/ADR-0002-adopcion-react-vite.md)).

- No se sigue desarrollando.
- Se mantiene como referencia (ej. el motor FSRS en `assets/js/fsrs.js` se portará a la nueva app).
- El contenido de Past Simple y Past Continuous (verbos, oraciones, lecturas) ya se migró a `src/content/courses/english-tenses/`. Pendiente por portar: Context Hunt, ICFES y FSRS.
- Para abrirlo: `legacy/index.html` directamente en el navegador (sigue funcionando igual que antes, no depende de build tool).

## Agregar nuevas preguntas al simulacro ICFES

Para evitar editar el archivo grande de logica, agrega preguntas en `assets/js/icfes.questionBank.js`.

### Opciones para agregar preguntas

1. Lista plana global en `window.ICFES_EXTRA_QUESTIONS`.
2. Listas separadas por parte en `window.ICFES_EXTRA_QUESTIONS_BY_PART`.

### Estructura minima de una pregunta

```js
{
	part: 1,
	id: 101,
	questionText: "¿Dónde verías este aviso?",
	options: ["Airport", "Restaurant", "Hospital", "Library"],
	correctIndex: 0,
	tema: "Vocabulary in Context",
	nivel: "A2",
	retroalimentacion: "La palabra 'Passengers' indica contexto de aeropuerto."
}
```

### Campos opcionales

- `quote`
- `blockId`
- `blockTitle`
- `situationId`
- `situationTitle`
- `partTitle`
- `partDesc`

Si no envias `partTitle` o `partDesc`, se rellenan automaticamente usando la configuracion de la parte.

### Logica de bloques por parte

- La app trabaja por bloques de preguntas dentro de cada parte.
- Si defines `blockId` y `blockTitle`, esas preguntas quedan en ese bloque.
- Si no defines bloques y una parte tiene muchas preguntas, el sistema la divide automaticamente en bloques para evitar pruebas demasiado largas.
- `situationId` y `situationTitle` siguen siendo compatibles para contenido antiguo.
