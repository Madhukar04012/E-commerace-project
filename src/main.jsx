import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css'; // 👈 Make sure this is present and correct
import './i18n'; // Import i18n configuration

// Future flags for React Router v7 compatibility
const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter future={routerFutureConfig}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
