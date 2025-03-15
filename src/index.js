import React from 'react';  
import ReactDOM from 'react-dom/client';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import './index.css';  
import App from './App';  
import reportWebVitals from './reportWebVitals';  
import ShippingScheduleForm from './BulkEdit';

const root = ReactDOM.createRoot(document.getElementById('root'));  
root.render(  
  <React.StrictMode>  
    <Router>  
      <Routes>  
        <Route path="/" element={<App />} /> {/* Main App Route */}  
        <Route path="/edit/:id" element={<ShippingScheduleForm />} /> {/* Edit route with ID param */}
        <Route path="/add" element={<ShippingScheduleForm />} /> {/* Add route with no ID param */}
      </Routes>  
    </Router>  
  </React.StrictMode>  
);  

reportWebVitals();