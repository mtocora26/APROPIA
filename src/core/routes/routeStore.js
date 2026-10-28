import { validateCourse } from '../../domain/course.js'
import { ROUTE_ID_PREFIX } from './routeFromAi.js'

/**
 * Routes the student generated from their own material, kept in this browser.
 * Synchronous on purpose: `getCourse` reads it while rendering.
 *
 *   Route { course, examDate, startDate, createdAt, source: 'ia' | 'ejemplo' }
 */

const STORAGE_KEY = 'apropia.routes'
const STORAGE_VERSION = 1

export function createRouteStore(storage = globalThis.localStorage) {
  function read() {
    try {
      const data = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null')
      if (data?.version !== STORAGE_VERSION || !Array.isArray(data.routes)) return []
      return data.routes.filter(isValidRoute)
    } catch {
      return []
    }
  }

  function write(routes) {
    storage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, routes }))
  }

  return {
    list() {
      return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
    get(courseId) {
      return read().find((route) => route.course.id === courseId) ?? null
    },
    save(route) {
      if (!isValidRoute(route)) throw new TypeError('invalid route')
      write([...read().filter((item) => item.course.id !== route.course.id), route])
      return route
    },
    remove(courseId) {
      write(read().filter((route) => route.course.id !== courseId))
    },
  }
}

function isValidRoute(route) {
  if (!route || typeof route !== 'object') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(route.examDate ?? '')) return false
  if (typeof route.createdAt !== 'string') return false
  if (!route.course?.id?.startsWith(ROUTE_ID_PREFIX)) return false
  try {
    validateCourse(route.course)
    return true
  } catch {
    return false
  }
}
