import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { activeProvider, GeminiError, generateRoute, ProviderNotConfiguredError, RouteRequestError } from './generarRuta.js'

const draft = JSON.parse(await readFile(new URL('../src/content/routes/ejemplo-ciclos.json', import.meta.url), 'utf8'))

function withEnv(env, fn) {
  const saved = { ...process.env }
  delete process.env.GEMINI_API_KEY
  delete process.env.ANTHROPIC_API_KEY
  delete process.env.AI_PROVIDER
  Object.assign(process.env, env)
  return fn().finally(() => {
    process.env = saved
  })
}

function stubFetch(t, status, body) {
  const calls = []
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    calls.push({ url, init })
    return new Response(JSON.stringify(body), { status })
  })
  return calls
}

test('picks Gemini first, Claude when asked, nothing without keys', () => {
  assert.equal(activeProvider({ GEMINI_API_KEY: 'g', ANTHROPIC_API_KEY: 'a' }), 'gemini')
  assert.equal(activeProvider({ GEMINI_API_KEY: 'g', ANTHROPIC_API_KEY: 'a', AI_PROVIDER: 'claude' }), 'claude')
  assert.equal(activeProvider({ ANTHROPIC_API_KEY: 'a' }), 'claude')
  assert.equal(activeProvider({}), null)
})

test('Gemini: sends the schema and turns the JSON into a course', (t) =>
  withEnv({ GEMINI_API_KEY: 'test-key' }, async () => {
    const calls = stubFetch(t, 200, {
      candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'pensando', thought: true }, { text: JSON.stringify(draft) }] } }],
    })
    const course = await generateRoute({ text: 'apuntes de ciclos' })

    assert.equal(course.title, 'Ciclos en PSeInt')
    assert.equal(course.modules.length, 3)
    const { url, init } = calls[0]
    assert.match(url, /:generateContent$/)
    assert.equal(init.headers['x-goog-api-key'], 'test-key')
    const body = JSON.parse(init.body)
    assert.equal(body.generationConfig.responseMimeType, 'application/json')
    assert.ok(body.generationConfig.responseJsonSchema.properties.modules)
    assert.match(body.contents[0].parts.at(-1).text, /apuntes de ciclos/)
  }))

test('Gemini: quota errors keep their status', (t) =>
  withEnv({ GEMINI_API_KEY: 'test-key' }, async () => {
    stubFetch(t, 429, { error: { message: 'Resource exhausted' } })
    await assert.rejects(generateRoute({ text: 'x' }), (error) => error instanceof GeminiError && error.status === 429)
  }))

test('Gemini: a blocked answer is a request error', (t) =>
  withEnv({ GEMINI_API_KEY: 'test-key' }, async () => {
    stubFetch(t, 200, { candidates: [{ finishReason: 'SAFETY', content: { parts: [] } }] })
    await assert.rejects(generateRoute({ text: 'x' }), RouteRequestError)
  }))

test('without keys or material it fails before calling anyone', () =>
  withEnv({}, async () => {
    await assert.rejects(generateRoute({ text: 'x' }), ProviderNotConfiguredError)
    await assert.rejects(generateRoute({ text: '  ' }), RouteRequestError)
  }))

test('Gemini: a saturated model falls through to the next one', (t) =>
  withEnv({ GEMINI_API_KEY: 'test-key' }, async () => {
    const urls = []
    let call = 0
    t.mock.method(globalThis, 'fetch', async (url) => {
      urls.push(url)
      call += 1
      if (call === 1) return new Response(JSON.stringify({ error: { message: 'high demand' } }), { status: 503 })
      return new Response(JSON.stringify({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(draft) }] } }] }), { status: 200 })
    })
    const course = await generateRoute({ text: 'x' })
    assert.equal(course.title, 'Ciclos en PSeInt')
    assert.equal(urls.length, 2)
    assert.notEqual(urls[0], urls[1])
  }))

test('explanations: the verdict comes back and the model answer is only in the prompt', (t) =>
  withEnv({ GEMINI_API_KEY: 'test-key' }, async () => {
    const { evaluateExplanation } = await import('./evaluarExplicacion.js')
    const calls = stubFetch(t, 200, {
      candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ verdict: 'partial', feedback: ' ¿Qué pasa con la condición? ' }) }] } }],
    })
    const result = await evaluateExplanation({ question: '¿Por qué?', modelAnswer: 'Porque sí', answer: 'Creo que…' })
    assert.deepEqual(result, { verdict: 'partial', feedback: '¿Qué pasa con la condición?' })
    assert.match(JSON.parse(calls[0].init.body).contents[0].parts[0].text, /<explicacion_estudiante>Creo que…/)
    await assert.rejects(evaluateExplanation({ question: 'q', modelAnswer: 'm', answer: '  ' }), RouteRequestError)
  }))

test('a mini route asks for fewer lessons', (t) =>
  withEnv({ GEMINI_API_KEY: 'test-key' }, async () => {
    const calls = stubFetch(t, 200, { candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify(draft) }] } }] })
    await generateRoute({ text: 'apuntes', size: 'mini' })
    assert.match(JSON.parse(calls[0].init.body).contents[0].parts.at(-1).text, /1 módulo con 2 lecciones/)
  }))
