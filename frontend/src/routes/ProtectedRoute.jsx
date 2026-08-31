import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ role, children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/connexion" replace />;
  if (role && user?.role && user.role !== role) return <Navigate to={`/${user.role}`} replace />;
  return children;
}
