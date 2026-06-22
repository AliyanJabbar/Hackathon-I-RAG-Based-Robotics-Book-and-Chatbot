import React from 'react';
import { Redirect } from '@docusaurus/router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Redirect to="/login" />;
  }

  return children;
};

export default ProtectedRoute;