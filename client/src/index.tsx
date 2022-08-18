import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './index.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  throw new Error('Could not find root div');
}