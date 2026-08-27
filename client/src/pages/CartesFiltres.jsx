import { useContext, useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import Header from "../components/Header"
import Bouton from "../components/Bouton"
import "./CartesFiltres.scss";
import { useNavigate } from 'react-router-dom';



function CartesFiltres() {
    
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const { categoriesSelectionnees, setCategoriesSelectionnees, 
        typesSelectionnes, setTypesSelectionnes, 
        orientation, setOrientation, 
        nombreCartes, setNombreCartes,
        setMotsSession,
        setResultatsSession 
        } = useSession();
    const navigate = useNavigate();
    const [erreur, setErreur] = useState("");
    const [mots, setMots] = useState([]);

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

        async function chargerMots() {
            const reponse = await fetch("http://localhost:3000/api/mots");
            const donnees = await reponse.json();
            setMots(donnees);
        }

        chargerCategories();
        chargerTypes();
        chargerMots();
    }, []);


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

    // --- TOGGLE FILTRES : ajoute/retire ---
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

    function commencerSession() {
        if (typesSelectionnes.length === 0 || categoriesSelectionnees.length === 0) {
            setErreur("Sélectionne au moins un type et une catégorie pour commencer.");
            return;
        }

        const motsMelanges = [...motsCorrespondants].sort(() => Math.random() - 0.5);
        const nombreATirer = nombreCartes === "toutes" ? motsMelanges.length : nombreCartes;
        const motsTires = motsMelanges.slice(0, nombreATirer);

        setMotsSession(motsTires);
        setResultatsSession([]); //repartir d'une liste de résultats vide pour cette nouvelle session
        navigate("/cartes-session");
    }

    const motsCorrespondants = mots.filter((mot) => 
        typesSelectionnes.includes(mot.id_type) && categoriesSelectionnees.includes(mot.id_categ)
    );

    const nombreCartesReel = nombreCartes === "toutes" ? motsCorrespondants.length : Math.min(nombreCartes, motsCorrespondants.length);

    return (
        <div>
            <Header />
            <div className="page-contenu">
                <h1>Cartes</h1>

                {/* --- FILTRES TYPES GRAMMATICAUX --- */}
                <div className="section-filtre">
                    <div className="entete-section">
                        <p className="instruction-filtre">Choisir un type grammatical (ou plusieurs) :</p>
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

                {/* --- FILTRES CATÉGORIES --- */}
                <div className="section-filtre">
                    <div className="entete-section">
                        <p className="instruction-filtre">Choisir une catégorie (ou plusieurs) :</p>
                        <span className="tout-selectionner" onClick={categoriesSelectionnees.length === categories.length ? toutDeselectionnerCategories : toutSelectionnerCategories}>
                            {categoriesSelectionnees.length === categories.length ? "Tout désélectionner" : "Tout sélectionner"}
                        </span>
                    </div>
                </div>
                <div className="filtres-categories-lignes">
                    {categories.map((cat) => (
                        <Bouton
                        key={cat.id_categ}
                        variant="ligne-categorie"
                        couleur={cat.couleur_categ}
                        actif={categoriesSelectionnees.includes(cat.id_categ)}
                        onClick={() => toggleCategorie(cat.id_categ)}
                        >
                        {cat.nom_categ}
                        </Bouton>
                    ))}
                </div>

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
