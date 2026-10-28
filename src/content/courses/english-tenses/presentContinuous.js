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
        { type: 'scene', title: 'Mira qué está pasando ahora', items: [
          { emoji: '🍳', text: 'She is cooking.', translation: 'Ella está cocinando.' },
          { emoji: '📚', text: 'I am studying.', translation: 'Estoy estudiando.' },
          { emoji: '⚽', text: 'They are playing football.', translation: 'Ellos están jugando fútbol.' },
          { emoji: '🌧️', text: 'It is raining.', translation: 'Está lloviendo.' },
        ] },
        { type: 'timeline', title: 'La acción ocurre alrededor de AHORA', now: 50, events: [
          { emoji: '🍳', label: 'is cooking', from: 35, to: 65 },
          { emoji: '✈️', label: 'is flying tomorrow (plan)', from: 85 },
        ] },
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
    {
      id: 'prc-l2-negativas-preguntas',
      title: 'Negativas y preguntas',
      theory: [
        { type: 'text', text: 'Negativa: Sujeto + am/is/are + not + verbo-ing. Pregunta: Am/Is/Are + sujeto + verbo-ing? Respuestas cortas: Yes, I am. / No, she isn\'t.' },
        { type: 'table', columns: ['Forma', 'Estructura', 'Ejemplo'], rows: [
          ['Negativa', 'am not / isn\'t / aren\'t + -ing', 'He isn\'t sleeping.'],
          ['Pregunta', 'Am/Is/Are + sujeto + -ing?', 'Are they working?'],
          ['Con wh-', 'Wh- + are/is/am + sujeto + -ing?', 'Where is she going?'],
          ['Respuesta corta', 'Yes, I am. / No, we aren\'t.', 'Is he eating? No, he isn\'t.'],
        ] },
        { type: 'example', text: 'Are you listening to me? No, I\'m not.', translation: '¿Me estás escuchando? No.' },
        { type: 'tip', text: 'Palabras típicas: now, right now, at the moment, today, these days, this week. Spelling: swim → swimming, write → writing, lie → lying.' },
        { type: 'scene', title: 'Lo que NO está pasando', items: [
          { emoji: '😴', text: 'He isn\'t sleeping.', translation: 'Él no está durmiendo.' },
          { emoji: '📵', text: 'She isn\'t using her phone.', translation: 'Ella no está usando su teléfono.' },
          { emoji: '❓', text: 'Are they dancing?', translation: '¿Están bailando?' },
        ] },
        { type: 'timeline', title: 'Ahora mismo: sí o no', now: 50, events: [
          { emoji: '🎵', label: 'is listening (yes)', from: 35, to: 65 },
          { emoji: '🚫', label: 'isn\'t sleeping (not now)', from: 20 },
        ] },
      ],
      exercises: [
        { id: 'prc-l2-e1', type: 'typed', prompt: 'Negativa de «sleep».', sentence: 'The baby ___ now.', answer: 'isn\'t sleeping', alternatives: ['is not sleeping'] },
        { id: 'prc-l2-e2', type: 'choice', prompt: 'Elige la pregunta correcta.', options: ['Are you working today?', 'You are working today?', 'Do you working today?'], answer: 'Are you working today?' },
        { id: 'prc-l2-e3', type: 'typed', prompt: 'Escribe la -ing de «swim».', sentence: 'They are ___ in the sea.', answer: 'swimming' },
        { id: 'prc-l2-e4', type: 'reorder', prompt: 'Ordena: ¿Adónde va ella?', tokens: ['Where', 'is', 'she', 'going?'], answer: ['Where', 'is', 'she', 'going?'] },
        { id: 'prc-l2-e5', type: 'choice', prompt: '¿Is he eating? Respuesta corta negativa.', options: ['No, he isn\'t.', 'No, he doesn\'t.', 'No, he not.'], answer: 'No, he isn\'t.' },
        { id: 'prc-l2-e6', type: 'match', prompt: 'Une pregunta y respuesta corta.', pairs: [['Are you tired?', 'Yes, I am.'], ['Is she working?', 'No, she isn\'t.'], ['Are they playing?', 'Yes, they are.']] },
        { id: 'prc-l2-e7', type: 'typed', prompt: 'Completa la pregunta con «you / do».', sentence: 'What ___ ?', answer: 'are you doing' },
      ],
    },
    {
      id: 'prc-l3-reto-creativo',
      title: 'Reto creativo',
      theory: [
        { type: 'text', text: 'Hora de practicar: caza errores, completa una conversación y escribe tus propias frases. Recuerda: am/is/are + verbo-ing, sin olvidar el verbo to be.' },
        { type: 'example', text: 'My sister is learning to drive this month.', translation: 'Mi hermana está aprendiendo a conducir este mes.' },
        { type: 'tip', text: 'Errores comunes: olvidar to be (She working ✗), usar do (Do you working? ✗) o no poner -ing (He is play ✗).' },
        { type: 'scene', title: 'Un día en el parque', items: [
          { emoji: '🐕', text: 'The dog is running.', translation: 'El perro está corriendo.' },
          { emoji: '🧒', text: 'The kids are eating ice cream.', translation: 'Los niños están comiendo helado.' },
          { emoji: '📸', text: 'I am taking photos.', translation: 'Estoy sacando fotos.' },
        ] },
        { type: 'timeline', title: 'Ahora y esta semana', now: 50, events: [
          { emoji: '📸', label: 'am taking photos (now)', from: 40, to: 60 },
          { emoji: '🎨', label: 'is painting a house (this week)', from: 20, to: 80 },
        ] },
      ],
      exercises: [
        { id: 'prc-l3-e1', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['She', 'working', 'at', 'the', 'moment.'], wrongIndex: 1, correction: 'She is working at the moment.' },
        { id: 'prc-l3-e2', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['They', 'are', 'play', 'in', 'the', 'garden.'], wrongIndex: 2, correction: 'They are playing in the garden.' },
        { id: 'prc-l3-e3', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['Do', 'you', 'watching', 'TV', 'now?'], wrongIndex: 0, correction: 'Are you watching TV now?' },
        { id: 'prc-l3-e4', type: 'dialogue', prompt: 'Hablas por teléfono con un amigo.', lines: [
          { who: 'Friend', text: 'Hi! What are you doing?' },
          { who: 'Tú', options: ['I am cooking dinner.', 'I cooking dinner.', 'I cook dinner now.'], answer: 'I am cooking dinner.' },
          { who: 'Friend', text: 'Is your brother helping you?' },
          { who: 'Tú', options: ['No, he isn\'t. He is watching TV.', 'No, he doesn\'t. He watching TV.', 'No, he isn\'t. He watch TV.'], answer: 'No, he isn\'t. He is watching TV.' },
        ] },
        { id: 'prc-l3-e5', type: 'reorder', prompt: 'Ordena: Estamos aprendiendo inglés este año.', tokens: ['We', 'are', 'learning', 'English', 'this', 'year.'], answer: ['We', 'are', 'learning', 'English', 'this', 'year.'] },
        { id: 'prc-l3-e6', type: 'open', prompt: 'Imagina una foto de una plaza llena de gente. Describe 3 cosas que pasan.', hints: ['A man is ...ing', 'Some children are ...ing', 'It isn\'t ...ing'], modelAnswer: 'A man is selling balloons. Some children are running. It isn\'t raining.' },
        { id: 'prc-l3-e7', type: 'open', prompt: 'Cuenta un cambio o proyecto temporal de tu vida actual (2 frases).', hints: ['I am ...ing this month', 'My friend is ...ing'], modelAnswer: 'I am studying for an exam this month. My friend is learning to play the guitar.' },
      ],
    },
  ],
  // Repaso del módulo: ejercicios distintos a los de las lecciones, en otros contextos.
  reviewExercises: [
    { id: 'prc-r1', from: 'prc-l1-estructura', type: 'choice', prompt: 'En la cafetería. Elige la forma correcta.', sentence: 'The waiter ___ bringing our coffee.', options: ['is', 'are', 'am'], answer: 'is' },
    { id: 'prc-r2', from: 'prc-l1-estructura', type: 'typed', prompt: 'Completa con «run».', sentence: 'The children are ___ in the yard.', answer: 'running' },
    { id: 'prc-r3', from: 'prc-l2-negativas-preguntas', type: 'typed', prompt: 'Negativa: nosotros no vemos la tele.', sentence: 'We ___ TV tonight.', answer: 'aren\'t watching', alternatives: ['are not watching'] },
    { id: 'prc-r4', from: 'prc-l2-negativas-preguntas', type: 'reorder', prompt: 'Ordena: ¿Estás comiendo?', tokens: ['Are', 'you', 'eating?'], answer: ['Are', 'you', 'eating?'] },
    { id: 'prc-r5', from: 'prc-l3-reto-creativo', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['He', 'is', 'drink', 'orange', 'juice.'], wrongIndex: 2, correction: 'He is drinking orange juice.' },
    { id: 'prc-r6', from: 'prc-l3-reto-creativo', type: 'open', prompt: 'Describe qué hace ahora mismo tu mejor amigo y qué NO hace (2 frases).', hints: ['He/She is ...ing', 'He/She isn\'t ...ing'], modelAnswer: 'My friend is playing video games. She isn\'t studying.' },
  ],
}
