import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ModalProvider } from './context/CustomModalContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ModalProvider>
      <App />
    </ModalProvider>
  </BrowserRouter>
);
