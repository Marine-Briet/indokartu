import Header from "../components/Header";
import Champ from "../components/Champ";
import Bouton from "../components/Bouton";
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Connexion.scss';


function Connexion() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [message, setMessage] = useState({texte: "", type: ""});
    const [aideOuvert, setAideOuvert] = useState(false);

    // --- Appelée à la soumission du formulaire ---
    async function gererConnexion(e) {
        e.preventDefault();

        const reponse = await fetch("http://localhost:3000/api/auth/connexion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, mot_de_passe: motDePasse })
        });

        const donnees = await reponse.json();
        if (reponse.ok) {
            // Connexion réussie : token stocké, Context mis à jour, redirection
            localStorage.setItem("token", donnees.token);
            const decodage = jwtDecode(donnees.token);
            setUser({ id_utilisateur: decodage.id_utilisateur, est_admin: decodage.est_admin });
            setMessage({texte: "Connexion réussie! Redirection...", type: "succes"});
            navigate("/tableau-de-bord");
        } else {
            // Message générique volontairement (pas de distinction email/mot de passe, pour la sécurité)
            setMessage({ texte: "Email ou mot de passe incorrect", type: "erreur"});
        }
    }

    return (
        <div className="container">
            <Header simple/>
            <div className="page-centree">
                <form onSubmit={gererConnexion}>
                    <div className="carte-formulaire">
                        <div className="formulaire">
                            <p className="titre-formulaire-connexion">Connexion</p>
                            <Champ label="Votre adresse mail" type="email" valeur={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre adresse mail..." />
                            <Champ label="Votre mot de passe" type="password" valeur={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} placeholder="votre mot de passe..." />

                            {/* --- Bulle d'aide "mot de passe oublié" --- */}
                            <button type="button" className="lien-aide" onClick={() => setAideOuvert(!aideOuvert)}>
                                Mot de passe oublié ?
                            </button>
                            {aideOuvert && (
                                <div className="modal-overlay" onClick={() => setAideOuvert(false)}>
                                    <div className="modal-contenu" onClick={(e) => e.stopPropagation()}>
                                        <button type="button" className="modal-fermer" onClick={() => setAideOuvert(false)}>✕</button>
                                        <p className="modal-text">Si vous avez oublié votre mot de passe, veuillez contacter l'administrateur via cette adresse email : admin@indokartu.fr</p>
                                    </div>
                                </div>
                            )}

                            {/* --- Message de succès/erreur --- */}
                            {message.texte && (
                                <p className={`message-formulaire message-formulaire--${message.type}`}>
                                    {message.texte}
                                </p>
                            )}

                            <Bouton type="submit">JE ME CONNECTE</Bouton>
                            <p className="lien-secondaire">Pas de compte ? <NavLink to="/inscription">Inscrivez-vous</NavLink></p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Connexion;