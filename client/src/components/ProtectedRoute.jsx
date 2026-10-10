import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('titanfit_token');

  if (!token || token === 'null' || token === 'undefined') {
    // Redirect to home/login modal if token is absent
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}