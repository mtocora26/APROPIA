import { CIENCIA } from './banks/ciencia.js'
import { COLOMBIA } from './banks/colombia.js'
import { INGLES } from './banks/ingles.js'
import { LOGICA } from './banks/logica.js'
import { PROGRAMACION } from './banks/programacion.js'
import { TECNOLOGIA } from './banks/tecnologia.js'

// Temas del Reto APROPIA. Cada tema tiene su propio banco de preguntas, escrito
// para responderse sin haber visto ninguna lección. Agregar un tema = crear su
// archivo en banks/ y listarlo aquí.
export const CHALLENGE_TOPICS = Object.freeze([INGLES, PROGRAMACION, LOGICA, TECNOLOGIA, CIENCIA, COLOMBIA])

export function findChallengeTopic(topicId) {
  return CHALLENGE_TOPICS.find((topic) => topic.id === topicId) ?? null
}
