// Estructura lista; ampliar con más lecciones/ejercicios.
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
      ],
      exercises: [
        { id: 'ppc-l1-e1', type: 'choice', prompt: 'Elige la forma correcta.', sentence: 'She ___ been working since 8 a.m.', options: ['have', 'has', 'is'], answer: 'has' },
        { id: 'ppc-l1-e2', type: 'choice', prompt: 'Elige for o since.', sentence: 'They have been waiting ___ two hours.', options: ['for', 'since'], answer: 'for' },
        { id: 'ppc-l1-e3', type: 'typed', prompt: 'Completa con «study».', sentence: 'We have been ___ all night.', answer: 'studying' },
        { id: 'ppc-l1-e4', type: 'reorder', prompt: 'Ordena: Llevo años viviendo aquí.', tokens: ['I', 'have', 'been', 'living', 'here', 'for', 'years'], answer: ['I', 'have', 'been', 'living', 'here', 'for', 'years'] },
      ],
    },
  ],
}
