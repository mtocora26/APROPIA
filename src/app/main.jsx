import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { migrateLegacyStorage } from '../core/storage/legacyKeys.js'
import '@fontsource/chakra-petch/400.css'
import '@fontsource/chakra-petch/600.css'
import '@fontsource/chakra-petch/700.css'
import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import '../index.css'
import App from './App.jsx'

// The app used to be called Tukola; move its saved data before anything reads it.
try {
  migrateLegacyStorage(globalThis.localStorage)
} catch {
  // Storage unavailable: the app reports it where it reads the data.
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
