import { choice, explain, match, typed } from '../build.js'

export const LOGICA = {
  id: 'logica',
  title: 'Lógica rápida',
  subtitle: 'Series, acertijos y trampas para pensar rápido',
  language: 'es',
  questions: [
    choice('lo-1', '¿Qué número sigue? 2, 4, 8, 16…', ['32', '24', '18'], '32', 'Cada número es el doble del anterior.'),
    choice('lo-2', 'Todos los gatos son mamíferos y Misi es un gato. Entonces…', ['Misi es mamífero', 'Todos los mamíferos son gatos', 'No se puede saber'], 'Misi es mamífero', 'Si todo el grupo cumple algo, cada miembro también.'),
    choice('lo-3', 'Un ladrillo pesa 1 kg más medio ladrillo. ¿Cuánto pesa el ladrillo?', ['2 kg', '1,5 kg', '1 kg'], '2 kg', 'Si medio ladrillo es 1 kg, el ladrillo entero es 2 kg.'),
    choice('lo-4', '¿Qué número sigue? 1, 1, 2, 3, 5, 8…', ['13', '11', '12'], '13', 'Cada número es la suma de los dos anteriores: 5 + 8.'),
    choice('lo-5', 'Si hoy es lunes, ¿qué día será dentro de 10 días?', ['Jueves', 'Miércoles', 'Viernes'], 'Jueves', 'Siete días después vuelve a ser lunes; tres más, jueves.'),
    choice('lo-6', 'En una carrera adelantas al que va de segundo. ¿En qué puesto quedas?', ['Segundo', 'Primero', 'Tercero'], 'Segundo', 'Ocupas su lugar: el segundo.'),
    typed('lo-7', '¿Cuántos meses del año tienen 28 días?', '12', ['doce', 'todos'], 'Todos los meses tienen al menos 28 días.'),
    typed('lo-8', '¿Qué número sigue? 3, 6, 9, 12…', '15', ['quince'], 'Se suma 3 cada vez.'),
    typed('lo-9', 'Si 3 gatos cazan 3 ratones en 3 minutos, ¿cuántos minutos tardan 100 gatos en cazar 100 ratones?', '3', ['tres'], 'Cada gato caza un ratón en 3 minutos, sin importar cuántos gatos haya.'),
    match('lo-10', 'Relaciona cada serie con el número que sigue.', [['2, 4, 6…', '8'], ['1, 4, 9…', '16'], ['10, 20, 30…', '40']], 'Suma de 2, cuadrados (1², 2², 3², 4²) y suma de 10.'),
    explain('lo-11', 'Un granjero tiene 17 ovejas y se mueren todas menos 9. ¿Cuántas le quedan? Explica cómo lo pensaste.', 'Le quedan 9: «todas menos 9» quiere decir que sobreviven 9, no que se restan 9 de 17.', ['Lee despacio «todas menos 9».']),
    explain('lo-12', '¿Por qué ver muchos cisnes blancos no prueba que «todos los cisnes son blancos»?', 'Porque basta un solo cisne de otro color para que sea falsa: los ejemplos a favor no la demuestran, un contraejemplo la refuta.', ['¿Qué haría falta para que la frase sea falsa?']),
  ],
}
