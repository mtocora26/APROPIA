/**
 * Text-to-speech. Tries a local Kokoro server first (tools/kokoro-server: natural
 * voices, dev machine only), then the browser's Web Speech API (free, no audio
 * files). Note: Android WebView (Capacitor, EPIC-10) does not implement the
 * latter; there this module is the seam to swap in a native TTS plugin.
 */
const SPEECH_LANGS = Object.freeze({ it: 'it-IT', en: 'en-US', es: 'es-ES' })

/** Maps a course language ("it") to a BCP 47 voice language ("it-IT"). */
export function speechLang(language) {
  return SPEECH_LANGS[language] ?? language
}

/** Removes what should not be read aloud: blanks, arrows, separators. */
export function cleanSpeechText(text) {
  return String(text)
    .replace(/_{2,}/g, ' ')
    .replace(/\s[–→·/]\s/g, ', ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isSpeechSupported() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'
  )
}

const VOICES_TIMEOUT_MS = 1500
const START_TIMEOUT_MS = 2500

// Chrome drops an utterance that is garbage-collected while it is still speaking.
const active = new Set()

function voiceMatches(voice, prefix) {
  return voice.lang.replace('_', '-').toLowerCase().startsWith(prefix)
}

/** Browsers load voices asynchronously: the first getVoices() is often empty. */
function loadVoices(synth) {
  const ready = synth.getVoices()
  if (ready.length > 0) return Promise.resolve(ready)

  return new Promise((resolve) => {
    const finish = () => {
      synth.removeEventListener?.('voiceschanged', finish)
      clearTimeout(timer)
      resolve(synth.getVoices())
    }
    const timer = setTimeout(finish, VOICES_TIMEOUT_MS)
    synth.addEventListener?.('voiceschanged', finish)
  })
}

const env = import.meta.env
// Set VITE_TTS_URL to point at another server; in dev the local Kokoro server is assumed.
const TTS_URL = env?.VITE_TTS_URL ?? (env?.DEV ? 'http://127.0.0.1:8787' : null)
const TTS_TIMEOUT_MS = 8000
const TTS_RETRY_AFTER_MS = 30000

/** Whether some speech engine may be available (the local server or the browser's). */
export function isSpeechAvailable() {
  return Boolean(TTS_URL) || isSpeechSupported()
}

const audioCache = new Map() // "lang|text" -> object URL of the audio
let player = null
let serverDownUntil = 0

/** @returns {Promise<boolean>} whether the local server spoke */
async function speakWithServer(text, lang) {
  if (!TTS_URL || typeof Audio === 'undefined' || Date.now() < serverDownUntil) return false

  const spoken = cleanSpeechText(text)
  const key = `${lang}|${spoken}`

  try {
    if (!audioCache.has(key)) {
      const response = await fetch(`${TTS_URL}/tts?${new URLSearchParams({ text: spoken, lang })}`, {
        signal: AbortSignal.timeout(TTS_TIMEOUT_MS),
      })
      if (!response.ok) throw new Error(`TTS server answered ${response.status}`)
      audioCache.set(key, URL.createObjectURL(await response.blob()))
    }

    player?.pause()
    if (isSpeechSupported()) window.speechSynthesis.cancel()
    player = new Audio(audioCache.get(key))
    await player.play()
    return true
  } catch {
    serverDownUntil = Date.now() + TTS_RETRY_AFTER_MS
    return false
  }
}

/**
 * Reads `text` aloud.
 * @returns {Promise<{ ok: true } | { ok: false, reason: 'unsupported' | 'no-voice' | 'failed' }>}
 *   `no-voice`: the device has no voice for that language installed.
 */
export async function speak(text, lang) {
  if (await speakWithServer(text, lang)) return { ok: true }
  return speakWithBrowser(text, lang)
}

async function speakWithBrowser(text, lang) {
  if (!isSpeechSupported()) return { ok: false, reason: 'unsupported' }

  const synth = window.speechSynthesis
  const prefix = lang.slice(0, 2).toLowerCase()
  const voices = await loadVoices(synth)
  const voice = voices.find((item) => voiceMatches(item, prefix))

  // Without a voice for this language the browser stays silent or uses the wrong accent.
  if (!voice) return { ok: false, reason: 'no-voice' }

  const utterance = new window.SpeechSynthesisUtterance(cleanSpeechText(text))
  utterance.lang = voice.lang
  utterance.voice = voice
  utterance.rate = 0.9
  active.add(utterance)
  utterance.onend = () => active.delete(utterance)

  // A new tap interrupts the previous phrase.
  if (synth.speaking || synth.pending) synth.cancel()
  if (synth.paused) synth.resume()

  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve({ ok: false, reason: 'failed' }), START_TIMEOUT_MS)
    utterance.onstart = () => {
      clearTimeout(timer)
      resolve({ ok: true })
    }
    utterance.onerror = (event) => {
      clearTimeout(timer)
      active.delete(utterance)
      // Being interrupted by the next tap is not a failure.
      resolve(
        event.error === 'interrupted' || event.error === 'canceled'
          ? { ok: true }
          : { ok: false, reason: 'failed' },
      )
    }
    synth.speak(utterance)
  })
}

/** User-facing explanation for a failed `speak`. */
export function speechProblemMessage(reason, lang) {
  if (reason === 'no-voice') {
    return `Este dispositivo no tiene una voz instalada para «${lang}». Instala una en la configuración de voz del sistema o del navegador.`
  }
  if (reason === 'unsupported') return 'Este navegador no puede leer en voz alta.'
  return 'No se pudo reproducir el audio. Intenta de nuevo.'
}
