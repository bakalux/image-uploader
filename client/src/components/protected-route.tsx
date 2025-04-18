import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem('access_token');

  if (!token) return <Navigate to="/auth?tab=login" />;

  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) return <Navigate to="/auth" />;
  } catch {
    return <Navigate to="/auth?tab=login" />;
  }

  return children;
}
