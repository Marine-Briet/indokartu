import Header from "../components/Header";
import Champ from "../components/Champ";
import Bouton from "../components/Bouton";
import { useState } from 'react';
import './Inscription.scss';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function Inscription() {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState({texte: "", type: ""});

    // Règle de validation du mot de passe 
    const regexMotDePasse = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // --- Appelée à la soumission du formulaire ---
    async function gererInscription(e) {
        e.preventDefault();

        // Validation front (le back revalide aussi =  vraie sécurité)
        if (!regexMotDePasse.test(motDePasse)) {
            setMessage({ texte: "Le mot de passe ne respecte pas les règles demandées", type: "erreur" });
            return;
        }

        const reponse = await fetch(`${API_URL}/api/auth/inscription`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, mot_de_passe: motDePasse })
        });

        const donnees = await reponse.json();
        if (reponse.ok) {
            setMessage({texte: "Inscription réussie! Redirection...", type : "succes"});
            setTimeout(() => navigate("/connexion"), 1500); // laisse le temps de lire le message
        } else {
            setMessage({texte: donnees.message, type: "erreur"});
        }
    }


    return (
        <div className="container">
            <Header simple/>
            <div className="page-centree">
                <form onSubmit={gererInscription}>
                    <div className="carte-formulaire">
                        <div className="formulaire">
                            <p className="titre-formulaire-inscription">Inscription</p>
                            <Champ label="Inscrivez votre adresse mail" type="email" valeur={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre adresse mail..." />
                            <Champ label="Créez un mot de passe" type="password" valeur={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} placeholder="votre mot de passe..." />
                            <p className="mdp-aide">Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (ex: !@#$%^&*)</p>

                            {message.texte && (
                                <p className={`message-formulaire message-formulaire--${message.type}`}>
                                    {message.texte}
                                </p>
                            )}

                            <Bouton type="submit">JE M'INSCRIS</Bouton>
                            <p className="lien-secondaire">Déjà un compte ? <NavLink to="/connexion">Connectez-vous</NavLink></p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Inscription;