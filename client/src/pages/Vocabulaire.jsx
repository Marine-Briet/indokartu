import { useEffect, useState } from "react";
import Card from "../components/Card";
import './Vocabulaire.scss';
import TagCategorie from "../components/TagCategorie"
import Header from "../components/Header"
import Bouton from "../components/Bouton"


function Vocabulaire() {
    //  ÉTATS : données venant de l'API 
    const [mots, setMots] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    //  ÉTATS : recherche et filtres sélectionnés par l'utilisateur 
    const [recherche, setRecherche] = useState("");
    const [typesSelectionnes, setTypesSelectionnes] = useState([]); // tableau d'id_type
    const [categoriesSelectionnees, setCategoriesSelectionnees] = useState([]); // tableau d'id_categ

    //  CHARGEMENT INITIAL : les 3 appels API, une seule fois au montage du composant 
    useEffect(() => {
        async function chargerMots() {
            const reponse = await fetch ("http://localhost:3000/api/mots");
            const donnees =  await reponse.json();
            setMots(donnees);
        }
    
        async function chargerCategories() {
            const reponse = await fetch ("http://localhost:3000/api/categories");
            const donnees = await reponse.json();
            setCategories(donnees);
        }
    
        async function chargerTypes() {
            const reponse = await fetch ("http://localhost:3000/api/types-grammaticaux");
            const donnees = await reponse.json();
            setTypes(donnees);
        }
        chargerMots();
        chargerCategories();
        chargerTypes();

    },[]);

    //  FILTRAGE : calcule la liste finale de mots à afficher, à chaque re-render 
    // Règles combinées : recherche texte (racine OU traduction) + filtre type + filtre catégorie
    // + rien ne s'affiche tant qu'aucune recherche ni aucun filtre n'est actif
    const motsFiltres = mots.filter((mot) => {
        const correspondRecherche = 
            mot.racine.toLowerCase().includes(recherche.toLowerCase()) ||
            mot.traduction.toLowerCase().includes(recherche.toLowerCase())
        ;

        const correspondType = 
            typesSelectionnes.length === 0 || typesSelectionnes.includes(mot.id_type)
        ;

        const correspondCategorie = 
            categoriesSelectionnees.length === 0 || categoriesSelectionnees.includes(mot.id_categ)
        ;

        // Au moins UNE action (recherche tapée OU filtre type OU filtre catégorie) doit exister,
        // sinon on n'affiche rien par défaut
        const auMoinsUneAction =
            recherche.trim() !== "" || typesSelectionnes.length > 0 || categoriesSelectionnees.length > 0
        ;

        return auMoinsUneAction && correspondRecherche && correspondType && correspondCategorie;
    })
    .sort((a, b) => a.racine.localeCompare(b.racine));


    //  TOGGLE FILTRES : ajoute/retire un id du tableau de sélection au clic 
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

    //  TOUT SÉLECTIONNER / DÉSÉLECTIONNER : remplit ou vide le tableau de sélection 
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

    return (
        <div>
            <Header />
            <div className="page-contenu">
                <h1>Vocabulaire</h1>

                {/*  BARRE DE RECHERCHE  */}
                <div>
                    <input className="barre-recherche" 
                    type="text" 
                    value={recherche} 
                    onChange={(e) => setRecherche(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }} //pour enlever le clavier téléphone quand on appuie sur "Entrer"
                    placeholder="Recherche un mot en français ou indonésien..." />
                </div>

                {/*  FILTRES TYPES GRAMMATICAUX  */}
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
                
                {/*  FILTRES CATÉGORIES  */}
                <div className="section-filtre">
                    <div className="entete-section">
                        <p className="instruction-filtre">Catégorie (ou plusieurs) :</p>
                        <span className="tout-selectionner" onClick={categoriesSelectionnees.length === categories.length ? toutDeselectionnerCategories : toutSelectionnerCategories}>
                            {categoriesSelectionnees.length === categories.length ? "Tout désélectionner" : "Tout sélectionner"}
                        </span>
                    </div>
                </div>
                <div className="filtres-categories">
                    {categories.map((cat) => (
                        <Bouton
                        key={cat.id_categ}
                        variant="filtre-categorie"
                        couleur={cat.couleur_categ}
                        actif={categoriesSelectionnees.includes(cat.id_categ)}
                        onClick={() => toggleCategorie(cat.id_categ)}
                        >
                        {cat.nom_categ}
                        </Bouton>
                    ))}
                </div>
                
                {/*  COMPTEUR + LISTE DES MOTS FILTRÉS  */}
                <p className="compteur-mots">{motsFiltres.length} mot{motsFiltres.length > 1 ? "s" : ""} affiché{motsFiltres.length > 1 ? "s" : ""}</p>
                <div>
                    {motsFiltres.map((mot) => {
                        // Croisement des id_categ / id_type du mot avec les vraies infos (nom, couleur)
                        const categorie = categories.find((cat) => cat.id_categ === mot.id_categ);
                        const type = types.find((t) => t.id_type === mot.id_type);

                        return (
                            <Card key={mot.id_mot} className="carte-mot">
                                {/* Ligne 1 : racine + badge type + tag catégorie */}
                                <div className="mot-ligne">
                                    <p className="mot-label">racine</p>
                                    <div className="mot-entete">
                                        <p className="mot-racine">{mot.racine}</p>
                                        <div className="mot-badges">
                                            {type && <span className="badge-type">{type.nom_type.charAt(0).toUpperCase()}</span>}
                                            {categorie && <TagCategorie couleur={categorie.couleur_categ}>{categorie.nom_categ}</TagCategorie>}
                                        </div>
                                    </div>
                                </div>

                                {/* Ligne 2 : formes (uniquement si le mot en a) */}
                                {mot.forme && (
                                    <div className="mot-ligne">
                                        <p className="mot-label">forme</p>
                                        <div className="mot-formes">
                                            {mot.forme.split("/").map((forme) => (
                                                <span key={forme} className="tag-forme">{forme.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Ligne 3 : traduction */}
                                <div className="mot-ligne">
                                    <p className="mot-label">traduction</p>
                                    <p className="mot-traduction">{mot.traduction}</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
      </div>
    )
};

export default Vocabulaire;