import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const UnProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/schedule-list" /> : <Outlet />;
};

export default UnProtectedRoute;
