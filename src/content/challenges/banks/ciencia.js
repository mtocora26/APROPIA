import { choice, explain, match, typed } from '../build.js'

export const CIENCIA = {
  id: 'ciencia',
  title: 'Ciencia del día a día',
  subtitle: 'Lo que pasa a tu alrededor y casi nunca te preguntas',
  language: 'es',
  questions: [
    choice('ci-1', '¿A qué temperatura hierve el agua al nivel del mar?', ['100 °C', '90 °C', '120 °C'], '100 °C', 'En lugares altos, como Bogotá, hierve un poco antes: hay menos presión.'),
    choice('ci-2', '¿Qué gas liberan las plantas en la fotosíntesis?', ['Oxígeno', 'Dióxido de carbono', 'Nitrógeno'], 'Oxígeno', 'Toman dióxido de carbono y liberan oxígeno.'),
    choice('ci-3', '¿Por qué se ve el relámpago antes de oír el trueno?', ['La luz viaja más rápido que el sonido', 'El trueno ocurre después', 'El sonido rebota en las nubes'], 'La luz viaja más rápido que el sonido', 'Ocurren al mismo tiempo; la luz llega casi al instante.'),
    choice('ci-4', '¿Cuál es el planeta más grande del sistema solar?', ['Júpiter', 'Saturno', 'La Tierra'], 'Júpiter', 'En Júpiter cabrían más de mil Tierras.'),
    choice('ci-5', '¿Por qué el hielo flota en el agua?', ['Es menos denso que el agua líquida', 'Pesa más que el agua', 'El frío lo empuja hacia arriba'], 'Es menos denso que el agua líquida', 'Al congelarse, el agua ocupa más espacio.'),
    choice('ci-6', '¿Qué órgano bombea la sangre por el cuerpo?', ['El corazón', 'Los pulmones', 'El hígado'], 'El corazón', 'Late unas 100 000 veces al día.'),
    typed('ci-7', '¿Cuál es la fórmula química del agua?', 'H2O', ['H₂O'], 'Dos átomos de hidrógeno y uno de oxígeno.'),
    typed('ci-8', '¿Cuál es el planeta más cercano al Sol?', 'Mercurio', [], 'Mercurio es también el más pequeño.'),
    match('ci-9', 'Relaciona cada cuerpo con lo que es.', [['El Sol', 'Estrella'], ['La Luna', 'Satélite'], ['La Tierra', 'Planeta']], 'El Sol es una estrella mediana; la Luna gira alrededor de la Tierra.'),
    match('ci-10', 'Relaciona cada estado con un ejemplo de agua.', [['Sólido', 'Hielo'], ['Líquido', 'Lluvia'], ['Gaseoso', 'Vapor']], 'Es la misma sustancia en tres estados.'),
    explain('ci-11', 'En invierno nos abrigamos. ¿La ropa nos da calor? Explica.', 'No produce calor: atrapa el calor que produce el cuerpo y evita que se pierda.', ['¿Una chaqueta en un armario está caliente?']),
    explain('ci-12', '¿Por qué aparece el arcoíris cuando hay sol y lluvia al mismo tiempo?', 'Porque la luz del sol se separa en colores al entrar y reflejarse dentro de las gotas de agua.', ['¿Qué pasa con la luz blanca al atravesar una gota?']),
  ],
}
