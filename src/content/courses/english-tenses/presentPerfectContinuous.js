export const PRESENT_PERFECT_CONTINUOUS = {
  id: 'present-perfect-continuous',
  title: 'Present Perfect Continuous',
  lessons: [
    {
      id: 'ppc-l1-estructura',
      title: 'Estructura y usos',
      theory: [
        { type: 'text', text: 'Present Perfect Continuous: Sujeto + have/has been + verbo-ing. Acción que empezó en el pasado y continúa, o que acaba de terminar con resultado visible.' },
        { type: 'table', columns: ['Forma', 'Estructura', 'Ejemplo'], rows: [
          ['Afirmativa', 'have/has been + -ing', 'I have been waiting.'],
          ['Negativa', 'haven\'t/hasn\'t been + -ing', 'She hasn\'t been sleeping.'],
          ['Pregunta', 'Have/Has + sujeto + been + -ing?', 'Have you been working?'],
        ] },
        { type: 'example', text: 'I have been learning Italian for six months.', translation: 'Llevo seis meses aprendiendo italiano.' },
        { type: 'tip', text: 'Se usa mucho con for (duración) y since (punto de inicio): for two hours, since Monday.' },
        { type: 'scene', title: 'Acciones que llegan hasta ahora', items: [
          { emoji: '⏳', text: 'I have been waiting for an hour.', translation: 'Llevo una hora esperando.' },
          { emoji: '🏃', text: 'He has been running.', translation: 'Ha estado corriendo (está sudado).' },
          { emoji: '🌧️', text: 'It has been raining since morning.', translation: 'Lleva lloviendo desde la mañana.' },
        ] },
        { type: 'timeline', title: 'Empieza en el pasado y llega hasta AHORA', now: 80, events: [
          { emoji: '📘', label: 'have been learning Italian (6 months)', from: 20, to: 80 },
          { emoji: '⏳', label: 'has been waiting since 8 a.m.', from: 45, to: 80 },
        ] },
      ],
      exercises: [
        { id: 'ppc-l1-e1', type: 'choice', prompt: 'Elige la forma correcta.', sentence: 'She ___ been working since 8 a.m.', options: ['have', 'has', 'is'], answer: 'has' },
        { id: 'ppc-l1-e2', type: 'choice', prompt: 'Elige for o since.', sentence: 'They have been waiting ___ two hours.', options: ['for', 'since'], answer: 'for' },
        { id: 'ppc-l1-e3', type: 'typed', prompt: 'Completa con «study».', sentence: 'We have been ___ all night.', answer: 'studying' },
        { id: 'ppc-l1-e4', type: 'reorder', prompt: 'Ordena: Llevo años viviendo aquí.', tokens: ['I', 'have', 'been', 'living', 'here', 'for', 'years'], answer: ['I', 'have', 'been', 'living', 'here', 'for', 'years'] },
      ],
    },
    {
      id: 'ppc-l2-negativas-preguntas',
      title: 'Negativas y preguntas',
      theory: [
        { type: 'text', text: 'Negativa: haven\'t/hasn\'t been + -ing. Pregunta: Have/Has + sujeto + been + -ing? Respuestas cortas: Yes, I have. / No, she hasn\'t. Con How long: How long have you been waiting?' },
        { type: 'table', columns: ['Forma', 'Estructura', 'Ejemplo'], rows: [
          ['Negativa', 'haven\'t/hasn\'t been + -ing', 'We haven\'t been sleeping well.'],
          ['Pregunta', 'Have/Has + sujeto + been + -ing?', 'Has he been working?'],
          ['How long', 'How long + have/has + sujeto + been + -ing?', 'How long have you been living here?'],
          ['Respuesta corta', 'Yes, I have. / No, he hasn\'t.', 'Have you been waiting? Yes, I have.'],
        ] },
        { type: 'example', text: 'How long has she been studying? She has been studying since 6 p.m.', translation: '¿Cuánto tiempo lleva estudiando? Lleva estudiando desde las 6 p. m.' },
        { type: 'tip', text: 'for + duración (for three hours, for a week). since + punto de inicio (since 2020, since Monday). Otras palabras: lately, recently, all day. Spelling -ing: sit → sitting, come → coming.' },
        { type: 'scene', title: '¿Cuánto tiempo llevas...?', items: [
          { emoji: '⏰', text: 'How long have you been waiting?', translation: '¿Cuánto llevas esperando?' },
          { emoji: '🛌', text: 'She hasn\'t been sleeping well.', translation: 'No ha estado durmiendo bien.' },
          { emoji: '📅', text: 'We have been living here since 2020.', translation: 'Vivimos aquí desde 2020.' },
        ] },
        { type: 'timeline', title: 'for vs since', now: 85, events: [
          { emoji: '📏', label: 'for three hours (duración)', from: 50, to: 85 },
          { emoji: '📍', label: 'since Monday (inicio)', from: 15, to: 85 },
        ] },
      ],
      exercises: [
        { id: 'ppc-l2-e1', type: 'typed', prompt: 'Negativa de «sleep».', sentence: 'She ___ well lately.', answer: 'hasn\'t been sleeping', alternatives: ['has not been sleeping'] },
        { id: 'ppc-l2-e2', type: 'choice', prompt: 'Elige for o since.', sentence: 'I have been working here ___ 2019.', options: ['for', 'since'], answer: 'since' },
        { id: 'ppc-l2-e3', type: 'reorder', prompt: 'Ordena: ¿Cuánto tiempo llevas esperando?', tokens: ['How', 'long', 'have', 'you', 'been', 'waiting?'], answer: ['How', 'long', 'have', 'you', 'been', 'waiting?'] },
        { id: 'ppc-l2-e4', type: 'choice', prompt: 'Has he been working? Respuesta corta afirmativa.', options: ['Yes, he has.', 'Yes, he is.', 'Yes, he does.'], answer: 'Yes, he has.' },
        { id: 'ppc-l2-e5', type: 'typed', prompt: 'Escribe la -ing de «sit».', sentence: 'They have been ___ here all day.', answer: 'sitting' },
        { id: 'ppc-l2-e6', type: 'match', prompt: 'Une cada expresión con la frase correcta.', pairs: [['two weeks', 'for two weeks'], ['Tuesday', 'since Tuesday'], ['an hour', 'for an hour'], ['last year', 'since last year']] },
        { id: 'ppc-l2-e7', type: 'typed', prompt: 'Pregunta con «he / work».', sentence: '___ been working hard?', answer: 'Has he' },
      ],
    },
    {
      id: 'ppc-l3-reto-creativo',
      title: 'Reto creativo',
      theory: [
        { type: 'text', text: 'Practica con errores por cazar, un diálogo y escritura libre. Recuerda: have/has + been + verbo-ing, y for/since para el tiempo.' },
        { type: 'example', text: 'You look tired. Have you been running?', translation: 'Te ves cansado. ¿Has estado corriendo?' },
        { type: 'tip', text: 'Errores comunes: has con I/you/we/they (✗), olvidar been (I have waiting ✗) y usar for con un punto de inicio (for Monday ✗).' },
        { type: 'scene', title: 'Resultado visible', items: [
          { emoji: '😓', text: 'He is sweaty. He has been running.', translation: 'Está sudado. Ha estado corriendo.' },
          { emoji: '👀', text: 'Her eyes are red. She has been crying.', translation: 'Tiene los ojos rojos. Ha estado llorando.' },
          { emoji: '🎨', text: 'My hands are dirty. I have been painting.', translation: 'Tengo las manos sucias. He estado pintando.' },
        ] },
        { type: 'timeline', title: 'Acaba de terminar vs sigue', now: 80, events: [
          { emoji: '🏃', label: 'has been running (just stopped)', from: 40, to: 75 },
          { emoji: '🎨', label: 'have been painting (still)', from: 30, to: 80 },
        ] },
      ],
      exercises: [
        { id: 'ppc-l3-e1', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['She', 'have', 'been', 'waiting', 'since', 'noon.'], wrongIndex: 1, correction: 'She has been waiting since noon.' },
        { id: 'ppc-l3-e2', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['I', 'have', 'been', 'studying', 'for', 'Monday.'], wrongIndex: 4, correction: 'I have been studying since Monday.' },
        { id: 'ppc-l3-e3', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['They', 'have', 'waiting', 'for', 'an', 'hour.'], wrongIndex: 2, correction: 'They have been waiting for an hour.' },
        { id: 'ppc-l3-e4', type: 'dialogue', prompt: 'Te encuentras con una amiga en la calle.', lines: [
          { who: 'Friend', text: 'You look exhausted!' },
          { who: 'Tú', options: ['Yes, I have been working all day.', 'Yes, I has been working all day.', 'Yes, I have working all day.'], answer: 'Yes, I have been working all day.' },
          { who: 'Friend', text: 'How long have you been working?' },
          { who: 'Tú', options: ['Since 7 a.m.', 'For 7 a.m.', 'Since ten hours ago for.'], answer: 'Since 7 a.m.' },
        ] },
        { id: 'ppc-l3-e5', type: 'reorder', prompt: 'Ordena: Ha estado lloviendo desde la mañana.', tokens: ['It', 'has', 'been', 'raining', 'since', 'morning.'], answer: ['It', 'has', 'been', 'raining', 'since', 'morning.'] },
        { id: 'ppc-l3-e6', type: 'open', prompt: 'Cuenta algo que llevas haciendo mucho tiempo y desde cuándo (2 frases).', hints: ['I have been ...ing for ...', 'since ...'], modelAnswer: 'I have been learning English for two years. I have been practicing every day since January.' },
        { id: 'ppc-l3-e7', type: 'open', prompt: 'Tu amigo llega cansado y con las manos sucias. Explica qué ha estado haciendo (2 frases).', hints: ['He has been ...ing', 'That is why ...'], modelAnswer: 'He has been working in the garden. That is why his hands are dirty.' },
      ],
    },
  ],
  // Repaso del módulo: ejercicios distintos a los de las lecciones, en otros contextos.
  reviewExercises: [
    { id: 'ppc-r1', from: 'ppc-l1-estructura', type: 'choice', prompt: 'En el trabajo. Elige la forma correcta.', sentence: 'My colleagues ___ been talking for an hour.', options: ['has', 'have', 'are'], answer: 'have' },
    { id: 'ppc-r2', from: 'ppc-l1-estructura', type: 'typed', prompt: 'Completa con «cook».', sentence: 'He has been ___ since noon.', answer: 'cooking' },
    { id: 'ppc-r3', from: 'ppc-l2-negativas-preguntas', type: 'typed', prompt: 'Negativa: no hemos estado trabajando.', sentence: 'We ___ this week.', answer: 'haven\'t been working', alternatives: ['have not been working'] },
    { id: 'ppc-r4', from: 'ppc-l2-negativas-preguntas', type: 'reorder', prompt: 'Ordena: ¿Ha estado ella viviendo aquí?', tokens: ['Has', 'she', 'been', 'living', 'here?'], answer: ['Has', 'she', 'been', 'living', 'here?'] },
    { id: 'ppc-r5', from: 'ppc-l3-reto-creativo', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['He', 'has', 'been', 'play', 'tennis', 'since', 'May.'], wrongIndex: 3, correction: 'He has been playing tennis since May.' },
    { id: 'ppc-r6', from: 'ppc-l3-reto-creativo', type: 'open', prompt: 'Describe a alguien que llega mojado a casa y explica qué ha estado haciendo (2 frases).', hints: ['He has been ...ing', 'It has been ...ing'], modelAnswer: 'He has been walking in the rain. It has been raining for hours.' },
  ],
}
