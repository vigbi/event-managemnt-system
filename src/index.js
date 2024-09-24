import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';  // Import App component
import { BrowserRouter } from 'react-router-dom'; 


// Find the root element in your HTML (usually in public/index.html)
const rootElement = document.getElementById('root');

// Create a root and render the App component inside it
const root = ReactDOM.createRoot(rootElement);

// Render the app within the BrowserRouter
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
