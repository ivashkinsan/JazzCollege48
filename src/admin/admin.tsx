import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './AdminApp';
// We can create a separate CSS file for the admin panel if needed
// import './admin.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
