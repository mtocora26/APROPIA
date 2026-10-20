const LEGACY_PREFIX = 'tukola.'
const PREFIX = 'apropia.'

/** "tukola.progress.ana" -> "apropia.progress.ana" */
export function migrateLegacyKey(key) {
  return key.startsWith(LEGACY_PREFIX) ? PREFIX + key.slice(LEGACY_PREFIX.length) : key
}

/**
 * The app used to be called Tukola and stored everything under `tukola.*`.
 * Moves those entries to `apropia.*`, never overwriting data already there.
 *
 * @returns {number} how many entries were moved
 */
export function migrateLegacyStorage(storage) {
  const legacyKeys = []
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index)
    if (key !== null && key.startsWith(LEGACY_PREFIX)) legacyKeys.push(key)
  }

  for (const key of legacyKeys) {
    const next = migrateLegacyKey(key)
    if (storage.getItem(next) === null) storage.setItem(next, storage.getItem(key))
    storage.removeItem(key)
  }

  return legacyKeys.length
}
