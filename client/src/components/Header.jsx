import './Header.scss';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';


function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <header className="header">
        <p>Indokartu</p>

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
            <button className="btn-deconnexion">Déconnexion</button>
        </div>
    </header>
  );
}

export default Header;