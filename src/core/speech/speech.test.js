import assert from 'node:assert/strict'
import test from 'node:test'
import {
  cleanSpeechText,
  findVoice,
  isSpeechSupported,
  pickVoice,
  speak,
  SpeechUnavailableError,
  speechLang,
} from './speech.js'

const voice = (name, lang) => ({ name, lang })

test('maps course languages to voice languages', () => {
  assert.equal(speechLang('it'), 'it-IT')
  assert.equal(speechLang('fr-FR'), 'fr-FR')
})

test('removes blanks and separators before speaking', () => {
  assert.equal(cleanSpeechText('Lei ___ Eva.'), 'Lei Eva.')
  assert.equal(
    cleanSpeechText('R di Roma – O di Otranto'),
    'R di Roma, O di Otranto',
  )
  assert.equal(
    cleanSpeechText('Come ti chiami? / Come si chiama?'),
    'Come ti chiami?, Come si chiama?',
  )
})

test('prefers the exact language, then the base language', () => {
  const voices = [
    voice('English', 'en-US'),
    voice('Italian', 'it'),
    voice('Google italiano', 'it-IT'),
  ]
  assert.equal(pickVoice(voices, 'it-IT').name, 'Google italiano')
  assert.equal(pickVoice(voices.slice(0, 2), 'it-IT').name, 'Italian')
})

test('prefers plain voices over espeak variants and accepts underscores', () => {
  const voices = [voice('Italian+Antonio', 'it'), voice('Italian', 'it')]
  assert.equal(pickVoice(voices, 'it-IT').name, 'Italian')
  assert.equal(pickVoice([voice('Alice', 'it_IT')], 'it-IT').name, 'Alice')
})

test('never falls back to another language', () => {
  assert.equal(pickVoice([voice('English', 'en-US')], 'it-IT'), null)
  assert.equal(pickVoice([], 'it-IT'), null)
})

test('outside the browser there is no voice and speak rejects explicitly', async () => {
  assert.equal(isSpeechSupported(), false)
  assert.equal(await findVoice('it-IT'), null)
  await assert.rejects(speak('Ciao', 'it-IT'), SpeechUnavailableError)
})
