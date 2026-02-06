import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('Main.tsx is starting...');
const rootElement = document.getElementById('root');

if (!rootElement) {
    console.error('Failed to find root element');
} else {
    console.log('Root element found, mounting React app...');
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )
}
