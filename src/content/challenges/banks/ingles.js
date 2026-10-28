import { choice, explain, match, typed } from '../build.js'

export const INGLES = {
  id: 'ingles',
  title: 'Inglés',
  subtitle: 'Verbos, tiempos y palabras que se confunden',
  language: 'en',
  questions: [
    choice('in-1', 'Elige la forma correcta.', ['goes', 'go', 'going'], 'goes', 'Con he, she o it, el presente simple lleva -s.', 'She ___ to school every day.'),
    choice('in-2', 'Elige la forma correcta.', ['watched', 'watch', 'watching'], 'watched', '«Yesterday» pide pasado simple.', 'Yesterday I ___ a movie.'),
    choice('in-3', 'Elige la forma correcta.', ['been', 'went', 'go'], 'been', 'Con «have ever» va el participio: been.', 'Have you ever ___ to London?'),
    choice('in-4', '¿Qué significa «I\'m starving»?', ['Tengo mucha hambre', 'Estoy muy cansado', 'Tengo mucho frío'], 'Tengo mucha hambre', '«Starving» es «muerto de hambre».'),
    choice('in-5', 'Elige la forma correcta.', ['are', 'is', 'am'], 'are', 'Con they se usa «are».', 'They ___ playing football right now.'),
    choice('in-6', '¿Cuál es el pasado de «buy»?', ['bought', 'buyed', 'brought'], 'bought', '«Brought» es el pasado de «bring».'),
    typed('in-7', 'Completa con el pasado de «to be».', 'was', [], 'Con I, he, she e it el pasado de «to be» es «was».', 'I ___ very happy yesterday.'),
    typed('in-8', '¿Cómo se dice «gato» en inglés?', 'cat', ['a cat'], 'Gato es «cat».'),
    match('in-9', 'Relaciona cada verbo con su pasado.', [['go', 'went'], ['eat', 'ate'], ['see', 'saw']], 'Son verbos irregulares: el pasado no termina en -ed.'),
    match('in-10', 'Relaciona cada palabra con su significado real.', [['actually', 'en realidad'], ['library', 'biblioteca'], ['embarrassed', 'avergonzado']], 'Son «falsos amigos»: parecen otra palabra en español.'),
    explain('in-11', 'Explica la diferencia entre «I did my homework» y «I have done my homework».', 'La primera habla de algo terminado en un momento pasado concreto; la segunda, de algo ya hecho cuyo resultado importa ahora, sin decir cuándo.', ['¿Cuál de las dos podría ir con «yesterday»?']),
    explain('in-12', '¿Cuándo se usa «a» y cuándo «an» antes de una palabra?', '«An» va antes de un sonido de vocal (an apple, an hour) y «a» antes de un sonido de consonante (a car, a university).', ['Fíjate en cómo suena la palabra, no en cómo se escribe.']),
  ],
}
