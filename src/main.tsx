import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './styles/index.css'
import App from './App'

if (!(location.hash.length > 1 || new URLSearchParams(location.search).has('open'))) document.documentElement.classList.add('locked')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
