import { getCourse } from '../courses/index.js'
import { sampleRouteCourse } from '../routes/index.js'

// Temas del Reto APROPIA. Cada tema toma los ejercicios de un curso que ya existe.
export const CHALLENGE_TOPICS = Object.freeze([
  { id: 'ingles', title: 'Inglés', subtitle: 'Tiempos verbales: ¿past simple o present perfect?', course: () => getCourse('english-tenses') },
  { id: 'ciclos', title: 'Ciclos en programación', subtitle: 'Ruta que la IA armó a partir de unos apuntes', course: sampleRouteCourse },
  { id: 'python', title: 'Python', subtitle: 'Bucles y pensamiento lógico', course: () => getCourse('python-bucles') },
  { id: 'logica', title: 'Lógica de programación', subtitle: 'Fundamentos con PSeInt', course: () => getCourse('pseint-fundamentos') },
])

export function findChallengeTopic(topicId) {
  return CHALLENGE_TOPICS.find((topic) => topic.id === topicId) ?? null
}

/** Exercises grouped by lesson, the shape `pickQuestions` expects. */
export function exercisesByLesson(course) {
  return course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.exercises))
}
