/**
 * Lessons the student has seen: the ones marked by hand, the ones covered in a
 * tutoring session and the ones completed in the app.
 *
 * @returns {{ manual: Set<string>, automatic: Set<string>, all: Set<string> }}
 */
export function studiedLessons({ courseId, manual = [], sessions = [], progress = null }) {
  const automatic = new Set()

  for (const session of sessions) {
    for (const topic of session.topics) {
      if (topic.kind === 'lesson' && topic.courseId === courseId) automatic.add(topic.id)
    }
  }
  for (const [id, record] of Object.entries(progress?.exercises ?? {})) {
    if (record?.status === 'completed') automatic.add(id)
  }

  const manualSet = new Set(manual)
  return { manual: manualSet, automatic, all: new Set([...manualSet, ...automatic]) }
}
