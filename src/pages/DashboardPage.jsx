import React from 'react';
import { Navigate } from 'react-router-dom';

const DashboardPage = ({ session }) => {
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  return <Navigate to="/" replace />;
};

export default DashboardPage;