import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import init_messaging from './injection_messenger';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

init_messaging();
