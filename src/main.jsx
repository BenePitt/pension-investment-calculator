import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerChartDefaults } from './utils/chartConfig.js'
import App from './App.jsx'
import './App.css'

registerChartDefaults()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
