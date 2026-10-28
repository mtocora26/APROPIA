import { choice, explain, match, typed } from '../build.js'

export const COLOMBIA = {
  id: 'colombia',
  title: 'Colombia',
  subtitle: 'Geografía y cultura general del país',
  language: 'es',
  questions: [
    choice('co-1', '¿Cuál es la capital de Colombia?', ['Bogotá', 'Medellín', 'Cali'], 'Bogotá', 'Bogotá es el Distrito Capital.'),
    choice('co-2', '¿Qué río atraviesa Colombia de sur a norte hasta el mar Caribe?', ['Magdalena', 'Amazonas', 'Orinoco'], 'Magdalena', 'Es el río principal del país y desemboca en Barranquilla.'),
    choice('co-3', '¿Cuántos océanos tienen costa en Colombia?', ['2', '1', '3'], '2', 'El Pacífico y el Atlántico, por el mar Caribe.'),
    choice('co-4', '¿Qué escritor colombiano ganó el Premio Nobel de Literatura?', ['Gabriel García Márquez', 'Jorge Isaacs', 'Álvaro Mutis'], 'Gabriel García Márquez', 'Lo ganó en 1982.'),
    choice('co-5', '¿Cuál es la flor nacional de Colombia?', ['La orquídea', 'La rosa', 'El girasol'], 'La orquídea', 'La Cattleya trianae.'),
    choice('co-6', '¿Qué cordillera atraviesa Colombia y se divide en tres ramales?', ['Los Andes', 'Los Alpes', 'La Sierra Madre'], 'Los Andes', 'Se divide en las cordilleras Occidental, Central y Oriental.'),
    typed('co-7', '¿Cuántos colores tiene la bandera de Colombia?', '3', ['tres'], 'Amarillo, azul y rojo.'),
    typed('co-8', '¿En qué ciudad está el Castillo de San Felipe de Barajas?', 'Cartagena', ['cartagena de indias'], 'Defendía la ciudad de los ataques piratas.'),
    match('co-9', 'Relaciona cada ciudad con su departamento.', [['Medellín', 'Antioquia'], ['Cali', 'Valle del Cauca'], ['Barranquilla', 'Atlántico']], 'Son tres de las ciudades más grandes del país.'),
    match('co-10', 'Relaciona cada ritmo con su región.', [['Vallenato', 'Caribe'], ['Currulao', 'Pacífico'], ['Joropo', 'Llanos']], 'La música cambia con cada región.'),
    explain('co-11', '¿Por qué en Colombia no hay cuatro estaciones como en otros países?', 'Porque está cerca de la línea del ecuador: el sol llega casi igual todo el año y el clima cambia más por la altura que por la época.', ['¿Qué tiene de especial la posición del país en el mapa?']),
    explain('co-12', '¿Por qué hace más frío en Bogotá que en Barranquilla, si están en el mismo país?', 'Por la altura: Bogotá está a unos 2600 metros y, a mayor altura, la temperatura baja.', ['Compara a qué altura está cada ciudad.']),
  ],
}
