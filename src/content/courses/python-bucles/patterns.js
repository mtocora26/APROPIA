export const PATTERNS = {
  id: 'py-patrones',
  title: 'Patrones · sumar y contar',
  lessons: [{
    id: 'py-acumular',
    title: 'Acumulador, contador y promedio',
    tutorNotes: ['Escribe una tabla con columnas valor, suma y cantidad; pide completarla vuelta por vuelta.', 'Pregunta por qué se divide fuera del ciclo y qué ocurre si la lista está vacía.'],
    theory: [
      { type: 'text', text: 'Un acumulador suma valores distintos (`total += nota`); un contador cuenta eventos (`cantidad += 1`). Ambos comienzan en cero antes del bucle.' },
      { type: 'code', lang: 'python', text: 'total = 0\naprobados = 0\nfor nota in [2, 3, 5]:\n    total += nota\n    if nota >= 3:\n        aprobados += 1\nprint(total, aprobados)  # 10 2' },
      { type: 'tip', text: 'El promedio es total / cantidad, después del bucle. Antes de dividir, comprueba que cantidad sea mayor que 0. No confundas contar notas con sumar sus valores.' },
    ],
    classExercises: [
      { id: 'py-c-pat-1', type: 'choice', classInstruction: 'Completen individualmente una traza de total para los datos 1, 4 y 2.', prompt: 'total empieza en 0 y suma [1, 4, 2]. ¿Cuál es el valor final?', options: ['7', '3', '4'], answer: '7' },
      { id: 'py-c-pat-2', type: 'choice', classInstruction: 'Pide distinguir el contador del acumulador en voz alta.', prompt: 'Para [1, 4, 2], ¿cuántos valores son mayores o iguales a 2?', options: ['2', '7', '3'], answer: '2' },
      { id: 'py-c-pat-3', type: 'open', code: true, codeLanguage: 'Python', classInstruction: 'Cada estudiante escribe el código y prueba también una lista vacía antes de compararlo.', prompt: 'Con valores = [4, 6], calcula y muestra el promedio sin dividir entre cero si la lista está vacía.', hints: ['Usa len(valores) > 0 antes de dividir.'], modelAnswer: 'valores = [4, 6]\nif len(valores) > 0:\n    total = 0\n    for valor in valores:\n        total += valor\n    print(total / len(valores))' },
    ],
    exercises: [
      { id: 'py-pat-1', type: 'typed', prompt: 'Escribe el valor final de total.', snippetLang: 'python', snippet: 'total = 0\nfor n in [2, 5, 1]:\n    total += n', answer: '8' },
      { id: 'py-pat-2', type: 'choice', prompt: 'Para contar cuántas notas aprueban, ¿qué instrucción va dentro del if nota >= 3?', options: ['aprobados += 1', 'aprobados += nota', 'aprobados = 0'], answer: 'aprobados += 1' },
      { id: 'py-pat-3', type: 'choice', prompt: 'Con notas = [], ¿qué debes verificar antes de calcular sum(notas) / len(notas)?', options: ['Que len(notas) > 0', 'Que sum(notas) > 0', 'Que la primera nota sea 0'], answer: 'Que len(notas) > 0' },
      { id: 'py-pat-4', type: 'open', code: true, codeLanguage: 'Python', prompt: 'Con notas = [2, 3, 4], calcula la suma y el número de aprobados (nota >= 3). Muestra ambos; prueba el programa.', modelAnswer: 'notas = [2, 3, 4]\ntotal = 0\naprobados = 0\nfor nota in notas:\n    total += nota\n    if nota >= 3:\n        aprobados += 1\nprint(total, aprobados)' },
    ],
  }],
}
