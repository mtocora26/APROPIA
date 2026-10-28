# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Estudiantes universitarios (inicialmente de ingeniería) que ya tienen materiales: apuntes, guías, presentaciones. Usan la plataforma en computador y celular, muchas veces de noche.
- Mentores y tutores del programa de mentoría de la universidad, que acompañan al estudiante y ven el registro de sus tutorías.
- Público general que quiere aprender fuera de la universidad (por ejemplo, el curso de inglés).

## Product Purpose
Plataforma educativa que usa inteligencia artificial para acompañar al estudiante en una ruta de aprendizaje personalizada. Organiza y adapta el contenido, genera guías de estudio, actividades y ejercicios, y evalúa la comprensión para detectar dificultades y orientar el proceso. El éxito es que el estudiante comprenda, no solo que responda bien.

## Positioning
Muchas herramientas de IA se enfocan en generar respuestas, resúmenes o contenido. Apropia mide el aprendizaje, no solo la capacidad de responder bien. Combina estudio, comprensión activa, práctica y evaluación, y se adapta a las dificultades que detecta.

## Operating Context
- Se presenta en la feria de emprendimiento de la universidad y se usará en el programa de mentoría.
- Es un MVP que crece poco a poco. Por ahora el contenido de los cursos lo carga el autor a mano; la IA lo generará y adaptará más adelante.
- La interfaz está en español; el contenido de un curso puede estar en otro idioma donde corresponda (por ejemplo, inglés).

## Capabilities and Constraints
- Ya existen: ruta de aprendizaje por curso con módulos y estados, lecciones y modo clase, ejercicios creativos (abiertos y de diálogo), flashcards de verbos con repaso espaciado (FSRS) por estudiante, recap de inicio de clase y registro de tutorías, y el curso de tiempos verbales en inglés.
- Pendiente de decidir: cuándo y cómo la IA genera rutas desde los materiales propios del estudiante.
- Todo texto de la interfaz en español.

## Brand Commitments
- Nombre: APROPIA (renombrada desde el nombre anterior en el commit 240ce87).
- Voz: hablar de «tú», directo, sin adornos. Verbos de acción («Sube tus materiales», «Marca lo que no entiendas»). Sin emojis ni exclamaciones de celebración. Habla de comprender, no de acertar: «Reforzar» para lo que falta y «Dominio» para lo logrado.
- Evitar: que parezca una plantilla de IA (degradados azul-morado, tarjetas anidadas, fuentes sobreusadas); estética cyber de película (lluvia de código, glitch): lo técnico sirve para mostrar datos y progreso, no para decorar.

## Evidence on Hand
- Contenido real del curso de inglés en `src/content/courses/english-tenses/`.
- No hay testimonios, clientes ni métricas de uso; no inventarlos.

## Product Principles
- Medir comprensión, no solo respuestas correctas.
- El estudiante parte de sus propios materiales y de su propio ritmo.
- Mostrar el progreso como datos claros, no como decoración.
- Crecer por capas: contenido curado primero, IA después, sin prometer lo que aún no existe.

## Accessibility & Inclusion
- Los estados de aprendizaje deben entenderse con palabra y forma además del color.
- Contraste de texto de 4.5:1 como mínimo.
- Uso frecuente en celular y de noche.
