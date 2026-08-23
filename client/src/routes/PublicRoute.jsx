//Permet de ne pas "retomber" accidentellement sur un formulaire de connexion vide en étant déjà connecté, on reste sur TDB 

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PublicRoute() {
  const { user, chargement } = useAuth();

  if (chargement) {
    return <p>Chargement...</p>;
  }


  if (user) {
    return <Navigate to="/tableau-de-bord" />;
  }

  return <Outlet />;
}

export default PublicRoute;