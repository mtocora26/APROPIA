// Estructura lista; ampliar con más lecciones/ejercicios.
export const PRESENT_CONTINUOUS = {
  id: 'present-continuous',
  title: 'Present Continuous',
  lessons: [
    {
      id: 'prc-l1-estructura',
      title: 'Estructura y usos',
      theory: [
        { type: 'text', text: 'Present Continuous: Sujeto + am/is/are + verbo-ing. Acciones que ocurren ahora, planes cercanos y situaciones temporales.' },
        { type: 'table', columns: ['Sujeto', 'Verbo to be', 'Ejemplo'], rows: [
          ['I', 'am', 'I am working.'],
          ['he / she / it', 'is', 'She is reading.'],
          ['you / we / they', 'are', 'They are playing.'],
        ] },
        { type: 'example', text: 'I am studying English right now.', translation: 'Estoy estudiando inglés ahora mismo.' },
        { type: 'tip', text: 'Reglas -ing: make → making, run → running, die → dying. Palabras típicas: now, right now, at the moment, today, this week.' },
      ],
      exercises: [
        { id: 'prc-l1-e1', type: 'choice', prompt: 'Elige la forma correcta.', sentence: 'They ___ playing football now.', options: ['is', 'are', 'am'], answer: 'are' },
        { id: 'prc-l1-e2', type: 'typed', prompt: 'Completa con «write» en Present Continuous.', sentence: 'He is ___ an email.', answer: 'writing' },
        { id: 'prc-l1-e3', type: 'typed', prompt: 'Forma negativa de «work».', sentence: 'I ___ today.', answer: 'am not working', alternatives: ['\'m not working'] },
        { id: 'prc-l1-e4', type: 'reorder', prompt: 'Ordena: ¿Qué estás haciendo?', tokens: ['What', 'are', 'you', 'doing?'], answer: ['What', 'are', 'you', 'doing?'] },
        { id: 'prc-l1-e5', type: 'match', prompt: 'Une el verbo con su forma -ing.', pairs: [['make', 'making'], ['run', 'running'], ['die', 'dying'], ['play', 'playing']] },
        { id: 'prc-l1-e6', type: 'open', prompt: 'Describe lo que ves a tu alrededor ahora mismo con 2 frases en Present Continuous.', hints: ['I am ...ing', 'He/She is ...ing'], modelAnswer: 'I am sitting at my desk, and my colleague is drinking coffee.' },
      ],
    },
  ],
}
