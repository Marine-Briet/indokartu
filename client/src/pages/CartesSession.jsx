import { useEffect, useState, useRef } from "react";
import { useSession } from "../context/SessionContext";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header"
import TagCategorie from "../components/TagCategorie";
import { hexToRgba } from "../utils/colors";
import "./CartesSession.scss";

function CartesSession() {
    // --- Données venant du Context (transmises depuis CartesFiltres) ---
    const { orientation, motsSession, resultatsSession, setResultatsSession } = useSession();
    const navigate = useNavigate();

    // --- États LOCAUX à cette page ---
    const [indexActuel, setIndexActuel] = useState(0);
    const [carteRetournee, setCarteRetournee] = useState(false);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [transitionActive, setTransitionActive] = useState(true);

    // Référence directe vers la carte, pour forcer le navigateur à "acter"
    // un changement de style avant de réactiver la transition (voir plus bas)
    const carteRef = useRef(null);

    // --- PROTECTION : redirection si arrivée sans mots tirés ---
    useEffect(() => {
        if (!motsSession || motsSession.length === 0) {
            navigate("/cartes-filtres");
        }
    }, []);

    // --- CHARGEMENT INITIAL : catégories/types ---
    useEffect(() => {
        async function chargerCategories() {
            const reponse = await fetch("http://192.168.1.65:3000/api/categories");
            const donnees = await reponse.json();
            setCategories(donnees);
        }
        async function chargerTypes() {
            const reponse = await fetch("http://192.168.1.65:3000/api/types-grammaticaux");
            const donnees = await reponse.json();
            setTypes(donnees);
        }
        chargerCategories();
        chargerTypes();
    }, []);

    // --- Réactive la transition après un flip "sans transition" (changement de carte) ---
    // IMPORTANT : ce useEffect doit rester ICI, avec tous les autres Hooks,
    // TOUJOURS AVANT les "if (...) return" plus bas (règle des Hooks React :
    // le nombre et l'ordre des Hooks doit être identique à chaque rendu)
    useEffect(() => {
        if (!transitionActive && carteRef.current) {
            // Force le navigateur à appliquer le style actuel avant de continuer
            // (lire offsetHeight déclenche ce recalcul, appelé "reflow")
            void carteRef.current.offsetHeight;

            // On attend le prochain rafraîchissement d'écran avant de réactiver
            // la transition, une fois sûrs que le saut instantané a été affiché
            requestAnimationFrame(() => {
                setTransitionActive(true);
            });
        }
    }, [transitionActive]);

    // --- PROTECTIONS D'AFFICHAGE : à partir d'ici, plus aucun Hook ne doit être ajouté ---
    if (!motsSession || motsSession.length === 0) {
        return null;
    }

    if (categories.length === 0 || types.length === 0) {
        return null;
    }

    // --- Mot actuellement affiché + infos calculées pour cette carte précise ---
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

    // --- Appelée au clic sur ✕ ou ✓ : enregistre la réponse, avance, ou termine la session ---
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
            await fetch("http://192.168.1.65:3000/api/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ resultats: resultatsFormates })
            });
            navigate("/resultats-session");
        } else {
            // On coupe la transition ET on passe à la carte suivante en même temps,
            // pour ne jamais voir le contenu du verso pendant le retour au recto
            setTransitionActive(false);
            setIndexActuel(indexActuel + 1);
            setCarteRetournee(false);
        }
    }

    return (
        <div>
            <Header />
            <div className="page-flashcard">
                {/* --- En-tête : retour aux filtres + progression --- */}
                <div className="entete-session">
                    <span className="lien-retour" onClick={() => navigate("/cartes-filtres")}>← Revenir aux filtres</span>
                    <span className="compteur-carte">Carte {indexActuel + 1}/{motsSession.length}</span>
                </div>

                {/* Le clic ne retourne la carte QUE si elle est encore au recto */}
                <div className="flip-container">
                    <div
                        ref={carteRef}
                        className={`flip-carte ${carteRetournee ? "retournee" : ""} ${!transitionActive ? "sans-transition" : ""}`}
                        onClick={() => setCarteRetournee(!carteRetournee)}
                    >

                        {/* --- RECTO --- */}
                        <div className="face-recto" style={styleCouleur}>
                            <div className="kawung-pattern"></div>
                            <div className="carte-badges">
                                {typeActuel && <span className="badge-type">{typeActuel.nom_type.charAt(0).toUpperCase()}</span>}
                                {categorieActuelle && <TagCategorie couleur={categorieActuelle.couleur_categ}>{categorieActuelle.nom_categ}</TagCategorie>}
                            </div>
                            <div className="recto-contenu">
                                <p className="drapeau-langue">{orientation === "fr-vers-id" ? "🇫🇷" : "🇮🇩"} en {orientation === "fr-vers-id" ? "français" : "indonésien"}</p>
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

                {/* Boutons ✕/✓ visibles uniquement une fois la carte retournée */}
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