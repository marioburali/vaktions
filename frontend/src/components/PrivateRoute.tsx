import { Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';

type PrivateRouteProps = {
  children: ReactElement;
};

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
