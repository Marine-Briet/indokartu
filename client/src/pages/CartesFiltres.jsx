import { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import Header from "../components/Header"
import Bouton from "../components/Bouton"
import "./CartesFiltres.scss";
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function CartesFiltres() {

    // ÉTATS : données venant de l'API (chargées localement, pas dans le Context) 
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [mots, setMots] = useState([]);

    // Données/actions du Context (partagées avec CartesSession et ResultatsSession) 
    const { categoriesSelectionnees, setCategoriesSelectionnees,
        typesSelectionnes, setTypesSelectionnes,
        orientation, setOrientation,
        nombreCartes, setNombreCartes,
        setMotsSession,
        setResultatsSession
        } = useSession();
    const navigate = useNavigate();

    // État local : message de blocage si aucun filtre sélectionné 
    const [erreur, setErreur] = useState("");

    // CHARGEMENT INITIAL : les 3 sources de données, une seule fois au montage 
    useEffect(() => {
        async function chargerCategories() {
            const reponse = await fetch(`${API_URL}/api/categories`);
            const donnees = await reponse.json();
            setCategories(donnees);
        }

        async function chargerTypes() {
            const reponse = await fetch(`${API_URL}/api/types-grammaticaux`);
            const donnees = await reponse.json();
            setTypes(donnees);
        }

        async function chargerMots() {
            const reponse = await fetch(`${API_URL}/api/mots`);
            const donnees = await reponse.json();
            setMots(donnees);
        }

        chargerCategories();
        chargerTypes();
        chargerMots();
    }, []);

    // PRÉ-SÉLECTION : une fois catégories/types chargés, on les coche tous par défaut 
    // (contrairement à Vocabulaire, où rien n'est sélectionné au départ)
    useEffect(() => {
        if (categories.length > 0) {
            setCategoriesSelectionnees(categories.map((cat) => cat.id_categ));
        }
    }, [categories]);

    useEffect(() => {
        if (types.length > 0) {
            setTypesSelectionnes(types.map((t) => t.id_type));
        }
    }, [types]);

    // TOGGLE FILTRES : ajoute/retire un id du tableau de sélection au clic 
    function toggleType(id) {
        if (typesSelectionnes.includes(id)) {
            setTypesSelectionnes(typesSelectionnes.filter((t) => t !== id));
        } else {
            setTypesSelectionnes([...typesSelectionnes, id]);
        }
    }

    function toggleCategorie(id) {
        if (categoriesSelectionnees.includes(id)) {
            setCategoriesSelectionnees(categoriesSelectionnees.filter((t) => t !== id));
        } else {
            setCategoriesSelectionnees([...categoriesSelectionnees, id]);
        }
    }

    // TOUT SÉLECTIONNER / DÉSÉLECTIONNER 
    function toutSelectionnerTypes() {
        setTypesSelectionnes(types.map((t) => t.id_type));
    }

    function toutDeselectionnerTypes() {
        setTypesSelectionnes([]);
    }

    function toutSelectionnerCategories() {
        setCategoriesSelectionnees(categories.map((cat) => cat.id_categ));
    }

    function toutDeselectionnerCategories() {
        setCategoriesSelectionnees([]);
    }

    // Mots correspondant aux filtres actuellement sélectionnés 
    const motsCorrespondants = mots.filter((mot) =>
        typesSelectionnes.includes(mot.id_type) && categoriesSelectionnees.includes(mot.id_categ)
    );

    // Nombre réel de cartes qui seront tirées (jamais plus que ce qui est réellement disponible) 
    const nombreCartesReel = nombreCartes === "toutes" ? motsCorrespondants.length : Math.min(nombreCartes, motsCorrespondants.length);

    // Appelée au clic sur "Commencer" : tirage aléatoire + redirection vers la session 
    function commencerSession() {
        if (typesSelectionnes.length === 0 || categoriesSelectionnees.length === 0) {
            setErreur("Sélectionne au moins un type et une catégorie pour commencer.");
            return;
        }

        // Mélange le tableau, puis garde les N premiers mots (tirage aléatoire)
        const motsMelanges = [...motsCorrespondants].sort(() => Math.random() - 0.5);
        const nombreATirer = nombreCartes === "toutes" ? motsMelanges.length : nombreCartes;
        const motsTires = motsMelanges.slice(0, nombreATirer);

        setMotsSession(motsTires);
        setResultatsSession([]); // repartir d'une liste de résultats vide pour cette nouvelle session
        navigate("/cartes-session");
    }

    function categorieDisponible(id_categ) {
        return mots.some((mot) => mot.id_categ === id_categ && typesSelectionnes.includes(mot.id_type));
    }

    return (
        <div>
            <Header />
            <div className="page-contenu">
                <h1>Cartes</h1>

                {/* FILTRES TYPES GRAMMATICAUX */}
                <div className="section-filtre">
                    <div className="entete-section">
                        <p className="instruction-filtre">Type grammatical (ou plusieurs) :</p>
                        <span className="tout-selectionner" onClick={typesSelectionnes.length === types.length ? toutDeselectionnerTypes : toutSelectionnerTypes}>
                            {typesSelectionnes.length === types.length ? "Tout désélectionner" : "Tout sélectionner"}
                        </span>
                    </div>
                </div>
                <div className="filtres-types">
                    {types.map((type) => (
                        <Bouton key={type.id_type} variant="filtre" actif={typesSelectionnes.includes(type.id_type)} onClick={() => toggleType(type.id_type)}>
                            {type.nom_type}
                        </Bouton>
                    ))}
                </div>

                {/* FILTRES CATÉGORIES (rangées + checkbox, style différent de Vocabulaire) */}
                <div className="section-filtre">
                    <div className="entete-section">
                        <p className="instruction-filtre">Catégorie (ou plusieurs) :</p>
                        <span className="tout-selectionner" onClick={categoriesSelectionnees.length === categories.length ? toutDeselectionnerCategories : toutSelectionnerCategories}>
                            {categoriesSelectionnees.length === categories.length ? "Tout désélectionner" : "Tout sélectionner"}
                        </span>
                    </div>
                </div>
                <div className="filtres-categories-lignes">
                    {categories
                        .slice()
                        .sort((a,b) => a.nom_categ.localeCompare(b.nom_categ))
                        .map((cat) => {
                        const disponible = categorieDisponible(cat.id_categ);
                        return (
                            <Bouton
                                key={cat.id_categ}
                                variant="ligne-categorie"
                                couleur={cat.couleur_categ}
                                actif={disponible && categoriesSelectionnees.includes(cat.id_categ)}
                                onClick={disponible ? () => toggleCategorie(cat.id_categ) : undefined}
                                className={!disponible ? "categorie-desactivee" : ""}
                            >
                                {cat.nom_categ}
                            </Bouton>
                        );
                    })}
                </div>

                {/* ORIENTATION : choix UNIQUE (pas de tableau, une seule valeur) */}
                <div className="section-orientation">
                    <p className="instruction-filtre">Orientation :</p>
                    <div className="choix-orientation">
                        <Bouton variant="filtre" actif={orientation === "fr-vers-id"} onClick={() => setOrientation("fr-vers-id")}>
                            🇫🇷 → 🇮🇩
                        </Bouton>
                        <Bouton variant="filtre" actif={orientation === "id-vers-fr"} onClick={() => setOrientation("id-vers-fr")}>
                            🇮🇩 → 🇫🇷
                        </Bouton>
                    </div>
                </div>

                {/* NOMBRE DE CARTES : choix UNIQUE aussi */}
                <div className="section-nombre">
                    <p className="instruction-filtre">Nombre de cartes :</p>
                    <div className="choix-nombre">
                        <Bouton variant="filtre" actif={nombreCartes === 10} onClick={() => setNombreCartes(10)}>10</Bouton>
                        <Bouton variant="filtre" actif={nombreCartes === 20} onClick={() => setNombreCartes(20)}>20</Bouton>
                        <Bouton variant="filtre" actif={nombreCartes === "toutes"} onClick={() => setNombreCartes("toutes")}>TOUTES</Bouton>
                    </div>
                </div>

                {erreur && <p className="message-formulaire message-formulaire--erreur">{erreur}</p>}
                <Bouton variant="cta" onClick={commencerSession}>
                    COMMENCER ({nombreCartesReel} mot{nombreCartesReel > 1 ? "s" : ""})
                </Bouton>
            </div>
        </div>
    )
};

export default CartesFiltres;