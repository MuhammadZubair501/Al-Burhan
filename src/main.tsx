import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'


// 1. Grab the saved ID from the browser's storage
const savedID = localStorage.getItem("CampusID");

// 2. Put it back into the window object right away. 
// If nothing is saved yet, set it to 0.
window.CampusID = savedID ? Number(savedID) : 0;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
