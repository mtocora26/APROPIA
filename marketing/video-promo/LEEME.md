# Video promo de Apropia

- `apropia-promo-stand-16x9.mp4`: pantalla del stand, 41 s, sin sonido, en loop.
- `apropia-promo-redes-9x16.mp4`: redes y estados de WhatsApp, 27 s. La música se agrega en la app (Reels, TikTok o CapCut).

## Volver a exportar (por ejemplo, con el QR)

Hace falta Node con `playwright`, `qrcode`, `@fontsource/chakra-petch` y `@fontsource/barlow`, además de ffmpeg.

    npm i playwright qrcode @fontsource/chakra-petch @fontsource/barlow
    node render.js video 0 apropia-promo-stand-16x9.mp4 https://TU-DOMINIO/feria
    node render.js video 1 apropia-promo-redes-9x16.mp4 https://TU-DOMINIO/feria

Si no pasas una URL, el cierre del stand dice "Pruébala aquí, en el stand." y el de redes queda solo con el logo y el eslogan.
Los tiempos de cada escena están en `promo.html` (constantes `H` y `V`).

## Video explicativo

- `apropia-explicativo-16x9.mp4`: 1 min 57 s, cuatro capítulos (la idea, factor diferencial, ODS, equipo).
- Volver a exportar: `PAGE=explicativo.html node render.js video 0 apropia-explicativo-16x9.mp4`
