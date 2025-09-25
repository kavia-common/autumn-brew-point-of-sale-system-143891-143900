import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Global error logging for uncaught exceptions
// Ensures runtime errors outside React boundaries are visible in console
if (typeof window !== 'undefined') {
  // Log uncaught exceptions
  window.onerror = function onGlobalError(message, source, lineno, colno, error) {
    // eslint-disable-next-line no-console
    console.error('[Global onerror]', { message, source, lineno, colno, error });
  };

  // Log unhandled promise rejections
  window.onunhandledrejection = function onUnhandledRejection(event) {
    // Some environments wrap reason on event.reason; fallback to event itself
    const reason = event?.reason || event;
    // eslint-disable-next-line no-console
    console.error('[Global onunhandledrejection]', reason);
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (e) {
  // eslint-disable-next-line no-console
  console.error('Fatal render error:', e);
}
