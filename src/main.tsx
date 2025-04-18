import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import MapComponent from './components/MapComponent.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <MapComponent />
  </StrictMode>
);
