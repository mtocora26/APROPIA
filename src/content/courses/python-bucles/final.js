export const FINAL = {
  id: 'py-reto',
  title: 'Reto final · aplicar los bucles',
  lessons: [{
    id: 'py-reto-notas',
    title: 'Programa completo y comprobación',
    tutorNotes: ['Primero pide el plan: entradas, validaciones, vueltas y salida. Después reserva tiempo para programar y probar.', 'El reto acepta soluciones distintas al modelo. Comprueba con n=0 y luego 2; notas -1, 0 y 5.'],
    theory: [
      { type: 'text', text: 'Problema: pide cuántas notas se ingresarán, valida que la cantidad sea positiva y luego lee esa cantidad de notas. Una nota válida está entre 0 y 5, incluidos los extremos.' },
      { type: 'text', text: 'Plan: `while` valida entradas; `for` repite exactamente n lecturas; un acumulador suma las notas y un contador registra aprobados (nota >= 3). Calcula el promedio al terminar.' },
      { type: 'tip', text: 'Prueba n = 0 y luego 2. Para el primer estudiante escribe -1 y luego 0; para el segundo escribe 5. Debe mostrar promedio 2.5 y 1 aprobado. Se suponen entradas numéricas.' },
    ],
    classExercises: [
      { id: 'py-c-final-1', type: 'choice', classInstruction: 'Pregunta cuál estructura corresponde a cada tarea antes de mostrar el modelo.', prompt: '¿Qué ciclo se usa para pedir de nuevo n mientras n <= 0?', options: ['while', 'for', 'Ninguno'], answer: 'while' },
      { id: 'py-c-final-2', type: 'choice', classInstruction: 'Pide justificar por qué el promedio se calcula una vez al terminar.', prompt: 'Si n = 2 y las notas son 0 y 5, ¿cuál es el promedio?', options: ['2.5', '5', '0'], answer: '2.5' },
      { id: 'py-c-final-3', type: 'open', code: true, codeLanguage: 'Python', classInstruction: 'Trabajo individual: escribe y ejecuta el programa completo en tu entorno de Python. Pide probar el caso límite antes de revelar el modelo.', practiceMinutes: 30, prompt: 'Crea el programa completo: valida n > 0, pide n notas válidas entre 0 y 5, y muestra el promedio y cuántas notas son >= 3. Prueba n = 0, una nota -1 y las notas 0 y 5.', hints: ['Usa un while para n, un for para las n notas y un while dentro del for para cada nota inválida.'], modelAnswer: 'n = int(input("Cantidad de notas: "))\nwhile n <= 0:\n    n = int(input("Ingresa una cantidad positiva: "))\ntotal = 0\naprobados = 0\nfor i in range(n):\n    nota = int(input("Nota de 0 a 5: "))\n    while nota < 0 or nota > 5:\n        nota = int(input("Nota válida de 0 a 5: "))\n    total += nota\n    if nota >= 3:\n        aprobados += 1\nprint("Promedio:", total / n)\nprint("Aprobados:", aprobados)' },
    ],
    exercises: [
      { id: 'py-final-codigo', type: 'open', code: true, codeLanguage: 'Python', practiceMinutes: 30, prompt: 'RETO INDIVIDUAL: pide n > 0. Luego pide n notas enteras entre 0 y 5, repitiendo cada lectura inválida. Muestra el promedio y cuántos aprobaron (nota >= 3). Ejecútalo con n = 0, luego n = 2 y notas -1, 0 y 5 antes de ver el modelo.', hints: ['while valida n y cada nota.', 'for repite exactamente n veces.', 'Calcula el promedio después del for.'], modelAnswer: 'n = int(input("Cantidad de notas: "))\nwhile n <= 0:\n    n = int(input("Ingresa una cantidad positiva: "))\ntotal = 0\naprobados = 0\nfor i in range(n):\n    nota = int(input("Nota de 0 a 5: "))\n    while nota < 0 or nota > 5:\n        nota = int(input("Nota válida de 0 a 5: "))\n    total += nota\n    if nota >= 3:\n        aprobados += 1\nprint("Promedio:", total / n)\nprint("Aprobados:", aprobados)' },
      { id: 'py-final-1', type: 'choice', prompt: '¿Por qué se exige n > 0 antes del for?', options: ['Para evitar dividir entre cero al calcular el promedio', 'Porque for no acepta variables', 'Para saltar una nota'], answer: 'Para evitar dividir entre cero al calcular el promedio' },
      { id: 'py-final-2', type: 'choice', prompt: 'Si se prueban las notas 0 y 5 con n = 2, ¿qué debe mostrar el programa?', options: ['Promedio 2.5 y 1 aprobado', 'Promedio 5 y 2 aprobados', 'Promedio 2.5 y 2 aprobados'], answer: 'Promedio 2.5 y 1 aprobado' },
      { id: 'py-final-3', type: 'choice', prompt: '¿Dónde debe ir total += nota?', options: ['Dentro del for, después de validar la nota', 'Antes del for', 'Después de calcular el promedio'], answer: 'Dentro del for, después de validar la nota' },
    ],
  }],
}
