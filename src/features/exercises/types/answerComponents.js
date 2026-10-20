import ChoiceAnswer from './ChoiceAnswer.jsx'
import DialogueAnswer from './DialogueAnswer.jsx'
import MatchAnswer from './MatchAnswer.jsx'
import OpenAnswer from './OpenAnswer.jsx'
import ReorderAnswer from './ReorderAnswer.jsx'
import SpellingAnswer from './SpellingAnswer.jsx'
import TypedAnswer from './TypedAnswer.jsx'

// Factory: tipo de ejercicio → componente que lo responde.
// Agregar un tipo = lógica en exerciseLogic.js + componente aquí.
export const ANSWER_COMPONENTS = Object.freeze({
  choice: ChoiceAnswer,
  typed: TypedAnswer,
  reorder: ReorderAnswer,
  match: MatchAnswer,
  spelling: SpellingAnswer,
  open: OpenAnswer,
  dialogue: DialogueAnswer,
})
