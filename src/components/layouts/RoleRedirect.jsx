import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const { role } = user;
  
  const dashboardRoutes = {
    'admin': '/schedule-list',
    'ec_management': '/registered-users',
    'schedule_management': '/schedule-list'
  };
  
  const redirectPath = dashboardRoutes[role] || '/';
  return <Navigate to={redirectPath} replace />;
};

export default RoleRedirect;