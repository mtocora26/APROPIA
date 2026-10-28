/**
 * The round generated from the visitor's own topic. It lives in sessionStorage:
 * it survives a reload of the play page but not the next visitor's session.
 */
const STORAGE_KEY = 'apropia.reto.propio'

export function saveOwnChallenge(challenge, storage = globalThis.sessionStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(challenge))
  } catch {
    // Without storage the round still starts; it just does not survive a reload.
  }
}

/** @returns {{ title: string, questions: object[] } | null} */
export function loadOwnChallenge(storage = globalThis.sessionStorage) {
  try {
    const data = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null')
    return data && typeof data.title === 'string' && Array.isArray(data.questions) && data.questions.length > 0 ? data : null
  } catch {
    return null
  }
}
