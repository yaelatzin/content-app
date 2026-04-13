import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<React.StrictMode><App /></React.StrictMode>)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
  })
}

.pill-grabado  { background: rgba(139,92,246,0.12); color: #a78bfa; }
.pill-edicion  { background: rgba(236,72,153,0.12);  color: #f472b6; }
