// Intérprete de PSeInt como generador: se pausa en cada instrucción (para
// ejecutar paso a paso) y en cada Leer (para pedir un dato).
//
// Eventos que emite el generador:
//   { type: 'step',   line }                  antes de ejecutar una línea o evaluar una condición
//   { type: 'input',  name, vtype, line }     espera un dato: responder con gen.next(texto)
//   { type: 'output', text }                  texto escrito con Escribir
// Termina con { value: undefined, done: true }. Un error lanza PseintError.
import { PseintError, norm } from './lexer.js'
import { parse } from './parser.js'

export const DEFAULT_MAX_STEPS = 20000

const TYPE_LABELS = { entero: 'Entero', real: 'Real', texto: 'Cadena', logico: 'Logico' }

/** Cómo se ve un valor al escribirlo o mostrarlo en la tabla de variables. */
export function formatValue(value) {
  if (typeof value === 'boolean') return value ? 'VERDADERO' : 'FALSO'
  if (typeof value === 'number') return String(Number(value.toPrecision(12)))
  return String(value)
}

function typeOfValue(value) {
  if (typeof value === 'boolean') return 'logico'
  if (typeof value === 'string') return 'texto'
  return Number.isInteger(value) ? 'entero' : 'real'
}

const FUNCTIONS = {
  trunc: (x) => Math.trunc(x),
  redon: (x) => Math.round(x),
  raiz: (x) => Math.sqrt(x),
  abs: (x) => Math.abs(x),
  seno: (x) => Math.sin(x),
  coseno: (x) => Math.cos(x),
  ln: (x) => Math.log(x),
  exp: (x) => Math.exp(x),
  longitud: (s) => String(s).length,
  mayusculas: (s) => String(s).toUpperCase(),
  minusculas: (s) => String(s).toLowerCase(),
  subcadena: (s, from, to) => String(s).slice(from, to + 1),
  concatenar: (a, b) => `${a}${b}`,
}

/**
 * Crea un generador listo para ejecutar el programa. Lanza PseintError si el
 * código no se puede leer.
 *
 * @param {string} source
 * @param {{ maxSteps?: number, random?: () => number }} [options]
 */
export function createProgram(source, { maxSteps = DEFAULT_MAX_STEPS, random = Math.random } = {}) {
  const program = parse(source)
  const vars = new Map()
  const state = { steps: 0, changed: new Set() }

  const snapshot = () => [...vars.values()].map(({ name, vtype, value }) => ({
    name,
    type: TYPE_LABELS[vtype],
    value: value === undefined ? null : value,
    text: value === undefined ? '—' : formatValue(value),
  }))

  function* tick(line) {
    state.steps += 1
    if (state.steps > maxSteps) {
      throw new PseintError(
        `El programa pasó de ${maxSteps} pasos. ¿Algo dentro del ciclo cambia lo que la condición revisa?`,
        line,
      )
    }
    yield { type: 'step', line }
  }

  function lookup(node) {
    const entry = vars.get(node.key)
    if (!entry) throw new PseintError(`La variable «${node.name}» no existe. ¿La definiste o le diste un valor antes?`, node.line)
    if (entry.value === undefined) throw new PseintError(`La variable «${entry.name}» todavía no tiene valor.`, node.line)
    return entry.value
  }

  function store(target, value, line) {
    let entry = vars.get(target.key)
    if (!entry) {
      entry = { name: target.name, vtype: typeOfValue(value), value: undefined }
      vars.set(target.key, entry)
    }
    const stored = coerce(entry, value, line)
    if (entry.value !== stored) state.changed.add(entry.name)
    entry.value = stored
  }

  function coerce(entry, value, line) {
    const label = TYPE_LABELS[entry.vtype]
    const ok = {
      entero: typeof value === 'number',
      real: typeof value === 'number',
      texto: typeof value === 'string',
      logico: typeof value === 'boolean',
    }[entry.vtype]
    if (!ok) {
      throw new PseintError(
        `No puedes guardar ${describe(value)} en «${entry.name}», que es ${label}.`,
        line,
      )
    }
    return entry.vtype === 'entero' ? Math.trunc(value) : value
  }

  function describe(value) {
    if (typeof value === 'string') return `el texto «${value}»`
    if (typeof value === 'boolean') return `un valor lógico (${formatValue(value)})`
    return `el número ${formatValue(value)}`
  }

  function number(value, node) {
    if (typeof value !== 'number') throw new PseintError(`Esta operación necesita números y recibió ${describe(value)}.`, node.line)
    return value
  }

  function boolean(value, node) {
    if (typeof value !== 'boolean') throw new PseintError(`Esta condición debe ser verdadera o falsa y recibió ${describe(value)}.`, node.line)
    return value
  }

  function evaluate(node) {
    switch (node.t) {
      case 'lit':
        return node.value
      case 'var':
        return lookup(node)
      case 'un': {
        const value = evaluate(node.e)
        return node.op === '-' ? -number(value, node) : !boolean(value, node)
      }
      case 'call':
        return callFunction(node)
      case 'bin':
        return binary(node)
      default:
        throw new PseintError('Expresión desconocida.', node.line)
    }
  }

  function callFunction(node) {
    if (node.key === 'azar') {
      const max = number(evaluate(node.args[0]), node)
      return Math.floor(random() * max)
    }
    if (node.key === 'aleatorio') {
      const min = number(evaluate(node.args[0]), node)
      const max = number(evaluate(node.args[1]), node)
      return min + Math.floor(random() * (max - min + 1))
    }
    const fn = FUNCTIONS[node.key]
    if (!fn) throw new PseintError(`No conozco la función «${node.name}».`, node.line)
    return fn(...node.args.map(evaluate))
  }

  function binary(node) {
    if (node.op === 'y') return boolean(evaluate(node.l), node) && boolean(evaluate(node.r), node)
    if (node.op === 'o') return boolean(evaluate(node.l), node) || boolean(evaluate(node.r), node)

    const left = evaluate(node.l)
    const right = evaluate(node.r)

    switch (node.op) {
      case '=':
        return left === right
      case '<>':
        return left !== right
      case '<':
      case '>':
      case '<=':
      case '>=': {
        if (typeof left !== typeof right) {
          throw new PseintError(`No se puede comparar ${describe(left)} con ${describe(right)}.`, node.line)
        }
        if (node.op === '<') return left < right
        if (node.op === '>') return left > right
        if (node.op === '<=') return left <= right
        return left >= right
      }
      case '+':
        if (typeof left === 'string' || typeof right === 'string') return `${formatValue(left)}${formatValue(right)}`
        return number(left, node) + number(right, node)
      case '-':
        return number(left, node) - number(right, node)
      case '*':
        return number(left, node) * number(right, node)
      case '/':
        if (number(right, node) === 0) throw new PseintError('No se puede dividir entre cero.', node.line)
        return number(left, node) / right
      case '%':
        if (number(right, node) === 0) throw new PseintError('No se puede dividir entre cero.', node.line)
        return number(left, node) % right
      case '^':
        return number(left, node) ** number(right, node)
      default:
        throw new PseintError('Operador desconocido.', node.line)
    }
  }

  function parseInput(text, vtype, name, line) {
    const raw = String(text).trim()
    if (vtype === 'texto') return String(text)
    if (vtype === 'logico') {
      const key = norm(raw)
      if (['verdadero', 'v', 'true'].includes(key)) return true
      if (['falso', 'f', 'false'].includes(key)) return false
      throw new PseintError(`«${name}» es lógica: escribe VERDADERO o FALSO.`, line)
    }
    const value = Number(raw.replace(',', '.'))
    if (raw === '' || Number.isNaN(value)) {
      throw new PseintError(`«${name}» necesita un número y recibió «${raw}».`, line)
    }
    if (vtype === 'entero' && !Number.isInteger(value)) {
      throw new PseintError(`«${name}» es Entero: no acepta decimales (recibió «${raw}»).`, line)
    }
    return value
  }

  function* block(statements) {
    for (const statement of statements) yield* run(statement)
  }

  function* run(statement) {
    const { line } = statement

    switch (statement.type) {
      case 'define': {
        yield* tick(line)
        for (const { name, key } of statement.names) {
          vars.set(key, { name, vtype: statement.vtype, value: undefined })
        }
        break
      }

      case 'assign': {
        yield* tick(line)
        store(statement.target, evaluate(statement.value), line)
        break
      }

      case 'read': {
        for (const target of statement.targets) {
          yield* tick(line)
          const existing = vars.get(target.key)
          const vtype = existing?.vtype ?? 'real'
          const text = yield { type: 'input', name: target.name, vtype: TYPE_LABELS[vtype], line }
          store(target, parseInput(text, vtype, target.name, line), line)
        }
        break
      }

      case 'write': {
        yield* tick(line)
        const text = statement.values.map((value) => formatValue(evaluate(value))).join('')
        yield { type: 'output', text, newline: statement.newline }
        break
      }

      case 'if': {
        yield* tick(line)
        const branch = boolean(evaluate(statement.condition), statement.condition) ? statement.then : statement.otherwise
        yield* block(branch)
        break
      }

      case 'while': {
        for (;;) {
          yield* tick(line)
          if (!boolean(evaluate(statement.condition), statement.condition)) break
          yield* block(statement.body)
        }
        break
      }

      case 'repeat': {
        for (;;) {
          yield* block(statement.body)
          yield* tick(statement.untilLine)
          const value = boolean(evaluate(statement.condition), statement.condition)
          if (value === statement.stopWhenTrue) break
        }
        break
      }

      case 'for': {
        yield* tick(line)
        const to = number(evaluate(statement.to), statement.to)
        const step = statement.step ? number(evaluate(statement.step), statement.step) : 1
        if (step === 0) throw new PseintError('El paso del Para no puede ser 0: el ciclo nunca avanzaría.', line)
        store(statement.variable, number(evaluate(statement.from), statement.from), line)
        for (;;) {
          const current = vars.get(statement.variable.key).value
          if (step > 0 ? current > to : current < to) break
          yield* block(statement.body)
          store(statement.variable, vars.get(statement.variable.key).value + step, line)
          yield* tick(line)
        }
        break
      }

      default:
        throw new PseintError('Instrucción desconocida.', line)
    }
  }

  return {
    name: program.name,
    /** Generador de eventos. */
    start: () => block(program.body),
    snapshot,
    /** Nombres de variables que cambiaron desde la última llamada. */
    takeChanged() {
      const names = [...state.changed]
      state.changed.clear()
      return names
    },
    stepCount: () => state.steps,
  }
}
