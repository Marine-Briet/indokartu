import Card from "../components/Card";
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
            localStorage.setItem("token", donnees.token);
            const decodage = jwtDecode(donnees.token);
            setUser({ id_utilisateur: decodage.id_utilisateur, est_admin: decodage.est_admin });
            navigate("/tableau-de-bord");   
        } else {
            console.log("Erreur :", donnees.message);
        }
    }

    return (
        <div className="container">
            <Header simple/>
            <div className="page-centree">
                <form onSubmit={gererConnexion}>
                    <Card className="carte-formulaire">
                        <div className="formulaire">
                            <h1 className="titre-formulaire-connexion">Connexion</h1>
                            <Champ label="Votre adresse mail" type="email" valeur={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre adresse mail..." />
                            <Champ label="Votre mot de passe" type="password" valeur={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} placeholder="votre mot de passe..." />
                            <Bouton type="submit">JE ME CONNECTE</Bouton>
                            <p className="lien-secondaire">Pas de compte ? <NavLink to="/inscription">Inscrivez-vous</NavLink></p>
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    )
};

export default Connexion;