import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

//document.getElementById('root') is how we access the basic DOM,
//target this div, and populate our entire react app and inject it in index.html div line. 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

