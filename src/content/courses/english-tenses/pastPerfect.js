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
        { type: 'scene', title: 'Primero una, después otra', items: [
          { emoji: '🎬', text: 'The movie had already started.', translation: 'La película ya había empezado. (primero)' },
          { emoji: '🏃', text: 'When I arrived...', translation: 'Cuando llegué... (después)' },
          { emoji: '🍕', text: 'She had eaten before I called.', translation: 'Ella había comido antes de que yo llamara.' },
        ] },
        { type: 'timeline', title: 'Dos hechos en el pasado', now: 90, events: [
          { emoji: '🎬', label: 'The movie had started (Past Perfect, antes)', from: 25 },
          { emoji: '🏃', label: 'I arrived (Past Simple, después)', from: 55 },
        ] },
      ],
      exercises: [
        { id: 'pas-l1-e1', type: 'choice', prompt: 'Elige la forma correcta.', sentence: 'When we got there, they ___ already left.', options: ['have', 'had', 'were'], answer: 'had' },
        { id: 'pas-l1-e2', type: 'typed', prompt: 'Completa con «eat» en Past Perfect.', sentence: 'She had ___ before I called.', answer: 'eaten' },
        { id: 'pas-l1-e3', type: 'typed', prompt: 'Forma negativa de «finish».', sentence: 'He ___ his homework.', answer: 'hadn\'t finished', alternatives: ['had not finished'] },
        { id: 'pas-l1-e4', type: 'reorder', prompt: 'Ordena: Ya habíamos comido cuando llegó.', tokens: ['We', 'had', 'already', 'eaten', 'when', 'he', 'arrived'], answer: ['We', 'had', 'already', 'eaten', 'when', 'he', 'arrived'] },
        { id: 'pas-l1-e5', type: 'choice', prompt: '¿Qué ocurrió primero? «I had finished before she called.»', options: ['I finished', 'She called'], answer: 'I finished' },
        { id: 'pas-l1-e6', type: 'open', prompt: 'Traducción libre: «Cuando llegué, la reunión ya había terminado.»', hints: ['arrive', 'meeting', 'already'], modelAnswer: 'When I arrived, the meeting had already finished.' },
      ],
    },
    {
      id: 'pas-l2-negativas-preguntas',
      title: 'Negativas y preguntas',
      theory: [
        { type: 'text', text: 'Negativa: hadn\'t + participio. Pregunta: Had + sujeto + participio? Respuestas cortas: Yes, I had. / No, they hadn\'t.' },
        { type: 'table', columns: ['Palabra', 'Significado', 'Ejemplo'], rows: [
          ['already', 'ya', 'She had already gone.'],
          ['before', 'antes (de)', 'I had met him before.'],
          ['by the time', 'para cuando', 'By the time we came, he had left.'],
          ['after', 'después de que', 'After she had eaten, she slept.'],
          ['never ... before', 'nunca antes', 'I had never seen snow before.'],
          ['just / yet', 'justo / todavía', 'They hadn\'t arrived yet.'],
        ] },
        { type: 'example', text: 'Had you eaten when she called? No, I hadn\'t.', translation: '¿Habías comido cuando ella llamó? No, no había comido.' },
        { type: 'tip', text: 'En la respuesta corta solo repites had: «Yes, I had.» o «No, I hadn\'t.»' },
        { type: 'scene', title: 'Antes de que llegara...', items: [
          { emoji: '🚌', text: 'The bus had already left.', translation: 'El bus ya se había ido.' },
          { emoji: '😴', text: 'I hadn\'t slept before the exam.', translation: 'No había dormido antes del examen.' },
          { emoji: '❓', text: 'Had you met her before?', translation: '¿La habías conocido antes?' },
        ] },
        { type: 'timeline', title: 'Lo que NO había pasado todavía', now: 90, events: [
          { emoji: '🏠', label: 'She hadn\'t arrived (aún no)', from: 30 },
          { emoji: '🔔', label: 'The party started', from: 50 },
          { emoji: '🚪', label: 'She arrived (después)', from: 70 },
        ] },
      ],
      exercises: [
        { id: 'pas-l2-e1', type: 'choice', prompt: 'Elige la forma correcta.', sentence: '___ they finished the project before the deadline?', options: ['Had', 'Have', 'Did'], answer: 'Had' },
        { id: 'pas-l2-e2', type: 'typed', prompt: 'Negativa. Yo no había visto esa serie antes.', sentence: 'I ___ seen that show before.', answer: 'hadn\'t', alternatives: ['had not'] },
        { id: 'pas-l2-e3', type: 'typed', prompt: 'Respuesta corta. «Had she left?» — Sí.', sentence: 'Yes, ___.', answer: 'she had' },
        { id: 'pas-l2-e4', type: 'reorder', prompt: 'Ordena: ¿Habías estado allí antes?', tokens: ['Had', 'you', 'been', 'there', 'before?'], answer: ['Had', 'you', 'been', 'there', 'before?'] },
        { id: 'pas-l2-e5', type: 'match', prompt: 'Une la expresión con su significado.', pairs: [['already', 'ya'], ['by the time', 'para cuando'], ['before', 'antes'], ['after', 'después de que']] },
        { id: 'pas-l2-e6', type: 'choice', prompt: '¿Qué ocurrió primero? «By the time he got home, we had eaten.»', options: ['We ate', 'He got home'], answer: 'We ate' },
        { id: 'pas-l2-e7', type: 'open', prompt: 'Pregúntale a alguien si ya había hecho algo antes de cierto momento, y respóndete con una respuesta corta.', hints: ['Had you ... before ...?', 'Yes, I had. / No, I hadn\'t.'], modelAnswer: 'Had you studied English before you moved here? No, I hadn\'t.' },
      ],
    },
    {
      id: 'pas-l3-reto-creativo',
      title: 'Reto creativo',
      theory: [
        { type: 'text', text: 'Practica con errores típicos: usar have en vez de had, participios irregulares y olvidar cuál acción fue primera. La acción más antigua va en Past Perfect; la más reciente, en Past Simple.' },
        { type: 'table', columns: ['Error', 'Correcto'], rows: [
          ['When I arrived, she have left.', 'When I arrived, she had left.'],
          ['He had went home.', 'He had gone home.'],
          ['After I had eaten, I have slept.', 'After I had eaten, I slept.'],
        ] },
        { type: 'example', text: 'I couldn\'t get in because I had forgotten my keys.', translation: 'No pude entrar porque había olvidado mis llaves.' },
        { type: 'tip', text: 'Past Perfect explica el porqué de algo que pasó: «I was late because I had missed the bus.»' },
        { type: 'scene', title: 'Causa y consecuencia', items: [
          { emoji: '🔑', text: 'I had forgotten my keys.', translation: 'Había olvidado mis llaves.' },
          { emoji: '🚪', text: 'I couldn\'t open the door.', translation: 'No pude abrir la puerta.' },
          { emoji: '🌧️', text: 'It had rained, so the street was wet.', translation: 'Había llovido, así que la calle estaba mojada.' },
        ] },
        { type: 'timeline', title: 'Causa antes, resultado después', now: 90, events: [
          { emoji: '🚌', label: 'I had missed the bus (causa)', from: 30 },
          { emoji: '⏰', label: 'I was late for class (resultado)', from: 60 },
        ] },
      ],
      exercises: [
        { id: 'pas-l3-e1', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['When', 'we', 'arrived,', 'they', 'have', 'left.'], wrongIndex: 4, correction: 'When we arrived, they had left.' },
        { id: 'pas-l3-e2', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['She', 'had', 'wrote', 'the', 'letter', 'before', 'noon.'], wrongIndex: 2, correction: 'She had written the letter before noon.' },
        { id: 'pas-l3-e3', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['After', 'he', 'had', 'finished,', 'he', 'has', 'gone', 'out.'], wrongIndex: 5, correction: 'After he had finished, he went out.' },
        { id: 'pas-l3-e4', type: 'choice', prompt: 'Elige la oración correcta.', options: ['I was tired because I have worked all day.', 'I was tired because I had worked all day.', 'I was tired because I had work all day.'], answer: 'I was tired because I had worked all day.' },
        { id: 'pas-l3-e5', type: 'dialogue', prompt: 'Llegas tarde a una reunión. Completa la conversación.', lines: [
          { who: 'Boss', text: 'Why are you late?' },
          { who: 'You', options: ['The train had broken down.', 'The train has broke down.', 'The train had break down.'], answer: 'The train had broken down.' },
          { who: 'Boss', text: 'Had the meeting started when you got here?' },
          { who: 'You', options: ['No, it hadn\'t.', 'No, it hasn\'t.', 'No, it didn\'t had.'], answer: 'No, it hadn\'t.' },
        ] },
        { id: 'pas-l3-e6', type: 'open', prompt: 'Creativo: cuenta qué había pasado antes de que llegaras a un lugar (casa, fiesta, clase).', hints: ['When I arrived, ... had ...', 'because ... had ...'], modelAnswer: 'When I arrived at the party, everyone had already eaten, so I was very hungry.' },
        { id: 'pas-l3-e7', type: 'open', prompt: 'Creativo: inventa una mini historia de misterio con dos cosas que habían pasado antes de descubrir algo.', hints: ['Before I opened the door, ...', 'Someone had ...'], modelAnswer: 'Before I opened the door, someone had broken the window and had taken my laptop.' },
      ],
    },
  ],
  // Repaso del módulo: ejercicios distintos a los de las lecciones, en otros contextos.
  reviewExercises: [
    { id: 'pas-r1', from: 'pas-l1-estructura', type: 'choice', prompt: 'En el cine: «Cuando entramos, la película ya había comenzado».', options: ['When we entered, the film had already begun.', 'When we entered, the film has already begun.', 'When we entered, the film had already began.'], answer: 'When we entered, the film had already begun.' },
    { id: 'pas-r2', from: 'pas-l1-estructura', type: 'typed', prompt: 'Participio de «take». Él ya había tomado el café.', sentence: 'He had already ___ his coffee.', answer: 'taken' },
    { id: 'pas-r3', from: 'pas-l2-negativas-preguntas', type: 'reorder', prompt: 'Ordena: No habíamos comido nada.', tokens: ['We', 'hadn\'t', 'eaten', 'anything.'], answer: ['We', 'hadn\'t', 'eaten', 'anything.'] },
    { id: 'pas-r4', from: 'pas-l2-negativas-preguntas', type: 'typed', prompt: 'Pregunta. ¿Había terminado ella el examen?', sentence: '___ she finished the exam?', answer: 'Had' },
    { id: 'pas-r5', from: 'pas-l3-reto-creativo', type: 'hunt', prompt: 'Detective: toca la palabra incorrecta.', tokens: ['I', 'had', 'saw', 'him', 'before.'], wrongIndex: 2, correction: 'I had seen him before.' },
    { id: 'pas-r6', from: 'pas-l3-reto-creativo', type: 'open', prompt: 'Explica por qué estabas cansado ayer usando «because» y Past Perfect.', hints: ['I was tired because ...', 'had ...'], modelAnswer: 'I was tired yesterday because I had not slept well the night before.' },
  ],
}
