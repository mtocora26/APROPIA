export const CONTROL = {
  id: 'py-control',
  title: 'Control del ciclo y ciclos anidados',
  lessons: [{
    id: 'py-break-continue',
    title: 'break, continue y dos bucles',
    tutorNotes: ['Compara break (sale del ciclo) con continue (salta solo al siguiente turno).', 'Usa una cuadrícula de 2 filas por 3 columnas para explicar la anidación.'],
    theory: [
      { type: 'text', text: '`break` termina el ciclo inmediatamente. `continue` salta el resto de la vuelta actual y pasa a la siguiente. Úsalos solo si dejan más clara la intención.' },
      { type: 'code', lang: 'python', text: 'for n in range(1, 5):\n    if n == 3:\n        continue\n    print(n)  # muestra 1, 2, 4' },
      { type: 'text', text: 'En ciclos anidados, por cada vuelta del ciclo exterior se ejecuta completo el interior. Dos filas y tres columnas producen 2 × 3 = 6 pares de valores.' },
    ],
    classExercises: [
      { id: 'py-c-control-1', type: 'choice', classInstruction: 'Pide la secuencia exacta y pregunta dónde termina el ciclo.', prompt: '¿Qué números imprime, en líneas separadas?', snippetLang: 'python', snippet: 'for n in range(1, 5):\n    if n == 3:\n        break\n    print(n)', options: ['1, 2', '1, 2, 4', '1, 2, 3'], answer: '1, 2' },
      { id: 'py-c-control-2', type: 'choice', classInstruction: 'Pide contrastar la salida con break y explicar la diferencia.', prompt: '¿Qué números imprime, en líneas separadas?', snippetLang: 'python', snippet: 'for n in range(1, 5):\n    if n == 3:\n        continue\n    print(n)', options: ['1, 2, 4', '1, 2', '3, 4'], answer: '1, 2, 4' },
      { id: 'py-c-control-3', type: 'choice', classInstruction: 'Dibuja 2 filas y 3 columnas. Cada estudiante cuenta los pares antes de revelar.', prompt: '¿Cuántas líneas imprime este programa?', snippetLang: 'python', snippet: 'for fila in range(2):\n    for columna in range(3):\n        print(fila, columna)', options: ['6', '5', '3'], answer: '6' },
    ],
    exercises: [
      { id: 'py-control-1', type: 'choice', prompt: '¿Qué hace break dentro de un for?', options: ['Termina todo el for', 'Salta solo una vuelta', 'Reinicia el for'], answer: 'Termina todo el for' },
      { id: 'py-control-2', type: 'choice', prompt: '¿Qué números muestra, en líneas separadas?', snippetLang: 'python', snippet: 'for n in range(1, 5):\n    if n == 2:\n        continue\n    print(n)', options: ['1, 3, 4', '1', '1, 2, 3, 4'], answer: '1, 3, 4' },
      { id: 'py-control-3', type: 'typed', prompt: 'Un for exterior hace 3 vueltas y el interior 2 por cada una. ¿Cuántas veces se ejecuta el cuerpo interior? Escribe el número.', answer: '6' },
      { id: 'py-control-4', type: 'open', code: true, codeLanguage: 'Python', prompt: 'Muestra 1, 2, 4, 5 con un for de 1 a 5 que use continue para saltar 3. Ejecútalo y comprueba que termina.', modelAnswer: 'for n in range(1, 6):\n    if n == 3:\n        continue\n    print(n)' },
    ],
  }],
}
