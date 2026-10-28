# Servidor de voz Kokoro (solo desarrollo local)

Las voces del navegador en Linux suelen faltar o sonar robóticas. Este servidor usa
tu instalación de Kokoro (`/opt/kokoro-tts`) y devuelve audio WAV por HTTP.

```bash
/opt/kokoro-tts/venv/bin/python3 tools/kokoro-server/server.py
```

- Escucha solo en `127.0.0.1:8787`. La app (`npm run dev`) lo detecta sola.
- Si no está corriendo, la app usa las voces del navegador.
- Otro puerto o servidor: `VITE_TTS_URL=http://127.0.0.1:9000 npm run dev`.
- Voces por idioma: ver `VOICE_FOR` en `server.py` (inglés `af_heart`, italiano `if_sara`, español `ef_dora`).
- En producción (Vercel) y en el móvil no hay servidor: allí se usan las voces del dispositivo.
