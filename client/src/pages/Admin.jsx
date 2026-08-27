import Card from "../components/Card";
import Header from "../components/Header"
import Bouton from "../components/Bouton"
import Champ from "../components/Champ"
import { useEffect, useState } from "react";
import "./Admin.scss";


function Admin() {
    const [mots, setMots] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    const [ongletActif, setOngletActif] = useState("mots");
    const [modaleOuverte, setModaleOuverte] = useState(false);
    const [motEnEdition, setMotEnEdition] = useState(null);
    const [formRacine, setFormRacine] = useState("");
    const [formForme, setFormForme] = useState("");
    const [formTraduction, setFormTraduction] = useState("");
    const [formIdCateg, setFormIdCateg] = useState("");
    const [formIdType, setFormIdType] = useState("");

    const [recherche, setRecherche] = useState("");

    async function chargerMots() {
        const reponse = await fetch("http://localhost:3000/api/mots");
        const donnees = await reponse.json();
        setMots(donnees);
    }

    useEffect(() => {
        chargerMots();
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

    const motsFiltres = mots.filter((mot) => {
        const correspondRecherche =
            mot.racine.toLowerCase().includes(recherche.toLowerCase()) ||
            mot.traduction.toLowerCase().includes(recherche.toLowerCase());
        return correspondRecherche;
    })
    .sort((a, b) => a.racine.localeCompare(b.racine));

    function ouvrirModaleModification(mot) {
        setFormRacine(mot.racine);
        setFormForme(mot.forme);
        setFormTraduction(mot.traduction);
        setFormIdCateg(mot.id_categ);
        setFormIdType(mot.id_type);
        setMotEnEdition(mot);
        setModaleOuverte(true);
    }

    function ouvrirModaleAjout() {
        setFormRacine("");
        setFormForme("");
        setFormTraduction("");
        setFormIdCateg("");
        setFormIdType("");
        setMotEnEdition(null);
        setModaleOuverte(true);
    }


    async function enregistrerMot() {
        const token = localStorage.getItem("token");
        const corps = {
            racine: formRacine,
            forme: formForme,
            traduction: formTraduction,
            id_categ: formIdCateg,
            id_type: formIdType
        };

        let url = "http://localhost:3000/api/mots";
        let methode = "POST";

        if (motEnEdition) {
            url = `http://localhost:3000/api/mots/${motEnEdition.id_mot}`;
            methode = "PUT";
        }

        const reponse = await fetch(url, {
            method: methode,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(corps)
        });

        if (reponse.ok) {
            setModaleOuverte(false);
            chargerMots();
        }
    }

    async function supprimerMot(id_mot) {
        const confirme = window.confirm("Es-tu sûre de vouloir supprimer ce mot ?");

        if (confirme) {
            const token = localStorage.getItem("token");

            const reponse = await fetch(`http://localhost:3000/api/mots/${id_mot}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (reponse.ok) {
                chargerMots();
            }
        }
    }
    
    return (
        <div>
            <Header />
            <div className="page-contenu">
                <h1>Gérer les données</h1>

                <div className="onglets-admin">
                    <button className={ongletActif === "mots" ? "onglet-actif" : "onglet"} onClick={() => setOngletActif("mots")}>
                        Mots
                    </button>
                    <button className={ongletActif === "categories" ? "onglet-actif" : "onglet"} onClick={() => setOngletActif("categories")}>
                        Catégories
                    </button>
                    <button className={ongletActif === "types" ? "onglet-actif" : "onglet"} onClick={() => setOngletActif("types")}>
                        Types
                    </button>
                </div>

                {ongletActif === "mots" && (
                    <div>
                        <button className="bouton-ajouter" onClick={ouvrirModaleAjout}>Ajouter un mot</button>
                        <input
                            className="barre-recherche"
                            type="text"
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            placeholder="Recherche un mot en français ou indonésien..."
                        />

                        {motsFiltres.map((mot) => {
                            const categorie = categories.find((cat) => cat.id_categ === mot.id_categ);
                            const type = types.find((t) => t.id_type === mot.id_type);

                            return (
                                <Card key={mot.id_mot} className="card-admin">
                                    <div className="ligne-admin">
                                        <div className="info-ligne-admin">
                                            <p className="titre-ligne-admin">{mot.racine}</p>
                                            <p className="sous-titre-ligne-admin">
                                                {mot.traduction} — {categorie?.nom_categ} — {type?.nom_type}
                                            </p>
                                        </div>
                                        <div className="actions-ligne-admin">
                                            <button className="bouton-modifier" onClick={() => ouvrirModaleModification(mot)}>✏️</button>
                                            <button className="bouton-supprimer" onClick={() => supprimerMot(mot.id_mot)}>🗑️</button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {ongletActif === "categories" && (
                    <div>
                        <p>À construire</p>
                    </div>
                )}

                {ongletActif === "types" && (
                    <div>
                        <p>À construire</p>
                    </div>
                )}

                {/* La modale est ICI, une seule fois, EN DEHORS de toute liste */}
                {modaleOuverte && (
                    <div className="modal-overlay" onClick={() => setModaleOuverte(false)}>
                        <div className="modal-contenu" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-fermer" onClick={() => setModaleOuverte(false)}>✕</button>

                            <p className="modal-titre">{motEnEdition ? "Modifier un mot" : "Ajouter un mot"}</p>

                            <Champ label="Racine" type="text" valeur={formRacine} onChange={(e) => setFormRacine(e.target.value)} placeholder="ex: makan" />
                            <Champ label="Forme(s)" type="text" valeur={formForme} onChange={(e) => setFormForme(e.target.value)} placeholder="ex: makan / memakan" />
                            <Champ label="Traduction" type="text" valeur={formTraduction} onChange={(e) => setFormTraduction(e.target.value)} placeholder="ex: manger" />

                            <div className="champ-select">
                                <label>Catégorie</label>
                                <select value={formIdCateg} onChange={(e) => setFormIdCateg(e.target.value)}>
                                    <option value="">-- Choisir --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id_categ} value={cat.id_categ}>{cat.nom_categ}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="champ-select">
                                <label>Type grammatical</label>
                                <select value={formIdType} onChange={(e) => setFormIdType(e.target.value)}>
                                    <option value="">-- Choisir --</option>
                                    {types.map((t) => (
                                        <option key={t.id_type} value={t.id_type}>{t.nom_type}</option>
                                    ))}
                                </select>
                            </div>

                            <Bouton variant="cta" onClick={enregistrerMot}>Enregistrer</Bouton>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Admin;