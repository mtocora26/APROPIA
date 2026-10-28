// Estructura lista; ampliar con más lecciones/ejercicios.
export const PAST_PERFECT = {
  id: 'past-perfect',
  title: 'Past Perfect',
  lessons: [
    {
      id: 'pas-l1-estructura',
      title: 'Estructura y usos',
      theory: [
        { type: 'text', text: 'Past Perfect: Sujeto + had + participio pasado. Expresa una acción que ocurrió antes de otra acción en el pasado.' },
        { type: 'table', columns: ['Forma', 'Estructura', 'Ejemplo'], rows: [
          ['Afirmativa', 'had + participio', 'I had left.'],
          ['Negativa', 'hadn\'t + participio', 'She hadn\'t arrived.'],
          ['Pregunta', 'Had + sujeto + participio?', 'Had they finished?'],
        ] },
        { type: 'example', text: 'When I arrived, the movie had already started.', translation: 'Cuando llegué, la película ya había empezado.' },
        { type: 'tip', text: 'Had no cambia con el sujeto. Palabras típicas: already, before, by the time, after, when.' },
      ],
      exercises: [
        { id: 'pas-l1-e1', type: 'choice', prompt: 'Elige la forma correcta.', sentence: 'When we got there, they ___ already left.', options: ['have', 'had', 'were'], answer: 'had' },
        { id: 'pas-l1-e2', type: 'typed', prompt: 'Completa con «eat» en Past Perfect.', sentence: 'She had ___ before I called.', answer: 'eaten' },
        { id: 'pas-l1-e3', type: 'typed', prompt: 'Forma negativa de «finish».', sentence: 'He ___ his homework.', answer: 'hadn\'t finished', alternatives: ['had not finished'] },
        { id: 'pas-l1-e4', type: 'reorder', prompt: 'Ordena: Ya habíamos comido cuando llegó.', tokens: ['We', 'had', 'already', 'eaten', 'when', 'he', 'arrived'], answer: ['We', 'had', 'already', 'eaten', 'when', 'he', 'arrived'] },
        { id: 'pas-l1-e5', type: 'choice', prompt: '¿Qué ocurrió primero? «I had finished before she called.»', options: ['I finished', 'She called'], answer: 'I finished' },
      ],
    },
  ],
}
