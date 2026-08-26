import { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header"
import Card from "../components/Card"
import TagCategorie from "../components/TagCategorie";
import "./CartesSession.scss";

function CartesSession() {

    // --- Données venant du Context (transmises depuis CartesFiltres) ---
    const { orientation,
        motsSession, resultatsSession,
        setResultatsSession
        } = useSession();
    const navigate = useNavigate();

    // --- États LOCAUX à cette page  ---
    const [indexActuel, setIndexActuel] = useState(0);       // quelle carte est affichée (0 = première)
    const [carteRetournee, setCarteRetournee] = useState(false); // recto (false) ou verso (true)
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    // --- PROTECTION : si on arrive ici sans avoir tiré de mots, on renvoie vers les filtres ---
    useEffect(() => {
        if (!motsSession || motsSession.length === 0) {
            navigate("/cartes-filtres");
        }
    }, []);

    // --- CHARGEMENT INITIAL : catégories/types, pour afficher les badges sur chaque carte ---
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

    // Ne rien afficher tant qu'on n'est pas sûr que motsSession existe
    if (!motsSession || motsSession.length === 0) {
        return null;
    }

    // --- Mot actuellement affiché + infos calculées pour cette carte précise ---
    const motActuel = motsSession[indexActuel];
    const texteRecto = orientation === "fr-vers-id" ? motActuel.traduction : motActuel.racine;
    const categorieActuelle = categories.find((cat) => cat.id_categ === motActuel.id_categ);
    const typeActuel = types.find((t) => t.id_type === motActuel.id_type);

    // --- Appelée au clic sur ✕ ou ✓ : enregistre la réponse, avance, ou termine la session ---
    async function repondre(reussi) {
        // Construction du tableau complet (plutôt que de relire resultatsSession,
        // qui ne serait pas encore à jour à cause du fonctionnement asynchrone de useState)
        const resultatCompletSession = [...resultatsSession, { id_mot: motActuel.id_mot, racine: motActuel.racine, reussi: reussi }];
        setResultatsSession(resultatCompletSession);

        const estLaDerniereCarte = indexActuel === motsSession.length - 1;

        if (estLaDerniereCarte) {
            // On adapte les noms de champs à ce qu'attend le back (est_reussi, pas reussi)
            const resultatsFormates = resultatCompletSession.map((resultat) => ({
                id_mot: resultat.id_mot,
                est_reussi: resultat.reussi
            }));

            // Route protégée par JWT : on récupère le token stocké à la connexion
            const token = localStorage.getItem("token");

            // Envoi de la session complète à l'API (MongoDB), avant de voir le résultat
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
            // Pas encore la dernière carte : on avance simplement
            setIndexActuel(indexActuel + 1);
            setCarteRetournee(false); // la nouvelle carte doit réafficher son recto
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

            {/* Le clic ne retourne la carte QUE si elle est encore au recto (sinon rien ne se passe) */}
            <Card className="carte-flashcard" couleurBordure={categorieActuelle?.couleur_categ} onClick={!carteRetournee ? () => setCarteRetournee(true) : undefined}>
                <div className="kawung-pattern"></div>
                {/* Badges (type + catégorie)*/}
                {!carteRetournee && (
                    <div className="carte-badges">
                        {typeActuel && <span className="badge-type">{typeActuel.nom_type.charAt(0).toUpperCase()}</span>}
                        {categorieActuelle && <TagCategorie couleur={categorieActuelle.couleur_categ}>{categorieActuelle.nom_categ}</TagCategorie>}
                    </div>
                )}

                {!carteRetournee ? (
                    /* --- RECTO : mot à deviner + instruction --- */
                    <div className="carte-recto">
                        <div className="recto-contenu">
                            <p className="drapeau-langue">{orientation === "fr-vers-id" ? "🇫🇷" : "🇮🇩"} en {orientation === "fr-vers-id" ? "français" : "indonésien"}</p>
                            <p className="mot-affiche">{texteRecto}</p>
                        </div>
                        <p className="instruction-carte">Appuyer pour voir la réponse</p>
                    </div>
                ) : (
                    /* --- VERSO : détail complet du mot (racine, forme, traduction) --- */
                    <div className="carte-verso">
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
                )}
            </Card>

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