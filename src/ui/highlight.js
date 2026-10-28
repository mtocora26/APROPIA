// Resaltado de código para la teoría: texto → líneas de fragmentos con un `kind`.
// Puro, sin DOM. Soporta PSeInt, C# y Python (lo justo para las lecciones).

const strip = (text) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const WORDS = {
  pseint: {
    struct: ['algoritmo', 'finalgoritmo', 'proceso', 'finproceso', 'si', 'entonces', 'sino', 'finsi', 'mientras', 'hacer', 'finmientras', 'repetir', 'hasta', 'que', 'para', 'con', 'paso', 'finpara'],
    io: ['definir', 'como', 'leer', 'escribir', 'sin', 'saltar'],
    type: ['entero', 'real', 'cadena', 'caracter', 'logico', 'texto', 'numero'],
    logic: ['y', 'o', 'no', 'mod', 'verdadero', 'falso'],
  },
  csharp: {
    struct: ['if', 'else', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'break', 'continue', 'return'],
    io: ['using', 'namespace', 'class', 'private', 'public', 'protected', 'static', 'void', 'new', 'partial', 'out'],
    type: ['int', 'double', 'string', 'bool', 'float', 'char', 'decimal', 'var', 'object'],
    logic: ['true', 'false', 'null'],
  },
  python: {
    struct: ['for', 'in', 'while', 'if', 'elif', 'else', 'break', 'continue', 'pass', 'return', 'def'],
    io: ['print', 'input', 'range', 'len', 'enumerate', 'int', 'float', 'str'],
    type: ['list', 'tuple', 'dict'],
    logic: ['and', 'or', 'not', 'true', 'false', 'none'],
  },
}

const KIND_OF = Object.fromEntries(
  Object.entries(WORDS).map(([lang, groups]) => [
    lang,
    Object.fromEntries(Object.entries(groups).flatMap(([kind, words]) => words.map((word) => [word, kind]))),
  ]),
)

const RULES = [
  ['comment', /\/\/.*/y],
  ['string', /"[^"]*"|'[^']*'/y],
  ['number', /\d+(?:[.,]\d+)?/y],
  ['word', /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ_][A-Za-zÁÉÍÓÚÜÑáéíóúüñ_0-9]*/y],
  ['arrow', /<-/y],
  ['op', /<=|>=|<>|==|!=|&&|\|\||\+\+|--|\+=|[=<>+\-*/^%&|~!]/y],
  ['space', /\s+/y],
]
const PLACEHOLDER = /<[A-Za-zÁÉÍÓÚáéíóúñÑ][^<>\n]*>/y

/**
 * @param {string} source
 * @param {{ lang?: 'pseint'|'csharp'|'python', placeholders?: boolean }} [options]
 *   placeholders: `<condición>` se marca como hueco de una plantilla.
 * @returns {{ text: string, kind: string }[][]} un arreglo de fragmentos por línea
 */
export function highlight(source, { lang = 'pseint', placeholders = false } = {}) {
  const kinds = KIND_OF[lang] ?? KIND_OF.pseint
  return source.split('\n').map((line) => highlightLine(line, kinds, placeholders, lang))
}

function highlightLine(line, kinds, placeholders, lang) {
  const parts = []
  let at = 0
  const push = (text, kind) => {
    const last = parts.at(-1)
    if (last && last.kind === kind && kind !== 'placeholder') last.text += text
    else parts.push({ text, kind })
  }

  while (at < line.length) {
    let matched = false
    if (lang === 'python' && line[at] === '#') {
      push(line.slice(at), 'comment')
      break
    }
    if (placeholders) {
      PLACEHOLDER.lastIndex = at
      const hit = PLACEHOLDER.exec(line)
      if (hit) {
        push(hit[0], 'placeholder')
        at += hit[0].length
        continue
      }
    }
    for (const [kind, rule] of RULES) {
      if (lang === 'python' && kind === 'comment') continue
      rule.lastIndex = at
      const hit = rule.exec(line)
      if (!hit) continue
      const text = hit[0]
      push(text, kind === 'word' ? (kinds[strip(text)] ?? 'plain') : kind === 'space' ? 'plain' : kind)
      at += text.length
      matched = true
      break
    }
    if (!matched) {
      push(line[at], 'plain')
      at += 1
    }
  }
  return parts
}
