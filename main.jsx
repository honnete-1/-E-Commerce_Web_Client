import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ensureGuestUser } from './utils/guestUser'

// Bootstrap: register a real user account (gets a MongoDB _id) before
// the app renders, so cart and orders work immediately without a login flow.
ensureGuestUser().finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
