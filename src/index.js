import React from 'react';  
import ReactDOM from 'react-dom/client';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Router modules  
import './index.css';  
import App from './App';  
import reportWebVitals from './reportWebVitals';  
import BulkEdit from './BulkEdit'; // Import the BulkEdit component  

const root = ReactDOM.createRoot(document.getElementById('root'));  
root.render(  
  <React.StrictMode>  
    <Router>  
      <Routes>  
        <Route path="/" element={<App />} /> {/* Main App Route */}  
        <Route path="/edit/:id" element={<BulkEdit />} /> {/* New Route for Bulk Edit */}  
      </Routes>  
    </Router>  
  </React.StrictMode>  
);  

// If you want to start measuring performance in your app, pass a function  
// to log results (for example: reportWebVitals(console.log))  
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals  
reportWebVitals();  