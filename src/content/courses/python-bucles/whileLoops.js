export const WHILE = {
  id: 'py-while',
  title: 'Repeticiones con condición · while',
  lessons: [{
    id: 'py-while-condicion',
    title: 'Condición, avance y salida',
    tutorNotes: ['Señala la línea que cambia la condición. Prueba también un valor inicial que haga cero vueltas.', 'Evita pedir la salida de un bucle infinito; pregunta qué línea falta para terminar.'],
    theory: [
      { type: 'text', text: '`while` comprueba la condición antes de cada vuelta. Si empieza siendo falsa, no entra. Dentro del bucle debe cambiar algo para poder terminar.' },
      { type: 'code', lang: 'python', text: 'numero = 1\nwhile numero <= 3:\n    print(numero)\n    numero += 1\n# muestra 1, 2 y 3' },
      { type: 'tip', text: 'Si olvidas `numero += 1`, la condición puede permanecer verdadera para siempre. Compara: `for` cuando sabes cuántas vueltas; `while` cuando dependes de una condición de salida.' },
    ],
    classExercises: [
      { id: 'py-c-while-1', type: 'choice', classInstruction: 'Cada estudiante cuenta las vueltas con una tabla de valores.', prompt: '¿Cuántas vueltas ejecuta?', snippetLang: 'python', snippet: 'x = 2\nwhile x < 5:\n    x += 1', options: ['3', '2', '4'], answer: '3' },
      { id: 'py-c-while-2', type: 'choice', classInstruction: 'Pide justificar si la condición permite entrar siquiera una vez.', prompt: '¿Cuántas veces se imprime x?', snippetLang: 'python', snippet: 'x = 5\nwhile x < 5:\n    print(x)', options: ['0', '1', 'Infinitas'], answer: '0' },
      { id: 'py-c-while-3', type: 'open', code: true, codeLanguage: 'Python', classInstruction: 'Pide escribir la línea que falta; revela solo después de que hayan identificado el error.', prompt: 'Completa el ciclo para que muestre 0, 1 y 2 y termine. ¿Qué línea falta dentro?', snippetLang: 'python', snippet: 'x = 0\nwhile x < 3:\n    print(x)\n    # falta una línea aquí', hints: ['x debe cambiar antes de la siguiente evaluación.'], modelAnswer: 'x = 0\nwhile x < 3:\n    print(x)\n    x += 1' },
    ],
    exercises: [
      { id: 'py-while-1', type: 'typed', prompt: '¿Cuál es el valor de x al salir? Escribe solo el número.', snippetLang: 'python', snippet: 'x = 1\nwhile x <= 4:\n    x += 1', answer: '5' },
      { id: 'py-while-2', type: 'choice', prompt: '¿Cuántas vueltas se ejecutan?', snippetLang: 'python', snippet: 'x = 10\nwhile x < 3:\n    print(x)', options: ['0', '1', '10'], answer: '0' },
      { id: 'py-while-3', type: 'choice', prompt: '¿Qué falta en este ciclo para que termine?', snippetLang: 'python', snippet: 'x = 1\nwhile x <= 3:\n    print(x)', options: ['Actualizar x dentro del while', 'Cambiar print por input', 'Añadir un punto y coma'], answer: 'Actualizar x dentro del while' },
      { id: 'py-while-4', type: 'open', code: true, codeLanguage: 'Python', prompt: 'Escribe un while que muestre 3, 2, 1 y termine. Ejecuta y comprueba que no muestra 0.', modelAnswer: 'x = 3\nwhile x > 0:\n    print(x)\n    x -= 1' },
    ],
  }],
}

export const INPUT = {
  id: 'py-entradas',
  title: 'Entradas y validación',
  lessons: [{
    id: 'py-validar',
    title: 'Pedir de nuevo hasta recibir un dato válido',
    tutorNotes: ['Aclara que input devuelve texto y se convierte con int para comparar números.', 'Para esta lección se asume entrada numérica; manejar letras se deja fuera del alcance inicial.'],
    theory: [
      { type: 'text', text: '`input()` recibe texto. `int(input())` lo convierte a entero cuando el usuario escribe un número válido. Puedes usar `while` para repetir una pregunta si el número está fuera del rango.' },
      { type: 'code', lang: 'python', text: 'nota = int(input("Nota de 0 a 5: "))\nwhile nota < 0 or nota > 5:\n    nota = int(input("Intenta de nuevo: "))\nprint("Nota válida:", nota)' },
      { type: 'tip', text: 'El valor se lee una vez antes del while y otra vez dentro si es inválido. En este ejemplo se supone que el usuario escribe enteros; una letra produciría un error y requeriría otra lección sobre excepciones.' },
    ],
    classExercises: [
      { id: 'py-c-input-1', type: 'choice', classInstruction: 'Pide evaluar la condición con una entrada concreta.', prompt: 'Si nota vale -1, ¿nota < 0 or nota > 5 es verdadera?', options: ['Sí', 'No'], answer: 'Sí' },
      { id: 'py-c-input-2', type: 'choice', classInstruction: 'Pregunta cuántas veces se pediría el dato antes de revelar.', prompt: 'Se escriben 7, -2 y luego 4. ¿Cuántas lecturas hace el programa?', options: ['3', '2', '4'], answer: '3' },
      { id: 'py-c-input-3', type: 'open', code: true, codeLanguage: 'Python', classInstruction: 'Cada estudiante escribe la condición y prueba los valores 0, 1 y 6.', prompt: 'Escribe el while para volver a pedir una edad entera si es menor que 0 o mayor que 120. Supón entradas numéricas.', hints: ['Lee la edad antes y dentro del ciclo.'], modelAnswer: 'edad = int(input("Edad: "))\nwhile edad < 0 or edad > 120:\n    edad = int(input("Edad válida: "))' },
    ],
    exercises: [
      { id: 'py-input-1', type: 'choice', prompt: 'Si input("Edad: ") devuelve "18", ¿qué valor numérico produce int(input("Edad: "))?', options: ['18 como entero', '"18" como texto', 'Un valor lógico'], answer: '18 como entero' },
      { id: 'py-input-2', type: 'choice', prompt: '¿Cuál condición repite si opcion NO está entre 1 y 3?', options: ['opcion < 1 or opcion > 3', 'opcion >= 1 and opcion <= 3', 'opcion < 1 and opcion > 3'], answer: 'opcion < 1 or opcion > 3' },
      { id: 'py-input-3', type: 'typed', prompt: 'Con entradas 6, -1 y 5 para la nota, ¿cuántas veces se lee? Escribe solo el número.', answer: '3' },
      { id: 'py-input-4', type: 'open', code: true, codeLanguage: 'Python', prompt: 'Pide un número entero positivo (mayor que cero) hasta que sea válido. Prueba 0, -3 y 2. Supón entradas numéricas.', modelAnswer: 'n = int(input("Cantidad: "))\nwhile n <= 0:\n    n = int(input("Debe ser positiva: "))\nprint(n)' },
    ],
  }],
}
