import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Tells react to render the app component as child of the root div in the index.html
 */
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
