import TextAnswerInput from '../text-answer/TextAnswerInput.jsx'

const LANGUAGE_NAMES = { it: 'italiano', en: 'inglés' }

function TypedAnswer({ onAnswer, disabled, language }) {
  const name = LANGUAGE_NAMES[language] ?? 'el idioma del curso'

  return (
    <TextAnswerInput label={`Escríbelo en ${name}`} onAnswer={onAnswer} disabled={disabled} />
  )
}

export default TypedAnswer
