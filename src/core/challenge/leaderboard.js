/**
 * Ranking of the day for the booth. Lives in this browser only: everyone
 * plays on the same device, and a second tab can show the board.
 *
 *   Entry { id, alias, score, correct, total, topic, day, at }
 */

const STORAGE_KEY = 'apropia.reto.ranking'
const STORAGE_VERSION = 1
export const ALIAS_MAX_LENGTH = 16

export function normalizeAlias(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, ALIAS_MAX_LENGTH)
}

export function createLeaderboard(storage = globalThis.localStorage, now = () => new Date()) {
  function read() {
    try {
      const data = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null')
      return data?.version === STORAGE_VERSION && Array.isArray(data.entries) ? data.entries : []
    } catch {
      return []
    }
  }

  function write(entries) {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, entries }))
  }

  return {
    STORAGE_KEY,

    /** Best scores of `day` (YYYY-MM-DD), ties broken by who got there first. */
    top(day, limit = 10) {
      return read()
        .filter((entry) => entry.day === day)
        .sort((a, b) => b.score - a.score || a.at.localeCompare(b.at))
        .slice(0, limit)
    },

    /** @returns {{ entry: object, rank: number }} rank is 1-based among the day's entries */
    add({ alias, score, correct, total, topic, day }) {
      const name = normalizeAlias(alias)
      if (!name) throw new TypeError('alias is required')
      const at = now().toISOString()
      const entry = { id: `${at}-${Math.random().toString(36).slice(2, 7)}`, alias: name, score, correct, total, topic, day, at }
      write([...read(), entry])
      const rank = this.top(day, Infinity).findIndex((item) => item.id === entry.id) + 1
      return { entry, rank }
    },

    clearDay(day) {
      write(read().filter((entry) => entry.day !== day))
    },
  }
}
