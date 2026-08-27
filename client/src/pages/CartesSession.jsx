import { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header"
import TagCategorie from "../components/TagCategorie";
import { hexToRgba } from "../utils/colors";
import "./CartesSession.scss";

function CartesSession() {
    const { orientation, motsSession, resultatsSession, setResultatsSession } = useSession();
    const navigate = useNavigate();

    const [indexActuel, setIndexActuel] = useState(0);
    const [carteRetournee, setCarteRetournee] = useState(false);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        if (!motsSession || motsSession.length === 0) {
            navigate("/cartes-filtres");
        }
    }, []);

    useEffect(() => {
        async function chargerCategories() {
            const reponse = await fetch("http://localhost:3000/api/categories");
            const donnees = await reponse.json();
            setCategories(donnees);
        }
        async function chargerTypes() {
            const reponse = await fetch("http://localhost:3000/api/types-grammaticaux");
            const donnees = await reponse.json();
            setTypes(donnees);
        }
        chargerCategories();
        chargerTypes();
    }, []);

    if (!motsSession || motsSession.length === 0) {
        return null;
    }

    const motActuel = motsSession[indexActuel];
    const texteRecto = orientation === "fr-vers-id" ? motActuel.traduction : motActuel.racine;
    const categorieActuelle = categories.find((cat) => cat.id_categ === motActuel.id_categ);
    const typeActuel = types.find((t) => t.id_type === motActuel.id_type);

    const styleCouleur = categorieActuelle?.couleur_categ
        ? {
            borderColor: hexToRgba(categorieActuelle.couleur_categ, 0.4),
            boxShadow: `0 8px 24px ${hexToRgba(categorieActuelle.couleur_categ, 0.25)}`
          }
        : {};

        async function repondre(reussi) {
            const resultatCompletSession = [...resultatsSession, { id_mot: motActuel.id_mot, racine: motActuel.racine, reussi: reussi }];
            setResultatsSession(resultatCompletSession);

            const estLaDerniereCarte = indexActuel === motsSession.length - 1;

            if (estLaDerniereCarte) {
                const resultatsFormates = resultatCompletSession.map((resultat) => ({
                    id_mot: resultat.id_mot,
                    est_reussi: resultat.reussi
                }));
                const token = localStorage.getItem("token");
                await fetch("http://localhost:3000/api/sessions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ resultats: resultatsFormates })
                });
                navigate("/resultats-session");
            } else {
                setIndexActuel(indexActuel + 1);
                setCarteRetournee(false);
            }
        }

    return (
        <div>
            <Header />
            <div className="page-flashcard">
                <div className="entete-session">
                    <span className="lien-retour" onClick={() => navigate("/cartes-filtres")}>← Revenir aux filtres</span>
                    <span className="compteur-carte">Carte {indexActuel + 1}/{motsSession.length}</span>
                </div>

                <div className="flip-container">
                    <div className={`flip-carte ${carteRetournee ? "retournee" : ""}`} onClick={() => setCarteRetournee(!carteRetournee)}>

                        {/* --- RECTO --- */}
                        <div className="face-recto" style={styleCouleur}>
                            <div className="kawung-pattern"></div>
                            <div className="carte-badges">
                                {typeActuel && <span className="badge-type">{typeActuel.nom_type.charAt(0).toUpperCase()}</span>}
                                {categorieActuelle && <TagCategorie couleur={categorieActuelle.couleur_categ}>{categorieActuelle.nom_categ}</TagCategorie>}
                            </div>
                            <div className="recto-contenu">
                                <p className="drapeau-langue">{orientation === "fr-vers-id" ? "" : ""} en {orientation === "fr-vers-id" ? "français" : "indonésien"}</p>
                                <p className="mot-affiche">{texteRecto}</p>
                            </div>
                            <p className="instruction-carte">Appuyer pour voir la réponse</p>
                        </div>

                        {/* --- VERSO --- */}
                        <div className="face-verso" style={styleCouleur}>
                            <div className="kawung-pattern"></div>
                            <div className="carte-badges">
                                {typeActuel && <span className="badge-type">{typeActuel.nom_type.charAt(0).toUpperCase()}</span>}
                                {categorieActuelle && <TagCategorie couleur={categorieActuelle.couleur_categ}>{categorieActuelle.nom_categ}</TagCategorie>}
                            </div>
                            <div className="verso-contenu">
                                <div className="drapeaux-ligne-indo">
                                    <img width="24" height="24" src="https://img.icons8.com/color/48/indonesia-circular.png" alt="drapeau indonésien" className="drapeau"/>
                                </div>
                                <div className="mot-ligne">
                                    <p className="mot-label">racine</p>
                                    <div className="mot-entete">
                                        <p className="mot-racine">{motActuel.racine}</p>
                                    </div>
                                </div>
                                {motActuel.forme && (
                                    <div className="mot-ligne">
                                        <p className="mot-label">forme</p>
                                        <div className="mot-formes">
                                            {motActuel.forme.split("/").map((forme) => (
                                                <span key={forme} className="tag-forme">{forme.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="drapeaux-ligne-fr">
                                    <img width="24" height="24" src="https://img.icons8.com/color/48/france-circular.png" alt="drapeau français" className="drapeau"/>
                                </div>
                                <div className="mot-ligne">
                                    <p className="mot-label">traduction</p>
                                    <p className="mot-traduction">{motActuel.traduction}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {carteRetournee && (
                    <div className="boutons-reponse">
                        <button onClick={() => repondre(false)}>✕</button>
                        <button onClick={() => repondre(true)}>✓</button>
                    </div>
                )}
            </div>
        </div>
    )
};

export default CartesSession;