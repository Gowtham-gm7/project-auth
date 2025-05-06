import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client' instead of 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

// Create a root and render the App inside it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <App />
  </Router>
);
