import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const routePermissions = {
  '/registered-users': ['admin', 'ec_management'],
  '/registered-users/add': ['admin', 'ec_management'],
  '/registered-users/edit': ['admin', 'ec_management'],
  
  '/user-management': ['admin'],
  '/user-management/invite-user': ['admin'],
  '/user-management/edit-user': ['admin'],
  
  '/schedule-list': ['admin', 'schedule_management'],
  '/schedule-list/create-schedule': ['admin', 'schedule_management'],
  '/schedule-list/bulk-edit': ['admin', 'schedule_management'],
  '/schedule-list/edit-schedule': ['admin', 'schedule_management'],
  
  '/vessel-management': ['admin', 'schedule_management'],
  '/vessel-management/add-vessel': ['admin', 'schedule_management'],
  '/vessel-management/edit-vessel': ['admin', 'schedule_management'],
  
  '/port-management': ['admin', 'schedule_management'],
  '/port-management/add-port': ['admin', 'schedule_management'],
  '/port-management/edit-port': ['admin', 'schedule_management'],
};

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has permission for this route
  const currentPath = '/' + location.pathname.split('/')[1];
  const subPath = location.pathname.includes('/edit') ? '/edit' : 
                 location.pathname.includes('/add') ? '/add' : '';
  
  const fullPathToCheck = subPath ? `${currentPath}${subPath}` : currentPath;
  
  const allowedRoles = routePermissions[fullPathToCheck] || routePermissions[currentPath];
  
  if (!allowedRoles || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;