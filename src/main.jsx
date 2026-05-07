import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#e8e8e8',
            border: '1px solid #2a2a2a',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#00ff41', secondary: '#0a0a0a' } },
          error:   { iconTheme: { primary: '#f43f5e', secondary: '#0a0a0a' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
