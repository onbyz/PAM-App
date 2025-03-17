import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ShippingScheduleForm from './BulkEdit';
import BulkScheduleUpload from './BulkUpload';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/edit/:id" element={<ShippingScheduleForm />} />
        <Route path="/add" element={<ShippingScheduleForm />} />
        <Route path="/bulk" element={<BulkScheduleUpload  />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();