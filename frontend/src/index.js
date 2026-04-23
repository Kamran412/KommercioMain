import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#13132e',
          color: '#f0f0ff',
          border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: '12px',
          fontFamily: "'DM Sans', sans-serif",
        },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#ef4444',  secondary: '#fff' } },
      }}
    />
  </BrowserRouter>
);
