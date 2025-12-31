// frontend/src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly=false }) => {
  const { auth } = useContext(AuthContext);
  if (!auth?.token) return <Navigate to="/login" replace />;
  if (adminOnly && auth.user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
