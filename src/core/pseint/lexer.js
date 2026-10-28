// Lexer de PSeInt. Puro: texto → tokens. Sin DOM ni estado.

/** Error del lenguaje con la línea (desde 1) donde ocurrió. */
export class PseintError extends Error {
  constructor(message, line = null) {
    super(message)
    this.name = 'PseintError'
    this.line = line
  }
}

/** Minúsculas y sin tildes: PSeInt no distingue mayúsculas ni acentos en palabras clave. */
export function norm(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const ID_START = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ_]/
const ID_PART = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ_0-9]/
const DIGIT = /[0-9]/
const OPERATORS = ['<-', '<=', '>=', '<>', '=', '<', '>', '+', '-', '*', '/', '^', '%', '(', ')', ',', '[', ']', '&', '|', '~', ':']

/**
 * @returns {{ type: 'num'|'str'|'id'|'op'|'nl'|'eof', value: any, key?: string, line: number }[]}
 */
export function tokenize(source) {
  const tokens = []
  let i = 0
  let line = 1
  const push = (type, value, extra) => tokens.push({ type, value, line, ...extra })

  while (i < source.length) {
    const ch = source[i]

    if (ch === '\n') {
      push('nl', '\n')
      line += 1
      i += 1
    } else if (ch === ';') {
      push('nl', ';')
      i += 1
    } else if (/\s/.test(ch)) {
      i += 1
    } else if (ch === '/' && source[i + 1] === '/') {
      while (i < source.length && source[i] !== '\n') i += 1
    } else if (ch === '/' && source[i + 1] === '*') {
      const end = source.indexOf('*/', i + 2)
      if (end === -1) throw new PseintError('Comentario /* sin cerrar con */.', line)
      line += (source.slice(i, end).match(/\n/g) ?? []).length
      i = end + 2
    } else if (ch === '"' || ch === "'") {
      const end = source.indexOf(ch, i + 1)
      const lineEnd = source.indexOf('\n', i)
      if (end === -1 || (lineEnd !== -1 && end > lineEnd)) {
        throw new PseintError('Falta cerrar las comillas del texto.', line)
      }
      push('str', source.slice(i + 1, end))
      i = end + 1
    } else if (DIGIT.test(ch) || (ch === '.' && DIGIT.test(source[i + 1] ?? ''))) {
      let j = i
      while (DIGIT.test(source[j] ?? '')) j += 1
      if (source[j] === '.' && DIGIT.test(source[j + 1] ?? '')) {
        j += 1
        while (DIGIT.test(source[j] ?? '')) j += 1
      }
      push('num', Number(source.slice(i, j)))
      i = j
    } else if (ID_START.test(ch)) {
      let j = i
      while (ID_PART.test(source[j] ?? '')) j += 1
      const text = source.slice(i, j)
      push('id', text, { key: norm(text) })
      i = j
    } else {
      const op = OPERATORS.find((candidate) => source.startsWith(candidate, i))
      if (!op) throw new PseintError(`Carácter no reconocido: «${ch}».`, line)
      push('op', op)
      i += op.length
    }
  }

  push('nl', '\n')
  push('eof', null)
  return tokens
}
