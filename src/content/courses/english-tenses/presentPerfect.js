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
        { type: 'scene', title: 'Tres usos del Present Perfect', items: [
          { emoji: '🌍', text: 'I have visited Rome twice.', translation: 'He visitado Roma dos veces. (experiencia)' },
          { emoji: '🍽️', text: 'She has just finished lunch.', translation: 'Ella acaba de terminar el almuerzo. (reciente)' },
          { emoji: '🏠', text: 'We have lived here since 2020.', translation: 'Vivimos aquí desde 2020. (continúa hoy)' },
        ] },
        { type: 'timeline', title: 'Pasado que llega hasta hoy', now: 80, events: [
          { emoji: '🏠', label: 'I have lived in Cali for 5 years', from: 30, to: 80 },
          { emoji: '✈️', label: 'I visited Rome (Past Simple: terminó)', from: 20 },
          { emoji: '📞', label: 'She has just called (hace poco)', from: 74 },
        ] },
      ],
      exercises: [
        { id: 'pp-l1-e1', type: 'choice', prompt: 'Elige la forma correcta.', sentence: 'She ___ finished her report.', options: ['have', 'has', 'is'], answer: 'has' },
        { id: 'pp-l1-e2', type: 'typed', prompt: 'Participio de «go».', sentence: 'They have ___ to Italy.', answer: 'gone' },
        { id: 'pp-l1-e3', type: 'typed', prompt: 'Forma negativa de «see».', sentence: 'I ___ that movie.', answer: 'haven\'t seen', alternatives: ['have not seen'] },
        { id: 'pp-l1-e4', type: 'reorder', prompt: 'Ordena la pregunta: ¿Alguna vez has probado sushi?', tokens: ['Have', 'you', 'ever', 'tried', 'sushi?'], answer: ['Have', 'you', 'ever', 'tried', 'sushi?'] },
        { id: 'pp-l1-e5', type: 'match', prompt: 'Une el verbo con su participio.', pairs: [['write', 'written'], ['eat', 'eaten'], ['take', 'taken'], ['know', 'known']] },
        { id: 'pp-l1-e6', type: 'open', prompt: 'Situación: un compañero nuevo te pregunta por tu experiencia. Cuéntale una cosa que has hecho y una que nunca has hecho.', hints: ['I have ...', 'I have never ...'], modelAnswer: 'I have visited Rome twice, but I have never tried sushi.' },
        { id: 'pp-l1-e7', type: 'dialogue', prompt: 'Completa la conversación en una entrevista.', lines: [
          { who: 'Interviewer', text: 'Tell me about your experience.' },
          { who: 'You', options: ['I have worked in sales for three years.', 'I work in sales for three years ago.'], answer: 'I have worked in sales for three years.' },
          { who: 'Interviewer', text: 'Have you ever managed a team?' },
          { who: 'You', options: ['Yes, I have managed a team of five.', 'Yes, I managed a team of five since 2020.'], answer: 'Yes, I have managed a team of five.' },
          { who: 'Interviewer', text: 'Great, thank you.' },
        ] },
      ],
    },
    {
      id: 'pp-l2-negativas-preguntas',
      title: 'Negativas y preguntas',
      theory: [
        { type: 'text', text: 'Negativa: haven\'t/hasn\'t + participio. Pregunta: Have/Has + sujeto + participio? Respuestas cortas: Yes, I have. / No, she hasn\'t.' },
        { type: 'table', columns: ['Palabra', 'Significado', 'Ejemplo'], rows: [
          ['ever', 'alguna vez (preguntas)', 'Have you ever flown?'],
          ['never', 'nunca', 'I have never flown.'],
          ['already', 'ya (afirmativas)', 'He has already left.'],
          ['yet', 'todavía / ya (negativas y preguntas)', 'Have you finished yet?'],
          ['just', 'acabo de', 'I have just arrived.'],
          ['for / since', 'durante / desde', 'for two years / since 2022'],
        ] },
        { type: 'example', text: 'Has she called yet? No, she hasn\'t.', translation: '¿Ya llamó? No, todavía no.' },
        { type: 'tip', text: 'Con «yet» y «ever» usa preguntas o negativas. En la respuesta corta solo repites have/has: «Yes, I have.»' },
        { type: 'scene', title: 'Preguntas y respuestas', items: [
          { emoji: '❓', text: 'Have you ever been to Japan?', translation: '¿Alguna vez has ido a Japón?' },
          { emoji: '✅', text: 'Yes, I have.', translation: 'Sí, he ido.' },
          { emoji: '🚫', text: 'No, I haven\'t.', translation: 'No, no he ido.' },
        ] },
        { type: 'timeline', title: 'Yet = todavía no ha pasado', now: 70, events: [
          { emoji: '📝', label: 'I have already done my homework', from: 45 },
          { emoji: '🧹', label: 'I haven\'t cleaned my room yet (aún sin hacer)', from: 70 },
          { emoji: '⏳', label: 'I have waited since 3 PM', from: 25, to: 70 },
        ] },
      ],
      exercises: [
        { id: 'pp-l2-e1', type: 'choice', prompt: 'Elige la forma correcta.', sentence: '___ your brother ever met a famous person?', options: ['Have', 'Has', 'Is'], answer: 'Has' },
        { id: 'pp-l2-e2', type: 'typed', prompt: 'Negativa. Ellos todavía no han llegado.', sentence: 'They ___ arrived yet.', answer: 'haven\'t', alternatives: ['have not'] },
        { id: 'pp-l2-e3', type: 'typed', prompt: 'Respuesta corta negativa. «Has he finished?» — No, ___.', sentence: 'No, ___.', answer: 'he hasn\'t', alternatives: ['he has not'] },
        { id: 'pp-l2-e4', type: 'reorder', prompt: 'Ordena: ¿Ya has terminado tu tarea?', tokens: ['Have', 'you', 'finished', 'your', 'homework', 'yet?'], answer: ['Have', 'you', 'finished', 'your', 'homework', 'yet?'] },
        { id: 'pp-l2-e5', type: 'match', prompt: 'Une la palabra con su significado.', pairs: [['never', 'nunca'], ['already', 'ya'], ['just', 'acabo de'], ['since', 'desde']] },
        { id: 'pp-l2-e6', type: 'choice', prompt: '¿Qué palabra completa la frase? «I have lived here ___ ten years.»', options: ['for', 'since', 'ago'], answer: 'for' },
        { id: 'pp-l2-e7', type: 'open', prompt: 'Pregúntale a un amigo si ha probado la comida colombiana y respóndete con una respuesta corta.', hints: ['Have you ever ...?', 'Yes, I have. / No, I haven\'t.'], modelAnswer: 'Have you ever tried Colombian food? Yes, I have.' },
      ],
    },
    {
      id: 'pp-l3-reto-creativo',
      title: 'Reto creativo',
      theory: [
        { type: 'text', text: 'Hora de practicar con errores típicos: have/has, participios irregulares y confundir Present Perfect con Past Simple. Si dices CUÁNDO pasó (yesterday, last year, in 2019), usa Past Simple.' },
        { type: 'table', columns: ['Error', 'Correcto'], rows: [
          ['She have finished.', 'She has finished.'],
          ['I have went home.', 'I have gone home.'],
          ['I have seen him yesterday.', 'I saw him yesterday.'],
        ] },
        { type: 'example', text: 'I have lost my keys, so I can\'t open the door.', translation: 'He perdido mis llaves, así que no puedo abrir la puerta.' },
        { type: 'tip', text: 'Detective: si ves una fecha o momento terminado (yesterday, ago, last week), el Present Perfect no encaja.' },
        { type: 'scene', title: 'Historias con resultado hoy', items: [
          { emoji: '🔑', text: 'I have lost my keys.', translation: 'Perdí las llaves (y aún no las tengo).' },
          { emoji: '🤕', text: 'He has broken his arm.', translation: 'Se ha roto el brazo (está enyesado).' },
          { emoji: '🎂', text: 'We have baked a cake!', translation: '¡Hemos horneado un pastel! (está listo)' },
        ] },
        { type: 'timeline', title: 'Present Perfect vs Past Simple', now: 85, events: [
          { emoji: '📅', label: 'I saw him yesterday (momento terminado)', from: 60 },
          { emoji: '👀', label: 'I have seen him (sin decir cuándo)', from: 50 },
          { emoji: '🎓', label: 'I have studied English since 2021', from: 15, to: 85 },
        ] },
      ],
      exercises: [
        { id: 'pp-l3-e1', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['She', 'have', 'finished', 'her', 'work.'], wrongIndex: 1, correction: 'She has finished her work.' },
        { id: 'pp-l3-e2', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['I', 'have', 'went', 'to', 'Cartagena', 'twice.'], wrongIndex: 2, correction: 'I have gone to Cartagena twice.' },
        { id: 'pp-l3-e3', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['We', 'have', 'met', 'her', 'last', 'year.'], wrongIndex: 1, correction: 'We met her last year.' },
        { id: 'pp-l3-e4', type: 'choice', prompt: 'Elige la oración correcta.', options: ['I have bought a new phone last week.', 'I bought a new phone last week.', 'I have buy a new phone.'], answer: 'I bought a new phone last week.' },
        { id: 'pp-l3-e5', type: 'dialogue', prompt: 'Estás en el aeropuerto. Completa la conversación.', lines: [
          { who: 'Agent', text: 'Have you checked in yet?' },
          { who: 'You', options: ['Yes, I have. Here is my passport.', 'Yes, I did have. Here is my passport.', 'Yes, I has.'], answer: 'Yes, I have. Here is my passport.' },
          { who: 'Agent', text: 'Have you packed any liquids?' },
          { who: 'You', options: ['No, I haven\'t.', 'No, I didn\'t have.', 'No, I hasn\'t.'], answer: 'No, I haven\'t.' },
        ] },
        { id: 'pp-l3-e6', type: 'open', prompt: 'Creativo: cuenta tres cosas que has hecho este año y una que todavía no has hecho.', hints: ['I have ...', 'I haven\'t ... yet'], modelAnswer: 'This year I have started a new job, I have learned to cook and I have visited my grandparents. I haven\'t travelled abroad yet.' },
        { id: 'pp-l3-e7', type: 'open', prompt: 'Creativo: describe a un personaje famoso que admiras usando «has» y «has never».', hints: ['He/She has ...', 'He/She has never ...'], modelAnswer: 'Shakira has sold millions of albums. She has never stopped helping children.' },
      ],
    },
  ],
  // Repaso del módulo: ejercicios distintos a los de las lecciones, en otros contextos.
  reviewExercises: [
    { id: 'pp-r1', from: 'pp-l1-estructura', type: 'choice', prompt: 'Estás en una tienda: «Mi hermana ha comprado un vestido nuevo».', options: ['My sister has bought a new dress.', 'My sister have bought a new dress.', 'My sister has buy a new dress.'], answer: 'My sister has bought a new dress.' },
    { id: 'pp-r2', from: 'pp-l1-estructura', type: 'typed', prompt: 'Participio de «drink». Nosotros hemos bebido mucha agua hoy.', sentence: 'We have ___ a lot of water today.', answer: 'drunk' },
    { id: 'pp-r3', from: 'pp-l2-negativas-preguntas', type: 'reorder', prompt: 'Ordena: Nunca he visto la nieve.', tokens: ['I', 'have', 'never', 'seen', 'snow.'], answer: ['I', 'have', 'never', 'seen', 'snow.'] },
    { id: 'pp-r4', from: 'pp-l2-negativas-preguntas', type: 'typed', prompt: 'Pregunta. ¿Ha llegado ya el bus?', sentence: '___ the bus arrived yet?', answer: 'Has' },
    { id: 'pp-r5', from: 'pp-l3-reto-creativo', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['He', 'has', 'ate', 'all', 'the', 'cookies.'], wrongIndex: 2, correction: 'He has eaten all the cookies.' },
    { id: 'pp-r6', from: 'pp-l3-reto-creativo', type: 'open', prompt: 'Un amigo te pregunta por tu fin de semana ideal. Cuéntale algo que has querido hacer pero todavía no has hecho.', hints: ['I have always wanted to ...', 'I haven\'t ... yet'], modelAnswer: 'I have always wanted to go camping, but I haven\'t done it yet.' },
  ],
}
