// Programas de ejemplo para el laboratorio, uno por tema del curso.
export const EXAMPLES = Object.freeze([
  {
    id: 'variables',
    title: 'Variables: x cambia en cada línea',
    code: 'Algoritmo Variables\n    Definir x Como Entero;\n    x <- 2;\n    x <- x + 3;\n    x <- x * 2;\n    Escribir x;\nFinAlgoritmo',
  },
  {
    id: 'si',
    title: 'Si / Sino: aprueba o no',
    code: 'Algoritmo PrimerosPasos\n    Definir nota Como Real;\n    Leer nota;\n    Si nota >= 3 Entonces\n        Escribir "Aprueba";\n    Sino\n        Escribir "No aprueba";\n    FinSi;\nFinAlgoritmo',
  },
  {
    id: 'logica',
    title: 'Y / O: rango de edad',
    code: 'Algoritmo EdadValida\n    Definir edad Como Entero;\n    Leer edad;\n    Si (edad >= 18) Y (edad <= 65) Entonces\n        Escribir "Edad válida";\n    Sino\n        Escribir "Edad inválida";\n    FinSi;\nFinAlgoritmo',
  },
  {
    id: 'mientras',
    title: 'Mientras: suma con centinela (-1)',
    code: 'Algoritmo SumaConCentinela\n    Definir nota, suma, contador Como Real;\n    suma <- 0;\n    contador <- 0;\n    Leer nota;\n    Mientras nota <> -1 Hacer\n        suma <- suma + nota;\n        contador <- contador + 1;\n        Leer nota;\n    FinMientras;\n    Escribir "Suma: ", suma, " en ", contador, " notas";\nFinAlgoritmo',
  },
  {
    id: 'repetir',
    title: 'Repetir: pedir hasta que sea válido',
    code: 'Algoritmo NotaValida\n    Definir nota Como Real;\n    Repetir\n        Escribir "Nota entre 0 y 5:";\n        Leer nota;\n    Hasta Que (nota >= 0) Y (nota <= 5);\n    Escribir "Quedó guardada la nota ", nota;\nFinAlgoritmo',
  },
  {
    id: 'para',
    title: 'Para: contar hacia atrás',
    code: 'Algoritmo CuentaRegresiva\n    Definir i Como Entero;\n    Para i <- 5 Hasta 1 Con Paso -1 Hacer\n        Escribir i;\n    FinPara;\n    Escribir "¡Listo!";\nFinAlgoritmo',
  },
])
