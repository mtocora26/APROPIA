export const CHALLENGE_PATH = '/reto'
export const CHALLENGE_BOARD_PATH = '/reto/ranking'
export const OWN_TOPIC_ID = 'propio'

export function challengePlayPath(topicId, routeId) {
  const path = `${CHALLENGE_PATH}/jugar/${topicId}`
  return routeId ? `${path}?ruta=${encodeURIComponent(routeId)}` : path
}
