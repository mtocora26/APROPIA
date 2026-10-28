import { choice, explain, match, typed } from '../build.js'

export const PROGRAMACION = {
  id: 'programacion',
  title: 'Programación',
  subtitle: 'Variables, ciclos y decisiones, en cualquier lenguaje',
  language: 'es',
  questions: [
    choice('pr-1', '¿Qué es un algoritmo?', ['Una serie de pasos ordenados para resolver un problema', 'Un lenguaje de programación', 'Una pieza del computador'], 'Una serie de pasos ordenados para resolver un problema', 'Un algoritmo existe antes del código: es la receta.'),
    choice('pr-2', 'Si x vale 5 y luego se hace x = x + 2, ¿cuánto vale x?', ['7', '5', '2', '52'], '7', 'Se toma el valor actual (5), se le suma 2 y se guarda de nuevo en x.'),
    choice('pr-3', '¿Qué tipo de dato es «true»?', ['Booleano', 'Texto', 'Número entero'], 'Booleano', 'Un booleano solo vale verdadero o falso.'),
    choice('pr-4', '¿Para qué sirve un ciclo (bucle)?', ['Para repetir instrucciones', 'Para guardar un dato', 'Para borrar variables'], 'Para repetir instrucciones', 'Un ciclo repite un bloque mientras se cumpla una condición o un número de veces.'),
    choice('pr-5', '¿Cuántas veces se repite un ciclo que va de 1 a 5, de uno en uno?', ['5', '4', '6'], '5', 'Cuenta 1, 2, 3, 4 y 5: cinco vueltas.'),
    choice('pr-6', '¿Qué es un «bug»?', ['Un error en el programa', 'Un virus informático', 'Un tipo de dato'], 'Un error en el programa', 'Encontrar y corregir bugs se llama depurar.'),
    choice('pr-7', '¿Qué hace una instrucción «if» (si)?', ['Ejecuta algo solo si se cumple una condición', 'Repite algo varias veces', 'Muestra un mensaje'], 'Ejecuta algo solo si se cumple una condición', 'El «if» toma decisiones.'),
    typed('pr-8', '¿Cuál es el residuo de dividir 10 entre 3?', '1', ['uno'], '10 = 3 × 3 + 1. En muchos lenguajes se escribe 10 % 3.'),
    typed('pr-9', 'Completa la frase.', 'variable', ['una variable'], 'Una variable tiene un nombre y guarda un valor que puede cambiar.', 'Una ___ guarda un dato que puede cambiar mientras corre el programa.'),
    match('pr-10', 'Relaciona cada dato con su tipo.', [['42', 'Número entero'], ['"hola"', 'Texto'], ['false', 'Booleano']], 'El tipo dice qué se puede hacer con el dato.'),
    explain('pr-11', 'Explica con tus palabras qué es una variable.', 'Un espacio con nombre donde el programa guarda un dato que puede cambiar mientras se ejecuta.', ['¿Qué tiene una variable además de su valor?']),
    explain('pr-12', '¿Por qué conviene dividir un problema grande en partes pequeñas al programar?', 'Porque cada parte es más fácil de entender, probar y corregir, y se puede reutilizar.', ['Piensa en qué pasa cuando algo falla en un programa enorme.']),
  ],
}
