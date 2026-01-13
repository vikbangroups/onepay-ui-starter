// src/routes/RoleProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AccessRules } from '../config/accessControl';

interface RoleProtectedRouteProps {
  screenKey: string; // e.g. 'add-money', 'user-approvals'
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ screenKey }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  const allowed = Array.isArray(AccessRules[user.role]) && AccessRules[user.role].includes(screenKey);

  if (!allowed) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>🚫 Access Denied</h2>
        <p>Your role (<strong>{user.role}</strong>) is not authorized to access this page.</p>
      </div>
    );
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
