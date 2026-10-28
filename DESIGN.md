---
name: APROPIA
description: Panel de instrumentos oscuro para estudiar: un solo acento lima que marca lo que importa ahora.
colors:
  graphite: "#0d0f12"
  graphite-panel: "#12161a"
  rule: "#262c33"
  rule-strong: "#5a6570"
  ink: "#eceff1"
  ink-muted: "#8c97a0"
  highlighter: "#c9f31d"
  on-highlighter: "#0d0f12"
  mastery-blue: "#6cc4ff"
  reinforce-orange: "#ff8a4c"
typography:
  display:
    fontFamily: "Chakra Petch, system-ui, sans-serif"
    fontSize: "clamp(32px, 6vw, 56px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Chakra Petch, system-ui, sans-serif"
    fontSize: "clamp(22px, 3.4vw, 28px)"
    fontWeight: 600
    lineHeight: 1.15
  title:
    fontFamily: "Chakra Petch, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "26px"
  label:
    fontFamily: "Chakra Petch, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.18em"
rounded:
  none: "0"
  cut: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.on-highlighter}"
    typography: "{typography.label}"
    rounded: "{rounded.cut}"
    padding: "12px 26px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
    height: "44px"
  panel:
    backgroundColor: "{colors.graphite-panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px 32px"
  field:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
    height: "44px"
---

# Design System: APROPIA

## Overview

**Creative North Star: "El Marcatextos"**

Apropiarse de lo que se estudia, como quien subraya. El acento lima ácida es el marcatextos: marca lo que importa ahora (la palabra clave del título, el paso actual, el estado en proceso). Si todo está resaltado, nada lo está.

La interfaz es oscura y se siente como un panel de instrumentos: técnica, precisa, legible. El estudiante ve su avance como datos (medidores, estados, ruta), no como decoración. Un solo acento, una forma de firma y mucho aire. Se estudia muchas veces de noche, en computador y celular, así que el fondo es grafito casi negro y el texto tiene contraste alto. Los valores exactos están en `tokens.css`; el tablero de referencia está en `reference/hud-board.html`.

**Key Characteristics:**
- Un único acento lima, siempre con texto oscuro encima.
- Filetes de 1px en lugar de sombras; ángulos rectos.
- Estados de aprendizaje con palabra, forma y color.
- Progreso como medidor segmentado, nunca como barra redondeada.

## Colors

Grafito casi negro, un acento lima que se usa poco y dos colores de estado que solo aparecen acompañados de su palabra.

### Primary
- **Marcatextos Lima** (#c9f31d): el único acento. Marca la palabra clave del titular, la fila actual de la ruta, el botón principal y el estado «En proceso». Siempre con `--on-accent` encima. No es fondo grande ni aparece en más de dos o tres elementos por pantalla.

### Secondary
- **Azul Dominio** (#6cc4ff): estado «Dominio» y respuesta correcta, con cuadrado lleno. También es el color del anillo de foco.
- **Naranja Reforzar** (#ff8a4c): estado «Reforzar» y respuesta incorrecta, con triángulo.

### Neutral
- **Grafito** (#0d0f12): fondo de página y texto sobre el acento.
- **Panel Grafito** (#12161a): paneles y tarjetas.
- **Filete** (#262c33): separadores decorativos de 1px y bloques vacíos de medidores.
- **Filete Fuerte** (#5a6570): bordes de controles (3:1 o más sobre el fondo).
- **Tinta** (#eceff1): texto principal.
- **Tinta Apagada** (#8c97a0): texto secundario (6:1 sobre el fondo). No uses grises más oscuros para texto.

### Named Rules
**The One Highlighter Rule.** El acento marca lo que importa ahora; si todo está resaltado, nada lo está. Máximo dos o tres elementos por pantalla.
**The Word Beside The Color Rule.** Un estado nunca se muestra solo con color: lleva su palabra y su forma.

## Typography

**Display Font:** Chakra Petch (con system-ui)
**Body Font:** Barlow (con system-ui)

**Character:** Chakra Petch es angulosa y técnica, para títulos, etiquetas y botones; Barlow es neutra y cómoda para leer. No se mezcla una tercera familia.

### Hierarchy
- **Display** (700, clamp(32px, 6vw, 56px), 1): títulos de página en mayúsculas.
- **Headline** (600, clamp(22px, 3.4vw, 28px), 1.15): títulos de sección y de lección.
- **Title** (600, 20px): nombres de tarjeta y de fila.
- **Body** (400, 16 a 20px, 24 a 28px): texto corrido; medida de 65 a 75 caracteres.
- **Label** (Chakra Petch, 12px, `letter-spacing` 0.18em, mayúsculas): rótulos técnicos y estados.

### Escala de tamaños
Los tamaños fijos salen de variables en `tokens.css`: `--text-xs` 12px, `--text-sm` 14px, `--text-md` 16px, `--text-base` 18px, `--text-lg` 20px, `--text-xl` 24px, `--text-2xl` 28px, `--text-3xl` 36px, `--text-4xl` 40px y `--text-5xl` 64px. Nada por debajo de 12px. Los títulos de página usan `clamp()`: Display y Headline en la app, y un Display de landing de `clamp(44px, 7.4vw, 96px)`; los títulos de sección de la landing van de 32px a 52px. Las pantallas de trabajo (lección, ejercicio, repaso) usan la clase `.page-title`, de tamaño Headline, como único `h1`.

### Named Rules
**The Two Families Rule.** Solo Chakra Petch y Barlow. No uses Inter, Roboto ni Space Grotesk. Única excepción: `--font-mono` para código y datos en respuestas.

## Layout

Escritorio: barra superior con logo y navegación; debajo, columna lateral de 300px con la ruta y la comprensión, y contenido principal a la derecha. Móvil: la columna lateral pasa arriba como lista compacta; no hay menús hamburguesa para la ruta. La app usa una columna de contenido de hasta 880px. Espaciado en múltiplos de 4 (4, 8, 12, 16, 24, 32, 48, 64); entre secciones 48px o más.

## Elevation & Depth

Sin sombras. La profundidad sale de la capa tonal (fondo, panel) y de filetes de 1px. Los únicos elementos que "se levantan" son los paneles destacados, que ganan cuatro marcas de mira en el acento.

### Named Rules
**The Flat-By-Default Rule.** Nada de brillos de neón, desenfoque de vidrio ni sombras decorativas.

## Shapes

Ángulos rectos en todo (`border-radius: 0`). La firma es la esquina cortada de 12px (`.cut-corners`, variable `--cut-shape`) en el botón principal. Solo el panel destacado (`featured`: el foco de la pantalla) lleva cuatro marcas en L de 14px y trazo de 2px en el acento; los demás paneles llevan un filete de 1px. El progreso es un medidor de 10 bloques (3 bloques para estrellas). Los estados usan formas: cuadrado lleno (Dominio y En proceso), triángulo (Reforzar), cuadrado con borde (pendiente).

## Components

Carácter: preciso y directo. Ángulos rectos, una esquina cortada de firma, sin adornos.

### Buttons
- **Shape:** rectángulo con esquina cortada (12px) en el principal; rectángulo recto con borde `--line-strong` en el secundario.
- **Primary:** fondo lima, texto grafito, Chakra Petch 700 en mayúsculas con `letter-spacing` 0.1em, `padding` 12px 26px, alto mínimo 44px.
- **Hover / Focus:** el principal pasa a tinta; el secundario cambia borde y texto al acento. Foco: anillo sólido de 3px en `--focus` con 2px de separación.
- **Disabled:** fondo `--line-strong` con texto grafito.

### Cards / Containers
- **Corner Style:** recto.
- **Background:** `--surface` con borde de 1px.
- **Shadow Strategy:** ninguna.
- **Panel destacado:** mismo fondo más cuatro marcas de mira en el acento.

### Inputs / Fields
- **Style:** borde `--line-strong`, fondo grafito, alto mínimo 44px, sin radio.
- **Focus:** el borde pasa a `--focus` y se suma el anillo global.
- **Error:** borde y texto en naranja Reforzar, con mensaje escrito.

### Navigation
Barra superior con logo y enlaces en Chakra Petch en mayúsculas. La ruta es una lista vertical: bloque lleno (listo), bloque lleno sobre fondo de acento (actual), bloque vacío con borde (pendiente), cada uno con su palabra a la derecha.

### Meter (signature component)
Medidor segmentado de 10 bloques: `--accent` lleno y `--line` vacío, con `role="img"` y texto de lectura.

### Logo
Una «A» hecha con un arco y una barra de marcatextos que lo cruza. Arco en `--ink`, barra en `--accent`. «APROPIA» al lado en Chakra Petch 700, mayúsculas, `letter-spacing` 0.14em.

## Do's and Don'ts

### Do:
- **Do** separar superficies con filetes `--line` de 1px.
- **Do** mostrar cada estado con palabra y forma, no solo color.
- **Do** usar elementos interactivos reales (`button`, `a`) de 44px o más.
- **Do** mantener texto a 4.5:1 o más y bordes de controles en `--line-strong`.

### Don't:
- **Don't** usar degradados, brillos de neón, desenfoque de vidrio ni sombras decorativas.
- **Don't** anidar tarjetas ni hacer cuadrículas de tres tarjetas idénticas con ícono.
- **Don't** usar emojis como íconos; los íconos son de línea, 1.75px de trazo, esquinas rectas.
- **Don't** usar más de un acento.

## Accesibilidad
- Anillo de foco sólido de 3px en `--focus` con 2px de separación, en todo elemento interactivo.
- Con `prefers-reduced-motion` cada componente tiene su alternativa: el sacudón de la respuesta incorrecta pasa a un borde interior; en la landing el estado sigue cambiando, solo sin transición. No hay regla global que anule la animación.
- Enlace «Saltar al contenido» visible con el foco, y un `h1` por pantalla.

## Pendiente de definir
Ilustraciones, estados vacíos y de error, modo claro y revisar la vista de lección en móvil con ejercicios largos.

## Cómo está aplicado en el código
- **Tokens:** `tokens.css` es la fuente; `src/index.css` solo añade `--success` y `--error` como alias de Dominio y Reforzar.
- **Fuentes:** Chakra Petch y Barlow alojadas con `@fontsource` (importadas en `src/app/main.jsx`).
- **Pantallas de trabajo:** en lecciones y repaso de mazo el encabezado se reduce al logo; en móvil el feedback de un ejercicio queda fijo al borde inferior.
- **Resultado de lección:** primero la lectura de comprensión (Dominio o Reforzar), una sola acción lima («Siguiente lección»), y el XP como línea secundaria.
- **Marcatextos:** `MarkLast` resalta la última palabra del título del curso; en inicio se resalta «personalizado».
- **Componentes compartidos:** `src/ui` (`Panel`, `Meter`, `Icon`, `Logo`, `hud.css`).
- **Ruta:** lista vertical por módulo dentro de un `Panel`; la lección actual es la fila resaltada. Estados con `nodeState()` en `courseMap.js`.
- **Respuestas:** correcto = cuadrado azul + «Correcto»; incorrecto = triángulo naranja + «Reforzar».
- **Landing (`/`):** ruta lateral de 5 etapas sticky que se llena al bajar; en móvil, barra compacta. Cada sección dice «Ya funciona» o «Próximamente» y los ejemplos van como «Ejemplo ilustrativo». La app vive en `/inicio`.
