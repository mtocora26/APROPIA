// Estructura lista; ampliar con más lecciones/ejercicios (ver docs: plantilla de contenido).
export const PRESENT_PERFECT = {
  id: 'present-perfect',
  title: 'Present Perfect',
  lessons: [
    {
      id: 'pp-l1-estructura',
      title: 'Estructura y usos',
      theory: [
        { type: 'text', text: 'Present Perfect: Sujeto + have/has + participio pasado. Conecta el pasado con el presente: experiencias, acciones recientes y cambios.' },
        { type: 'table', columns: ['Forma', 'Estructura', 'Ejemplo'], rows: [
          ['Afirmativa', 'have/has + participio', 'I have finished.'],
          ['Negativa', 'haven\'t/hasn\'t + participio', 'She hasn\'t called.'],
          ['Pregunta', 'Have/Has + sujeto + participio?', 'Have you eaten?'],
        ] },
        { type: 'example', text: 'I have visited Rome twice.', translation: 'He visitado Roma dos veces.' },
        { type: 'tip', text: 'HAS con he, she, it. HAVE con I, you, we, they. Palabras típicas: ever, never, already, yet, just, since, for.' },
      ],
      exercises: [
        { id: 'pp-l1-e1', type: 'choice', prompt: 'Elige la forma correcta.', sentence: 'She ___ finished her report.', options: ['have', 'has', 'is'], answer: 'has' },
        { id: 'pp-l1-e2', type: 'typed', prompt: 'Participio de «go».', sentence: 'They have ___ to Italy.', answer: 'gone' },
        { id: 'pp-l1-e3', type: 'typed', prompt: 'Forma negativa de «see».', sentence: 'I ___ that movie.', answer: 'haven\'t seen', alternatives: ['have not seen'] },
        { id: 'pp-l1-e4', type: 'reorder', prompt: 'Ordena la pregunta: ¿Alguna vez has probado sushi?', tokens: ['Have', 'you', 'ever', 'tried', 'sushi?'], answer: ['Have', 'you', 'ever', 'tried', 'sushi?'] },
        { id: 'pp-l1-e5', type: 'match', prompt: 'Une el verbo con su participio.', pairs: [['write', 'written'], ['eat', 'eaten'], ['take', 'taken'], ['know', 'known']] },
      ],
    },
  ],
}
