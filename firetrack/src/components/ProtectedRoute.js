import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Redirect to login if there's no current user
    return <Navigate to="/login" />;
  }

  // Render children if user is authenticated
  return children;
}

export default ProtectedRoute;
