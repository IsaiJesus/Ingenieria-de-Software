import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Este componente (wrapper) verifica si el usuario está autenticado.
 * Recibe un componente 'children' (tu página).
 * * Si el usuario está autenticado, renderiza 'children'.
 * Si no lo está, redirige al usuario a la página de /login.
 */
export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario existe, renderiza la página que le pasaste
  return children;
};