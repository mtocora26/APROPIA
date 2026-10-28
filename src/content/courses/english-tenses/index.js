import { TO_BE } from './toBe.js'
import { PAST_SIMPLE } from './pastSimple.js'
import { PRESENT_PERFECT } from './presentPerfect.js'
import { PAST_PERFECT } from './pastPerfect.js'
import { PRESENT_CONTINUOUS } from './presentContinuous.js'
import { PRESENT_PERFECT_CONTINUOUS } from './presentPerfectContinuous.js'
import { PAST_CONTINUOUS } from './pastContinuous.js'

// Un módulo por tiempo verbal. Para agregar un tema: crear su archivo y listarlo aquí.
export const ENGLISH_TENSES = {
  id: 'english-tenses',
  title: 'English: tiempos verbales',
  language: 'en',
  level: 'B1',
  modules: [
    TO_BE,
    PAST_SIMPLE,
    PRESENT_PERFECT,
    PAST_PERFECT,
    PRESENT_CONTINUOUS,
    PRESENT_PERFECT_CONTINUOUS,
    PAST_CONTINUOUS,
  ],
}
