import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n'
import { RuralModeProvider } from './context/RuralModeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RuralModeProvider>
      <App />
    </RuralModeProvider>
  </StrictMode>,
)
