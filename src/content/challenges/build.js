// Atajos para escribir los bancos del Reto. Cada pregunta se responde sin
// haber visto ninguna lección: nada de «en el ejemplo» ni «según los apuntes».

export const choice = (id, prompt, options, answer, explanation, sentence) => ({
  id,
  type: 'choice',
  prompt,
  ...(sentence && { sentence }),
  options,
  answer,
  explanation,
})

export const typed = (id, prompt, answer, alternatives, explanation, sentence) => ({
  id,
  type: 'typed',
  prompt,
  ...(sentence && { sentence }),
  answer,
  ...(alternatives.length > 0 && { alternatives }),
  explanation,
})

export const match = (id, prompt, pairs, explanation) => ({ id, type: 'match', prompt, pairs, explanation })

export const explain = (id, prompt, modelAnswer, hints) => ({ id, type: 'open', prompt, modelAnswer, hints })
