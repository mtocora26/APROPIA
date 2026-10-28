export const BASE = {
  id: 'py-base',
  title: 'Antes de repetir',
  lessons: [{
    id: 'py-base-trazas',
    title: 'Variables, trazas y sangría',
    tutorNotes: ['Abre un entorno de Python aparte para ejecutar los ejemplos: APROPIA muestra y compara código, pero no lo ejecuta.', 'Pide el valor de la variable después de cada línea; no pases a bucles si la asignación todavía confunde.', 'La sangría determina qué instrucciones pertenecen al bloque.'],
    theory: [
      { type: 'text', text: 'Una variable guarda un valor. `x = x + 1` usa el valor anterior y lo reemplaza. Para seguir un programa, anota el valor de cada variable después de cada línea.' },
      { type: 'code', lang: 'python', text: 'x = 2\nx = x + 3\nprint(x)  # muestra 5' },
      { type: 'tip', text: 'En Python los espacios al inicio de la línea son parte del programa. Cuatro espacios indican que una instrucción está dentro de un bloque. No mezcles sangrías distintas.' },
    ],
    classExercises: [
      { id: 'py-c-base-1', type: 'choice', classInstruction: 'Muestra el código. Cada estudiante escribe el valor final antes de responder.', prompt: '¿Qué muestra este programa?', snippetLang: 'python', snippet: 'x = 4\nx = x * 2\nx = x - 1\nprint(x)', options: ['7', '8', '3'], answer: '7' },
      { id: 'py-c-base-2', type: 'choice', classInstruction: 'Solicita que alguien explique qué línea cambió el valor de x.', prompt: '¿Qué muestra print(x)?', snippetLang: 'python', snippet: 'x = 3\nprint(x)\nx = 8', options: ['3', '8', '11'], answer: '3' },
      { id: 'py-c-base-3', type: 'open', classInstruction: 'Pide una explicación individual en una frase; revela el modelo después de escucharla.', prompt: '¿Por qué print(x) sangrado bajo un bucle se ejecuta varias veces y print(x) sin sangría solo al terminar?', modelAnswer: 'La sangría pone print(x) dentro del cuerpo del bucle. Sin sangría queda fuera y se ejecuta una sola vez al terminar.' },
    ],
    exercises: [
      { id: 'py-base-1', type: 'choice', prompt: '¿Cuál es el valor final de x?', snippetLang: 'python', snippet: 'x = 1\nx = x + 2\nx = x * 3', options: ['9', '7', '6'], answer: '9', explanation: 'Primero 1 + 2 = 3; luego 3 * 3 = 9.' },
      { id: 'py-base-2', type: 'typed', prompt: 'Escribe el valor que muestra print(x).', snippetLang: 'python', snippet: 'x = 10\nx = x - 4\nx = x + 1\nprint(x)', answer: '7' },
      { id: 'py-base-3', type: 'choice', prompt: '¿Qué indica que una línea pertenece al cuerpo de un bucle en Python?', options: ['La sangría', 'Un punto y coma', 'Las llaves { }'], answer: 'La sangría' },
      { id: 'py-base-4', type: 'open', code: true, codeLanguage: 'Python', prompt: 'Escribe un programa que guarde 2 en x, le sume 4 y muestre el resultado. Ejecútalo: debe mostrar 6.', modelAnswer: 'x = 2\nx = x + 4\nprint(x)' },
    ],
  }],
}
