import Card from "../components/Card";
import Header from "../components/Header";
import Champ from "../components/Champ";
import Bouton from "../components/Bouton";
import { useState } from 'react';
import './Inscription.scss';
import { NavLink } from 'react-router-dom';

function Inscription() {
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    
    return (
        <div className="container">
            <Header simple/>
            <div className="page-centree">
                <form>
                    <Card className="carte-formulaire">
                        <div className="formulaire">
                            <h1 className="titre-formulaire-inscription">Inscription</h1>
                            <Champ label="Inscrire votre adresse mail" type="email" valeur={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre adresse mail..." />
                            <Champ label="Créez un mot de passe" type="password" valeur={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} placeholder="votre mot de passe..." />
                            <p className="mdp-aide">Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (ex: !?#)</p>
                            <Bouton type="submit" >JE M'INSCRIS</Bouton>
                            <p className="lien-secondaire">Déjà un compte ? <NavLink to="/connexion">Connectez-vous</NavLink></p>
                        </div>
                    </Card>
                </form>
            </div>
        </div>
    )
};

export default Inscription;