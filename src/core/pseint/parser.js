// Parser de PSeInt: tokens → árbol. Subconjunto de fundamentos: variables,
// Leer/Escribir, Si, Mientras, Repetir y Para.
import { PseintError, tokenize } from './lexer.js'

const TYPE_KEYS = {
  entero: 'entero',
  real: 'real',
  numero: 'real',
  numerico: 'real',
  cadena: 'texto',
  caracter: 'texto',
  texto: 'texto',
  logico: 'logico',
}

const PROGRAM_START = new Set(['algoritmo', 'proceso'])
const PROGRAM_END = new Set(['finalgoritmo', 'finproceso'])

/** @returns {{ name: string|null, body: object[] }} */
export function parse(source) {
  return new Parser(tokenize(source)).program()
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.pos = 0
  }

  peek(offset = 0) {
    return this.tokens[Math.min(this.pos + offset, this.tokens.length - 1)]
  }

  next() {
    return this.tokens[this.pos++]
  }

  isKey(key, offset = 0) {
    const token = this.peek(offset)
    return token.type === 'id' && token.key === key
  }

  isOp(value) {
    const token = this.peek()
    return token.type === 'op' && token.value === value
  }

  acceptKey(key) {
    if (!this.isKey(key)) return false
    this.pos += 1
    return true
  }

  expectKey(key, label = key) {
    if (!this.acceptKey(key)) this.fail(`Se esperaba «${label}».`)
  }

  expectOp(value) {
    if (!this.isOp(value)) this.fail(`Se esperaba «${value}».`)
    this.pos += 1
  }

  fail(message, line = this.peek().line) {
    throw new PseintError(message, line)
  }

  skipNewlines() {
    while (this.peek().type === 'nl') this.pos += 1
  }

  endOfStatement() {
    const token = this.peek()
    if (token.type !== 'nl' && token.type !== 'eof') {
      this.fail(`No entiendo «${token.value}» en esta posición.`)
    }
    this.skipNewlines()
  }

  program() {
    this.skipNewlines()
    let name = null
    if (this.peek().type === 'id' && PROGRAM_START.has(this.peek().key)) {
      this.next()
      if (this.peek().type === 'id') name = this.next().value
      this.endOfStatement()
    }
    const body = this.block(new Set([...PROGRAM_END]), 'FinAlgoritmo', true)
    if (this.peek().type === 'id' && PROGRAM_END.has(this.peek().key)) {
      this.next()
      this.skipNewlines()
    }
    if (this.peek().type !== 'eof') this.fail('Hay instrucciones después de FinAlgoritmo.')
    return { name, body }
  }

  /** Lee instrucciones hasta una palabra de cierre (sin consumirla). */
  block(stops, closer, allowEof = false) {
    const statements = []
    for (;;) {
      this.skipNewlines()
      const token = this.peek()
      if (token.type === 'eof') {
        if (allowEof) return statements
        this.fail(`Falta ${closer}.`)
      }
      if (token.type === 'id' && PROGRAM_END.has(token.key) && !stops.has(token.key)) {
        // El programa terminó con una estructura sin cerrar: decir cuál falta.
        this.fail(`Falta ${closer}.`, token.line)
      }
      if (token.type === 'id' && stops.has(token.key)) {
        const isNestedWhile = token.key === 'mientras' && !this.isKey('que', 1)
        if (!isNestedWhile) return statements
      }
      statements.push(this.statement())
    }
  }

  statement() {
    const token = this.peek()
    if (token.type !== 'id') this.fail(`No entiendo «${token.value}»: una instrucción empieza con una palabra.`)
    const line = token.line

    switch (token.key) {
      case 'definir':
        return this.define(line)
      case 'leer':
        return this.read(line)
      case 'escribir':
        return this.write(line)
      case 'si':
        return this.ifStatement(line)
      case 'mientras':
        return this.whileStatement(line)
      case 'repetir':
        return this.repeatStatement(line)
      case 'para':
        return this.forStatement(line)
      default:
        return this.assignment(line)
    }
  }

  define(line) {
    this.next()
    const names = [this.identifier('el nombre de la variable')]
    while (this.isOp(',')) {
      this.next()
      names.push(this.identifier('el nombre de la variable'))
    }
    this.expectKey('como', 'Como')
    const typeToken = this.next()
    const vtype = typeToken.type === 'id' ? TYPE_KEYS[typeToken.key] : undefined
    if (!vtype) this.fail('Tipo desconocido. Usa Entero, Real, Cadena o Logico.', typeToken.line)
    this.endOfStatement()
    return { type: 'define', names, vtype, line }
  }

  identifier(what) {
    const token = this.next()
    if (token.type !== 'id') this.fail(`Se esperaba ${what}.`, token.line)
    return { name: token.value, key: token.key }
  }

  read(line) {
    this.next()
    const targets = [this.identifier('la variable que se lee')]
    while (this.isOp(',')) {
      this.next()
      targets.push(this.identifier('la variable que se lee'))
    }
    this.endOfStatement()
    return { type: 'read', targets, line }
  }

  write(line) {
    this.next()
    const values = [this.expression()]
    while (this.isOp(',')) {
      this.next()
      values.push(this.expression())
    }
    let newline = true
    if (this.isKey('sin') && this.isKey('saltar', 1)) {
      this.pos += 2
      newline = false
    }
    this.endOfStatement()
    return { type: 'write', values, newline, line }
  }

  ifStatement(line) {
    this.next()
    const condition = this.expression()
    this.acceptKey('entonces')
    this.endOfStatement()
    const then = this.block(new Set(['sino', 'finsi']), 'FinSi')
    let otherwise = []
    if (this.acceptKey('sino')) {
      this.endOfStatement()
      otherwise = this.block(new Set(['finsi']), 'FinSi')
    }
    this.expectKey('finsi', 'FinSi')
    this.endOfStatement()
    return { type: 'if', condition, then, otherwise, line }
  }

  whileStatement(line) {
    this.next()
    const condition = this.expression()
    this.acceptKey('hacer')
    this.endOfStatement()
    const body = this.block(new Set(['finmientras']), 'FinMientras')
    this.expectKey('finmientras', 'FinMientras')
    this.endOfStatement()
    return { type: 'while', condition, body, line }
  }

  repeatStatement(line) {
    this.next()
    this.endOfStatement()
    const body = this.block(new Set(['hasta', 'mientras']), 'Hasta Que')
    const closer = this.next()
    const untilLine = closer.line
    let stopWhenTrue = true
    if (closer.key === 'hasta') {
      this.expectKey('que', 'Que')
    } else {
      this.expectKey('que', 'Que')
      stopWhenTrue = false
    }
    const condition = this.expression()
    this.endOfStatement()
    return { type: 'repeat', body, condition, stopWhenTrue, line, untilLine }
  }

  forStatement(line) {
    this.next()
    const variable = this.identifier('la variable de control')
    this.expectOp('<-')
    const from = this.expression()
    this.expectKey('hasta', 'Hasta')
    const to = this.expression()
    let step = null
    if (this.isKey('con') && this.isKey('paso', 1)) {
      this.pos += 2
      step = this.expression()
    }
    this.acceptKey('hacer')
    this.endOfStatement()
    const body = this.block(new Set(['finpara']), 'FinPara')
    this.expectKey('finpara', 'FinPara')
    this.endOfStatement()
    return { type: 'for', variable, from, to, step, body, line }
  }

  assignment(line) {
    const target = this.identifier('una instrucción')
    if (!this.isOp('<-') && !this.isOp('=')) {
      this.fail(`No entiendo «${target.name}». ¿Quisiste asignar con «<-»?`, line)
    }
    this.next()
    const value = this.expression()
    this.endOfStatement()
    return { type: 'assign', target, value, line }
  }

  // --- Expresiones, de menor a mayor precedencia: O, Y, NO, comparación, + -, * / MOD, ^, unarios.

  expression() {
    return this.orExpr()
  }

  orExpr() {
    let left = this.andExpr()
    while (this.isKey('o') || this.isOp('|')) {
      const line = this.next().line
      left = { t: 'bin', op: 'o', l: left, r: this.andExpr(), line }
    }
    return left
  }

  andExpr() {
    let left = this.notExpr()
    while (this.isKey('y') || this.isOp('&')) {
      const line = this.next().line
      left = { t: 'bin', op: 'y', l: left, r: this.notExpr(), line }
    }
    return left
  }

  notExpr() {
    if (this.isKey('no') || this.isOp('~')) {
      const line = this.next().line
      return { t: 'un', op: 'no', e: this.notExpr(), line }
    }
    return this.comparison()
  }

  comparison() {
    const left = this.additive()
    const token = this.peek()
    if (token.type === 'op' && ['=', '<>', '<', '>', '<=', '>='].includes(token.value)) {
      this.next()
      return { t: 'bin', op: token.value, l: left, r: this.additive(), line: token.line }
    }
    return left
  }

  additive() {
    let left = this.multiplicative()
    while (this.isOp('+') || this.isOp('-')) {
      const token = this.next()
      left = { t: 'bin', op: token.value, l: left, r: this.multiplicative(), line: token.line }
    }
    return left
  }

  multiplicative() {
    let left = this.power()
    while (this.isOp('*') || this.isOp('/') || this.isOp('%') || this.isKey('mod')) {
      const token = this.next()
      const op = token.type === 'id' ? '%' : token.value
      left = { t: 'bin', op, l: left, r: this.power(), line: token.line }
    }
    return left
  }

  power() {
    const base = this.unary()
    if (this.isOp('^')) {
      const line = this.next().line
      return { t: 'bin', op: '^', l: base, r: this.power(), line }
    }
    return base
  }

  unary() {
    if (this.isOp('-')) {
      const line = this.next().line
      return { t: 'un', op: '-', e: this.unary(), line }
    }
    return this.primary()
  }

  primary() {
    const token = this.next()
    switch (token.type) {
      case 'num':
        return { t: 'lit', value: token.value, line: token.line }
      case 'str':
        return { t: 'lit', value: token.value, line: token.line }
      case 'op': {
        if (token.value === '(') {
          const inner = this.expression()
          this.expectOp(')')
          return inner
        }
        return this.fail(`No esperaba «${token.value}» aquí.`, token.line)
      }
      case 'id': {
        if (token.key === 'verdadero') return { t: 'lit', value: true, line: token.line }
        if (token.key === 'falso') return { t: 'lit', value: false, line: token.line }
        if (this.isOp('(')) {
          this.next()
          const args = []
          if (!this.isOp(')')) {
            args.push(this.expression())
            while (this.isOp(',')) {
              this.next()
              args.push(this.expression())
            }
          }
          this.expectOp(')')
          return { t: 'call', key: token.key, name: token.value, args, line: token.line }
        }
        return { t: 'var', name: token.value, key: token.key, line: token.line }
      }
      default:
        return this.fail('Falta un valor en la expresión.', token.line)
    }
  }
}
