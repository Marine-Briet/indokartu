import Card from "../components/Card";
import Header from "../components/Header";
import Champ from "../components/Champ";
import Bouton from "../components/Bouton";
import { useState } from 'react';
import './Connexion.scss';
import { NavLink } from 'react-router-dom';

function Connexion() {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    
    return (
        <div className="container">
            <Header simple/>
            <div className="page-centree">
                <form>
                    <Card className="carte-formulaire">
                        <div className="formulaire">
                            <h1 className="titre-formulaire-connexion">Connexion</h1>
                            <Champ label="Votre adresse mail" type="email" valeur={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre adresse mail..." />
                            <Champ label="Votre mot de passe" type="password" valeur={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} placeholder="votre mot de passe..." />
                            <Bouton type="submit" >JE ME CONNECTE</Bouton>
                            <p className="lien-secondaire">Pas de compte ? <NavLink to="/inscription">Inscrivez-vous</NavLink></p>
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    )
};

export default Connexion;