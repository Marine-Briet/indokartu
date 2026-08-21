import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute() {
  const { user, chargement } = useAuth();

  if (chargement) {
    return <p>Chargement...</p>;
  }


  if (!user) {
    return <Navigate to="/connexion" />;
  }

  return <Outlet />;
}

export default PrivateRoute;