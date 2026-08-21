import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute() {
  const { user, chargement } = useAuth();

  if (chargement) {
    return <p>Chargement...</p>;
  }
  
  if (!user || !user.est_admin) {
    return <Navigate to="/connexion" />;
  }

  return <Outlet />;
}

export default AdminRoute;