import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

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

  return (
    <AuthContext.Provider value={{ user, setUser, chargement }}>
      {children}
    </AuthContext.Provider>
  ); 
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContext;