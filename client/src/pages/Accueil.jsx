import { useEffect, useState } from "react";
import Bouton from "../components/Bouton";
import { useNavigate } from "react-router-dom";
import "./Accueil.scss";
import { API_URL, DEMO_EMAIL, DEMO_PASSWORD } from '../config';
import { useAuth } from '../context/AuthContext';

function Accueil() {
    const navigate = useNavigate();
    const [nombreMots, setNombreMots] = useState(0);
    const [nombreCategories, setNombreCategories] = useState(0);
    const { connexion } = useAuth();
    const [chargementDemo, setChargementDemo] = useState(false);
    const [erreurDemo, setErreurDemo] = useState("");

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

    //  Appelée au clic sur "Essayer la démo" : connexion directe au compte démo 
    async function connecterDemo() {
        setChargementDemo(true);
        setErreurDemo("");

        try {
            const reussi = await connexion(DEMO_EMAIL, DEMO_PASSWORD);
            if (reussi) {
                navigate("/tableau-de-bord");
            } else {
                setErreurDemo("Le compte démo est momentanément indisponible.");
            }
        } catch {
            setErreurDemo("Le serveur ne répond pas, veuillez réessayer dans un instant.");
        } finally {
            setChargementDemo(false);
        }
    }

    return (
        <div>
            <div className="page-accueil">
                {/*  Illustration : carte "makan" en vedette, entourée de 2 cartes mystère  */}
                <div className="pile-cartes">
                    <div className="carte-mystere carte-mystere--gauche">?</div>
                    <div className="carte-mystere carte-mystere--droite">?</div>
                    <div className="carte-vedette">
                        <img width="24" height="24" src="https://img.icons8.com/color/48/indonesia-circular.png" alt="drapeau indonésien" className="drapeau"/>
                        <p className="mot-carte-vedette">belajar</p>
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

                    {/*  Accès démo pour les visiteurs (recruteurs), sans création de compte  */}
                    <button type="button" className="bouton-demo" onClick={connecterDemo} disabled={chargementDemo}>
                        {chargementDemo ? "Connexion..." : "Essayer la démo"}
                    </button>
                </div>

                {/*  L'API gratuite sur Render peut mettre 30 à 60 s à se réveiller  */}
                {chargementDemo && (
                    <p className="message-attente">Le premier chargement peut prendre jusqu'à une minute (réveil du serveur).</p>
                )}
                {erreurDemo && (
                    <p className="message-formulaire message-formulaire--erreur">{erreurDemo}</p>
                )}
            </div>
        </div>
    )
};

export default Accueil;