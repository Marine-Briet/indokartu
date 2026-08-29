import { useEffect, useState } from "react";
import Bouton from "../components/Bouton";
import { useNavigate } from "react-router-dom";
import "./Accueil.scss";
import { API_URL } from '../config';

function Accueil() {
    const navigate = useNavigate();
    const [nombreMots, setNombreMots] = useState(0);
    const [nombreCategories, setNombreCategories] = useState(0);

    //  CHARGEMENT : chiffres réels affichés sur la page (mots/thèmes disponibles) 
    useEffect(() => {
        async function chargerMots() {
            const reponse = await fetch(`${API_URL}/api/mots`);
            const donnees = await reponse.json();
            setNombreMots(donnees.length);
        }

        async function chargerCategories() {
            const reponse = await fetch(`${API_URL}/api/categories`);
            const donnees = await reponse.json();
            setNombreCategories(donnees.length);
        }

        chargerMots();
        chargerCategories();
    }, []);

    return (
        <div>
            <div className="page-accueil">
                {/*  Illustration : carte "makan" en vedette, entourée de 2 cartes mystère  */}
                <div className="pile-cartes">
                    <div className="carte-mystere carte-mystere--gauche">?</div>
                    <div className="carte-mystere carte-mystere--droite">?</div>
                    <div className="carte-vedette">
                        <p className="drapeau-carte-vedette">🇮🇩 en indonésien</p>
                        <p className="mot-carte-vedette">makan</p>
                    </div>
                </div>

                <p className="titre-accueil">IndoKartu</p>
                <p className="accroche-accueil">Apprends le vocabulaire indonésien, une carte à la fois.</p>

                <div className="chiffres-accueil">
                    <div className="chiffre-bloc">
                        <p className="chiffre-valeur">{nombreMots}</p>
                        <p className="chiffre-label">mots</p>
                    </div>
                    <div className="chiffre-separateur"></div>
                    <div className="chiffre-bloc">
                        <p className="chiffre-valeur">{nombreCategories}</p>
                        <p className="chiffre-label">thèmes</p>
                    </div>
                </div>

                <div className="boutons-accueil">
                    <Bouton variant="cta" onClick={() => navigate("/connexion")}>Se connecter</Bouton>
                    <Bouton variant="cta" onClick={() => navigate("/inscription")}>S'inscrire</Bouton>
                </div>
            </div>
        </div>
    )
};

export default Accueil;