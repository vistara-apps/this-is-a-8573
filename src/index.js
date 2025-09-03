import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './polyfills'; // Import polyfills first
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
