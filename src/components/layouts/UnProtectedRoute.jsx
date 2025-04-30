import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const UnProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  const user = JSON.parse(localStorage.getItem('user'));
	const role = user?.role;
	const isEcManager = role === 'ec_management';
  const navigateTo = isEcManager ? '/registered-users' : '/schedule-list';

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Navigate to={navigateTo} /> : <Outlet />;
};

export default UnProtectedRoute;
