import { useEffect, useState } from "react";
import Card from "../components/Card";
import './Vocabulaire.scss';
import TagCategorie from "../components/TagCategorie"
import Header from "../components/Header"
import Bouton from "../components/Bouton"


function Vocabulaire() {
    const [mots, setMots] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [recherche, setRecherche] = useState("");
    const [typesSelectionnes, setTypesSelectionnes] = useState([]);
    const [categoriesSelectionnees, setCategoriesSelectionnees] = useState([]);

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

    console.log(mots);
    console.log(categories);
    console.log(types);

    const motsFiltres = mots.filter((mot) => {
        const correspondRecherche = 
            mot.racine.toLowerCase().includes(recherche.toLowerCase()) ||
            mot.traduction.toLowerCase().includes(recherche.toLowerCase());

        const correspondType = 
            typesSelectionnes.length === 0 || typesSelectionnes.includes(mot.id_type);

        const correspondCategorie = 
            categoriesSelectionnees.length === 0 || categoriesSelectionnees.includes(mot.id_categ);

        const auMoinsUneAction =
            recherche.trim() !== "" || typesSelectionnes.length > 0 || categoriesSelectionnees.length > 0;
        return auMoinsUneAction && correspondRecherche && correspondType && correspondCategorie;    });

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
        setCategoriesSelectionnees(types.map((t) => t.id_type));
    }

    function toutDeselectionnerCategories() {
        setCategoriesSelectionnees([]);
    }

    return (
        <div>
            <Header />
            <div className="page-contenu">
                <h1>Vocabulaire</h1>
                <div>
                    <input className="barre-recherche" type="text" value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Recherche un mot en français ou indonésien..." />
                </div>
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
                
                <div className="section-filtre">
                    <div className="entete-section">
                        <p className="instruction-filtre">Choisir une catégorie (ou plusieurs) :</p>
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
                
                <p className="compteur-mots">{motsFiltres.length} mot{motsFiltres.length > 1 ? "s" : ""} affiché{motsFiltres.length > 1 ? "s" : ""}</p>
                <div>
                    {motsFiltres.map((mot) => {
                        const categorie = categories.find((cat) => cat.id_categ === mot.id_categ);
                        const type = types.find((t) => t.id_type === mot.id_type);

                        return (
                            <Card key={mot.id_mot} className="carte-mot">
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