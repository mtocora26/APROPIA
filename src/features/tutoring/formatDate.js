/** "2026-10-20" -> "martes, 20 de octubre" (local date, no timezone shift). */
export function formatSessionDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}
