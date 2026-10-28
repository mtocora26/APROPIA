import { getCourse as getBundledCourse } from '../content/courses/index.js'
import { createRouteStore } from '../core/routes/routeStore.js'

export const routeStore = createRouteStore()

/** Bundled courses plus the routes the student generated from their material. */
export function getCourse(courseId) {
  return getBundledCourse(courseId) ?? routeStore.get(courseId)?.course ?? null
}
