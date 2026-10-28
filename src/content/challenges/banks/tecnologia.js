import { choice, explain, match, typed } from '../build.js'

export const TECNOLOGIA = {
  id: 'tecnologia',
  title: 'Tecnología e IA',
  subtitle: 'Cómo funcionan los computadores, internet y la IA',
  language: 'es',
  questions: [
    choice('te-1', '¿Qué hace un modelo de lenguaje como ChatGPT o Gemini?', ['Predice texto a partir de patrones que aprendió', 'Busca la respuesta exacta en una base de datos', 'Piensa igual que una persona'], 'Predice texto a partir de patrones que aprendió', 'Genera palabra por palabra lo más probable según lo que aprendió.'),
    choice('te-2', '¿Qué es una «alucinación» de una IA?', ['Una respuesta que suena segura pero es falsa', 'Un error de conexión', 'Una imagen generada'], 'Una respuesta que suena segura pero es falsa', 'Por eso hay que verificar lo que responde.'),
    choice('te-3', '¿Cuál de estas unidades es la más grande?', ['Gigabyte', 'Megabyte', 'Kilobyte'], 'Gigabyte', 'Kilo, mega, giga: cada una es unas mil veces la anterior.'),
    choice('te-4', '¿Cuál es la contraseña más segura?', ['Una frase larga con letras, números y símbolos', 'Tu fecha de nacimiento', 'La misma que usas en todas tus cuentas'], 'Una frase larga con letras, números y símbolos', 'La longitud y la variedad la hacen difícil de adivinar.'),
    choice('te-5', '¿Para qué sirve el modo incógnito del navegador?', ['Para no guardar tu historial en ese equipo', 'Para ser invisible en internet', 'Para navegar más rápido'], 'Para no guardar tu historial en ese equipo', 'Tu proveedor y las páginas que visitas igual pueden verte.'),
    choice('te-6', '¿Qué guarda la memoria RAM?', ['Lo que el computador está usando en ese momento', 'Tus archivos para siempre', 'Las páginas de internet'], 'Lo que el computador está usando en ese momento', 'Al apagar, la RAM se borra; el disco no.'),
    typed('te-7', '¿Cuántos bits tiene un byte?', '8', ['ocho'], 'Un byte son 8 bits.'),
    typed('te-8', 'Completa la frase.', 'procesador', ['CPU', 'el procesador'], 'El procesador (CPU) ejecuta las instrucciones de los programas.', 'La pieza del computador que ejecuta las instrucciones es el ___.'),
    match('te-9', 'Relaciona cada sigla con lo que es.', [['CPU', 'Procesador'], ['RAM', 'Memoria de trabajo'], ['URL', 'Dirección de una página web']], 'Siglas que verás en cualquier computador.'),
    match('te-10', 'Relaciona cada término con su significado.', [['Wi-Fi', 'Conexión inalámbrica'], ['La nube', 'Servidores en internet'], ['Algoritmo', 'Pasos para resolver un problema']], '«La nube» son computadores de otros, conectados a internet.'),
    explain('te-11', '¿Por qué no conviene copiar la respuesta de una IA sin revisarla?', 'Porque puede equivocarse o inventar datos, y si no la entiendes no aprendes: hay que verificarla y entenderla.', ['¿La IA siempre tiene la razón?']),
    explain('te-12', '¿Qué diferencia hay entre usar la IA para obtener la respuesta y usarla para aprender?', 'Para obtener la respuesta solo copias el resultado; para aprender la usas para practicar, que te explique o te corrija, y el razonamiento lo haces tú.', ['¿Quién piensa en cada caso?']),
  ],
}
