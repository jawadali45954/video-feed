import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(error => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}
