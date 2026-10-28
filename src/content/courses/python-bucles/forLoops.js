export const FOR_RANGE = {
  id: 'py-for-range',
  title: 'Repeticiones conocidas · for y range',
  lessons: [{
    id: 'py-range',
    title: 'Contar con for',
    tutorNotes: ['Traza los valores de i en el tablero antes de ejecutar.', 'Distingue cantidad de vueltas de último valor: el límite final de range no se incluye.'],
    theory: [
      { type: 'text', text: 'Usa `for` cuando sabes cuántas vueltas habrá. `range(1, 5)` produce 1, 2, 3 y 4: el límite 5 no se incluye.' },
      { type: 'code', lang: 'python', text: 'for i in range(1, 4):\n    print(i)\n# muestra 1, 2 y 3 en líneas separadas' },
      { type: 'tip', text: '`range(4)` produce 0, 1, 2, 3. `range(2, 8, 2)` produce 2, 4, 6. El tercer número es el paso; un paso negativo permite contar hacia atrás.' },
    ],
    classExercises: [
      { id: 'py-c-range-1', type: 'choice', classInstruction: 'Cada estudiante anota los valores de i; después pide una justificación.', prompt: '¿Qué valores toma i en for i in range(2, 6)?', options: ['2, 3, 4, 5', '2, 3, 4, 5, 6', '0, 1, 2, 3, 4, 5'], answer: '2, 3, 4, 5' },
      { id: 'py-c-range-2', type: 'choice', classInstruction: 'Pregunta cuántas vueltas habrá antes de mostrar la respuesta.', prompt: '¿Cuántas veces se ejecuta print en for i in range(3)?', options: ['3', '2', '4'], answer: '3' },
      { id: 'py-c-range-3', type: 'open', code: true, codeLanguage: 'Python', classInstruction: 'Pide que cada estudiante escriba el ciclo y prediga su salida antes de revelarla.', prompt: 'Escribe un for que muestre 5, 3, 1, cada número en una línea.', hints: ['Usa un paso de -2 y un límite que no se incluya.'], modelAnswer: 'for i in range(5, 0, -2):\n    print(i)' },
    ],
    exercises: [
      { id: 'py-range-1', type: 'choice', prompt: '¿Qué muestra for i in range(1, 4): print(i), en líneas separadas?', options: ['1, 2, 3', '1, 2, 3, 4', '0, 1, 2, 3'], answer: '1, 2, 3' },
      { id: 'py-range-2', type: 'typed', prompt: '¿Cuántas vueltas ejecuta for i in range(2, 10, 2)? Escribe solo el número.', answer: '4', explanation: 'i toma los valores 2, 4, 6 y 8.' },
      { id: 'py-range-3', type: 'choice', prompt: 'Si necesitas mostrar 1, 2, 3, 4, 5, ¿qué rango usarías?', options: ['range(1, 6)', 'range(1, 5)', 'range(5, 1)'], answer: 'range(1, 6)' },
      { id: 'py-range-4', type: 'open', code: true, codeLanguage: 'Python', prompt: 'Escribe y ejecuta un for que muestre los números pares 2, 4, 6 y 8.', modelAnswer: 'for i in range(2, 10, 2):\n    print(i)' },
    ],
  }],
}

export const FOR_LISTS = {
  id: 'py-for-listas',
  title: 'Recorrer datos · for en listas',
  lessons: [{
    id: 'py-listas',
    title: 'Una vuelta por elemento',
    tutorNotes: ['Contrasta for en range con for en una lista: en la lista la variable toma directamente cada valor, no su posición.'],
    theory: [
      { type: 'text', text: 'Un `for` también recorre una lista. En cada vuelta la variable toma el siguiente elemento. Si la lista está vacía, el cuerpo no se ejecuta.' },
      { type: 'code', lang: 'python', text: 'notas = [3, 5, 2]\nfor nota in notas:\n    print(nota)\n# muestra 3, 5 y 2 en líneas separadas' },
      { type: 'tip', text: '`for nota in notas` entrega el valor de cada nota. `for i in range(len(notas))` entrega posiciones 0, 1, 2; usa posiciones solo si las necesitas.' },
    ],
    classExercises: [
      { id: 'py-c-list-1', type: 'choice', classInstruction: 'Cada estudiante predice la salida completa antes de revelar.', prompt: 'for color in ["rojo", "azul"]: print(color). ¿Qué muestra?', options: ['rojo y luego azul', '0 y luego 1', 'Solo rojo'], answer: 'rojo y luego azul' },
      { id: 'py-c-list-2', type: 'choice', classInstruction: 'Pregunta si entra al cuerpo del ciclo y pide la razón.', prompt: '¿Cuántas vueltas hace for valor in []: print(valor)?', options: ['0', '1', 'Infinitas'], answer: '0' },
      { id: 'py-c-list-3', type: 'open', code: true, codeLanguage: 'Python', classInstruction: 'Escritura individual: cada estudiante propone el ciclo y explica qué vale fruta en cada vuelta.', prompt: 'Escribe un for que muestre cada fruta de ["pera", "uva"].', modelAnswer: 'for fruta in ["pera", "uva"]:\n    print(fruta)' },
    ],
    exercises: [
      { id: 'py-list-1', type: 'choice', prompt: 'En for edad in [12, 18, 25], ¿qué vale edad en la segunda vuelta?', options: ['18', '1', '12'], answer: '18' },
      { id: 'py-list-2', type: 'typed', prompt: '¿Cuántas vueltas realiza for letra in ["a", "b", "c", "d"]? Escribe solo el número.', answer: '4' },
      { id: 'py-list-3', type: 'choice', prompt: 'Si la lista se llama precios, ¿qué ciclo entrega directamente cada precio?', options: ['for precio in precios:', 'for precio in range(0):', 'while precios:'], answer: 'for precio in precios:' },
      { id: 'py-list-4', type: 'open', code: true, codeLanguage: 'Python', prompt: 'Con la lista nombres = ["Ana", "Luis"], muestra cada nombre en una línea. Ejecuta el código y comprueba el orden.', modelAnswer: 'nombres = ["Ana", "Luis"]\nfor nombre in nombres:\n    print(nombre)' },
    ],
  }],
}
