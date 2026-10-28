/**
 * Text-to-speech through the browser's Web Speech API (free, no audio files).
 *
 * Voices come from the browser/OS and load asynchronously; some browsers have
 * none (e.g. Brave as a Linux Flatpak, Android WebView in Capacitor). Callers
 * get an explicit "unavailable" instead of silence, and EPIC-10 can swap this
 * module for a native TTS plugin.
 */
const SPEECH_LANGS = Object.freeze({ it: 'it-IT', en: 'en-US', es: 'es-ES' })

// How long to wait for the browser to report its voices before giving up.
const VOICES_TIMEOUT_MS = 2000

export class SpeechUnavailableError extends Error {
  constructor(lang) {
    super(`No voice available for ${lang}`)
    this.name = 'SpeechUnavailableError'
  }
}

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

/**
 * Best voice for `lang` ("it-IT"): exact language first, then same base
 * language ("it", "it_CH"); plain voices before variants like "Italian+Adam".
 * Returns null when there is none, so we never read Italian with an English voice.
 */
export function pickVoice(voices, lang) {
  const wanted = normalizeLang(lang)
  const base = wanted.split('-')[0]

  const score = (voice) => {
    const voiceLang = normalizeLang(voice.lang)
    if (voiceLang !== wanted && voiceLang.split('-')[0] !== base) return -1
    return (voiceLang === wanted ? 2 : 0) + (voice.name.includes('+') ? 0 : 1)
  }

  return voices.reduce((best, voice) => {
    const value = score(voice)
    return value >= 0 && (best === null || value > score(best)) ? voice : best
  }, null)
}

export function isSpeechSupported() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'
  )
}

/** Resolves with the browser voices, waiting for them to load if needed. */
export function loadVoices({ timeoutMs = VOICES_TIMEOUT_MS } = {}) {
  if (!isSpeechSupported()) return Promise.resolve([])

  const synth = window.speechSynthesis
  const voices = synth.getVoices()
  if (voices.length > 0) return Promise.resolve(voices)

  return new Promise((resolve) => {
    const finish = () => {
      synth.removeEventListener('voiceschanged', finish)
      clearTimeout(timer)
      resolve(synth.getVoices())
    }
    const timer = setTimeout(finish, timeoutMs)
    synth.addEventListener('voiceschanged', finish)
  })
}

/** Resolves with the voice that would be used for `lang`, or null. */
export async function findVoice(lang) {
  return pickVoice(await loadVoices(), lang)
}

/**
 * Reads `text` aloud. Resolves when speech starts; rejects with
 * SpeechUnavailableError if there is no voice for `lang`, or with the
 * synthesis error otherwise.
 */
export async function speak(text, lang) {
  const voice = await findVoice(lang)
  if (!voice) throw new SpeechUnavailableError(lang)

  const synth = window.speechSynthesis
  const utterance = new window.SpeechSynthesisUtterance(cleanSpeechText(text))
  utterance.lang = voice.lang
  utterance.voice = voice
  utterance.rate = 0.9

  // A new tap interrupts the previous phrase. Only cancel when something is
  // queued: Chrome may drop an utterance spoken right after an idle cancel().
  if (synth.speaking || synth.pending) synth.cancel()
  synth.resume() // Chrome can get stuck "paused" after the tab was hidden

  return new Promise((resolve, reject) => {
    utterance.onstart = () => resolve()
    utterance.onerror = (event) => {
      // "interrupted"/"canceled" just means a newer phrase replaced this one.
      if (event.error === 'interrupted' || event.error === 'canceled') resolve()
      else reject(new Error(`Speech failed: ${event.error}`))
    }
    synth.speak(utterance)
  })
}

function normalizeLang(lang) {
  return String(lang).replace('_', '-').toLowerCase()
}
