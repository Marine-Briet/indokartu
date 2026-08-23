import './Header.scss';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Header({ simple = false}) {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const {deconnexion} = useAuth();
  const navigate = useNavigate();;

  function gererDeconnexion() {
    deconnexion();
    navigate("/");
  }
  

  return (
    <header className="header">
        <p>IndoKartu</p>

        {!simple && (
          <>
            <nav className={menuOuvert ? "menu menu--ouvert" : "menu"}>
                <button className="btn-fermer" onClick={() => setMenuOuvert(false)}>✕</button>
                <NavLink to="/tableau-de-bord">Tableau de bord</NavLink>
                <NavLink to="/cartes-filtres">Cartes</NavLink>
                <NavLink to="/vocabulaire">Vocabulaire</NavLink>
                <NavLink to="/mes-resultats">Mes résultats</NavLink>
                <NavLink to="/mes-infos">Mes infos</NavLink>
                <NavLink to="/admin">Gérer les données</NavLink>
            </nav>

            <div className="header__droite">
                <button className="btn-burger" onClick={() => setMenuOuvert(!menuOuvert)}>☰</button>
                <button className="btn-deconnexion" onClick={gererDeconnexion}>Déconnexion</button>
            </div>
          </>
        )}
    </header>
  );
}

export default Header;