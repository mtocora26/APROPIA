import { migrateLegacyKey } from './legacyKeys.js'

const APP_ID = 'apropia'
const LEGACY_APP_ID = 'tukola'
const BACKUP_VERSION = 1
const KEY_PREFIX = 'apropia.'

/** Serializes every `apropia.*` entry of `storage` as a JSON backup. */
export function createBackup(storage, now = new Date().toISOString()) {
  const data = {}
  for (const key of apropiaKeys(storage)) data[key] = storage.getItem(key)

  return JSON.stringify({ app: APP_ID, version: BACKUP_VERSION, exportedAt: now, data })
}

/**
 * Replaces every `apropia.*` entry of `storage` with the ones in `text`.
 * Validates everything before touching the storage, so a bad file changes nothing.
 *
 * @returns {number} how many entries were restored
 */
export function restoreBackup(storage, text) {
  const entries = parseBackup(text)

  for (const key of apropiaKeys(storage)) storage.removeItem(key)
  for (const [key, value] of entries) storage.setItem(key, value)

  return entries.length
}

function parseBackup(text) {
  let backup
  try {
    backup = JSON.parse(text)
  } catch {
    throw new TypeError('El archivo no es un respaldo de APROPIA válido')
  }

  if (
    !isRecord(backup) ||
    (backup.app !== APP_ID && backup.app !== LEGACY_APP_ID) ||
    backup.version !== BACKUP_VERSION ||
    !isRecord(backup.data)
  ) {
    throw new TypeError('El archivo no es un respaldo de APROPIA válido')
  }

  // Backups made when the app was called Tukola use `tukola.*` keys.
  const entries = Object.entries(backup.data).map(([key, value]) => [migrateLegacyKey(key), value])
  for (const [key, value] of entries) {
    if (!key.startsWith(KEY_PREFIX) || typeof value !== 'string' || !isJson(value)) {
      throw new TypeError('El respaldo contiene datos inválidos')
    }
  }

  return entries
}

function apropiaKeys(storage) {
  const keys = []
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index)
    if (key !== null && key.startsWith(KEY_PREFIX)) keys.push(key)
  }
  return keys
}

function isJson(value) {
  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
