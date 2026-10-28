import assert from 'node:assert/strict'
import test from 'node:test'
import { createMemoryStorage } from '../core/storage/memoryStorage.js'
import { asksForDemoMode, isDemoMode, isDemoPath, setDemoMode } from './demoMode.js'

test('visitors only reach the presentation and the Reto', () => {
  for (const path of ['/feria', '/reto', '/reto/jugar/ingles', '/reto/jugar/propio', '/reto/ranking', '/modo-feria/salir']) {
    assert.ok(isDemoPath(path), path)
  }
  for (const path of ['/', '/inicio', '/apuntes', '/ruta/ruta-abc', '/curso/ruta-abc', '/laboratorio', '/estudiantes', '/verbos', '/retos-viejos']) {
    assert.ok(!isDemoPath(path), path)
  }
})

test('the QR link asks for modo feria', () => {
  assert.equal(asksForDemoMode('?modo=feria'), true)
  assert.equal(asksForDemoMode('?utm=qr&modo=feria'), true)
  assert.equal(asksForDemoMode(''), false)
  assert.equal(asksForDemoMode('?modo=otro'), false)
})

test('the switch sticks in storage', () => {
  const storage = createMemoryStorage()
  assert.equal(isDemoMode(storage), false)
  setDemoMode(true, storage)
  assert.equal(isDemoMode(storage), true)
  setDemoMode(false, storage)
  assert.equal(isDemoMode(storage), false)
})

test('the presentation locks visitors but not the organizer', async () => {
  const { locksOnVisit, markOrganizerDevice } = await import('./demoMode.js')
  const storage = createMemoryStorage()
  assert.equal(locksOnVisit('/feria', storage), true)
  assert.equal(locksOnVisit('/feria/', storage), true)
  assert.equal(locksOnVisit('/reto', storage), false)
  markOrganizerDevice(storage)
  assert.equal(locksOnVisit('/feria', storage), false)
})
