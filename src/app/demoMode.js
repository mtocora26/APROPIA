/**
 * Modo feria: visitors only see the fair presentation (/feria) and the Reto.
 * It is not access control: it hides the rest of the platform (rutas,
 * laboratorio, estudiantes) from visitors. Real separation needs accounts,
 * which the MVP does not have yet.
 *
 * - The printed QR points to `/feria`: opening it turns modo feria on in
 *   that browser. `?modo=feria` and `/modo-feria` do the same anywhere.
 * - `/modo-feria/salir` turns it off and marks the device as the organizer's:
 *   from then on `/feria` no longer locks it, so the presenter can show the
 *   presentation and the whole platform from the same browser.
 * - A build with VITE_DEMO_MODE=true is always in modo feria.
 */

const STORAGE_KEY = 'apropia.modoFeria'
const ORGANIZER_KEY = 'apropia.organizador'

export const DEMO_FORCED = import.meta.env?.VITE_DEMO_MODE === 'true'
export const DEMO_HOME = '/reto'
export const DEMO_PRESENTATION = '/feria'
export const DEMO_QUERY = 'modo=feria'
export const DEMO_ON_PATH = '/modo-feria'
export const DEMO_OFF_PATH = '/modo-feria/salir'

// What a visitor may open: the presentation, the Reto (with its ranking) and the switch.
const DEMO_PATHS = [/^\/feria\/?$/, /^\/reto(\/|$)/, /^\/modo-feria(\/|$)/]

export function isDemoPath(pathname) {
  return DEMO_PATHS.some((pattern) => pattern.test(pathname))
}

/** `?modo=feria` in the URL asks for modo feria. */
export function asksForDemoMode(search) {
  return new URLSearchParams(search).get('modo') === 'feria'
}

/** Opening the presentation locks a visitor's browser, not the organizer's. */
export function locksOnVisit(pathname, storage = globalThis.localStorage) {
  return /^\/feria\/?$/.test(pathname) && !isOrganizerDevice(storage)
}

export function isOrganizerDevice(storage = globalThis.localStorage) {
  try {
    return storage?.getItem(ORGANIZER_KEY) === '1'
  } catch {
    return false
  }
}

export function markOrganizerDevice(storage = globalThis.localStorage) {
  try {
    storage.setItem(ORGANIZER_KEY, '1')
  } catch {
    // Without storage the mark simply does not stick.
  }
}

export function isDemoMode(storage = globalThis.localStorage) {
  if (DEMO_FORCED) return true
  try {
    return storage?.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function setDemoMode(on, storage = globalThis.localStorage) {
  try {
    if (on) storage.setItem(STORAGE_KEY, '1')
    else storage.removeItem(STORAGE_KEY)
  } catch {
    // Without storage the switch simply does not stick.
  }
}
