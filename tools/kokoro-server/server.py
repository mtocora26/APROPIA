#!/opt/kokoro-tts/venv/bin/python3
"""
Servidor local de voz para APROPIA: devuelve audio WAV generado con Kokoro.

    GET http://127.0.0.1:8787/tts?text=Hello&lang=en-US   ->  audio/wav

Solo escucha en 127.0.0.1. La app lo prueba primero y, si no responde, usa las
voces del navegador. Ver tools/kokoro-server/README.md.
"""
import io
import threading
from collections import OrderedDict
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

import soundfile as sf
from kokoro_onnx import Kokoro

HOST, PORT = "127.0.0.1", 8787
MODEL = "/opt/kokoro-tts/models/kokoro-v1.0.onnx"
VOICES = "/opt/kokoro-tts/models/voices.bin"
MAX_TEXT = 400
CACHE_SIZE = 200

# BCP 47 language of the course -> (Kokoro voice, Kokoro language code)
VOICE_FOR = {
    "en": ("af_heart", "en-us"),
    "it": ("if_sara", "it"),
    "es": ("ef_dora", "es"),
}

kokoro = Kokoro(MODEL, VOICES)
lock = threading.Lock()  # one synthesis at a time
cache = OrderedDict()  # (text, lang) -> wav bytes


def synthesize(text, lang):
    key = (text, lang)
    if key in cache:
        cache.move_to_end(key)
        return cache[key]

    voice, code = VOICE_FOR.get(lang[:2].lower(), VOICE_FOR["en"])
    with lock:
        samples, rate = kokoro.create(text, voice=voice, speed=0.95, lang=code)
    buffer = io.BytesIO()
    sf.write(buffer, samples, rate, format="WAV")

    cache[key] = buffer.getvalue()
    if len(cache) > CACHE_SIZE:
        cache.popitem(last=False)
    return cache[key]


class Handler(BaseHTTPRequestHandler):
    def _headers(self, status, content_type, length=0):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(length))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def do_GET(self):
        url = urlparse(self.path)
        if url.path == "/health":
            return self._headers(200, "text/plain")

        if url.path != "/tts":
            return self._headers(404, "text/plain")

        query = parse_qs(url.query)
        text = (query.get("text", [""])[0]).strip()[:MAX_TEXT]
        lang = query.get("lang", ["en-US"])[0]
        if not text:
            return self._headers(400, "text/plain")

        try:
            wav = synthesize(text, lang)
        except Exception as error:  # noqa: BLE001 - report to the client, keep serving
            body = str(error).encode()
            self._headers(500, "text/plain", len(body))
            self.wfile.write(body)
            return

        self._headers(200, "audio/wav", len(wav))
        self.wfile.write(wav)

    def log_message(self, fmt, *args):
        print(fmt % args, flush=True)


if __name__ == "__main__":
    print(f"Kokoro listo en http://{HOST}:{PORT}", flush=True)
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
