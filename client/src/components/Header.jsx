import './Header.scss';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Header({ simple = false }) {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { deconnexion, user } = useAuth();
  const navigate = useNavigate();

  function gererDeconnexion() {
    deconnexion();
    navigate("/");
  }

  return (
    <header className="header">
        <p className="logo-header" onClick={() => navigate(user ? "/tableau-de-bord" : "/")}>IndoKartu</p>

        {!simple && (
          <>
            <nav className={menuOuvert ? "menu menu--ouvert" : "menu"}>
              <button className="btn-fermer" onClick={() => setMenuOuvert(false)}>✕</button>
              <NavLink to="/tableau-de-bord">Tableau de bord</NavLink>
              <NavLink to="/cartes-filtres">Cartes</NavLink>
              <NavLink to="/vocabulaire">Vocabulaire</NavLink>
              <NavLink to="/mes-resultats">Mes résultats</NavLink>
              <NavLink to="/mes-infos">Mes infos</NavLink>
              {user?.est_admin && (
                  <NavLink to="/admin">Gérer les données</NavLink>
              )}
              <button className="btn-deconnexion" onClick={gererDeconnexion}>Déconnexion</button>
            </nav>

            <button className="btn-burger" onClick={() => setMenuOuvert(!menuOuvert)}>☰</button>
          </>
        )}
    </header>
  );
}

export default Header;