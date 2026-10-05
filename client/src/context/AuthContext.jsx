import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodage = jwtDecode(token);
      setUser({ id_utilisateur: decodage.id_utilisateur, est_admin: decodage.est_admin });
    }
    setChargement(false);
  }, []);


  // Connexion partagée : formulaire (Connexion.jsx) et bouton démo (Accueil.jsx)
  // Renvoie true si la connexion a réussi, false si les identifiants sont refusés.
  // Lève une erreur si le serveur ne répond pas (à gérer avec try/catch dans la page).
  async function connexion(email, motDePasse) {
    const reponse = await fetch(`${API_URL}/api/auth/connexion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, mot_de_passe: motDePasse })
    });

    if (!reponse.ok) {
      return false;
    }

    const donnees = await reponse.json();
    localStorage.setItem("token", donnees.token);
    const decodage = jwtDecode(donnees.token);
    setUser({ id_utilisateur: decodage.id_utilisateur, est_admin: decodage.est_admin });
    return true;
  }

  function deconnexion() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, chargement, connexion, deconnexion }}>
      {children}
    </AuthContext.Provider>
  ); 
}

export function useAuth() {
    return useContext(AuthContext);
}


export default AuthContext;