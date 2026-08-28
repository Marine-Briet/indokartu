import Card from "../components/Card";
import Header from "../components/Header"
import Bouton from "../components/Bouton"
import Champ from "../components/Champ"
import { useEffect, useState } from "react";
import "./Admin.scss";


function Admin() {
    // ÉTATS : données venant de l'API
    const [mots, setMots] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    // ÉTATS : navigation / modale globale
    const [ongletActif, setOngletActif] = useState("mots");
    const [modaleOuverte, setModaleOuverte] = useState(false);

    // ÉTAT : message de confirmation d'action (ajout/modif/suppression), affiché en haut
    const [messageAction, setMessageAction] = useState({ texte: "", type: "" });

    // ÉTATS : formulaire Mots
    const [motEnEdition, setMotEnEdition] = useState(null);
    const [formRacine, setFormRacine] = useState("");
    const [formForme, setFormForme] = useState("");
    const [formTraduction, setFormTraduction] = useState("");
    const [formIdCateg, setFormIdCateg] = useState("");
    const [formIdType, setFormIdType] = useState("");

    // ÉTATS : formulaire Catégories
    const [categorieEnEdition, setCategorieEnEdition] = useState(null);
    const [formNomCateg, setFormNomCateg] = useState("");
    const [formCouleurCateg, setFormCouleurCateg] = useState("");

    // ÉTATS : formulaire Types grammaticaux
    const [typeEnEdition, setTypeEnEdition] = useState(null);
    const [formNomType, setFormNomType] = useState("");

    // ÉTATS : recherche
    const [recherche, setRecherche] = useState(""); // onglet Mots
    const [rechercheCateg, setRechercheCateg] = useState(""); // onglet Catégories


    // CHARGEMENT INITIAL : les 3 sources de données
    async function chargerMots() {
        const reponse = await fetch("http://192.168.1.65:3000/api/mots");
        const donnees = await reponse.json();
        setMots(donnees);
    }

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

    useEffect(() => {
        chargerMots();
        chargerCategories();
        chargerTypes();
    }, []);

    // Liste des mots filtrée par la recherche, triée par ordre alphabétique
    const motsFiltres = mots.filter((mot) => {
        const correspondRecherche =
            mot.racine.toLowerCase().includes(recherche.toLowerCase()) ||
            mot.traduction.toLowerCase().includes(recherche.toLowerCase());
        return correspondRecherche;
    })
    .sort((a, b) => a.racine.localeCompare(b.racine));

    // Liste des catégories filtrée par la recherche, triée par ordre alphabétique
    const categoriesFiltrees = categories
        .filter((categorie) => categorie.nom_categ.toLowerCase().includes(rechercheCateg.toLowerCase()))
        .sort((a, b) => a.nom_categ.localeCompare(b.nom_categ));


    // MOTS : ouverture de la modale
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

    // MOTS : enregistrement (POST ou PUT selon motEnEdition)
    async function enregistrerMot() {
        const token = localStorage.getItem("token");
        const corps = {
            racine: formRacine,
            forme: formForme,
            traduction: formTraduction,
            id_categ: formIdCateg,
            id_type: formIdType
        };

        let url = "http://192.168.1.65:3000/api/mots";
        let methode = "POST";
        const etaitEnEdition = !!motEnEdition;

        if (motEnEdition) {
            url = `http://192.168.1.65:3000/api/mots/${motEnEdition.id_mot}`;
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
            setMessageAction({ texte: etaitEnEdition ? "Mot modifié avec succès" : "Mot ajouté avec succès", type: "succes" });
        }
    }

    // MOTS : suppression (avec confirmation)
    async function supprimerMot(id_mot) {
        const confirme = window.confirm("Es-tu sûr de vouloir supprimer ce mot ?");

        if (confirme) {
            const token = localStorage.getItem("token");

            const reponse = await fetch(`http://192.168.1.65:3000/api/mots/${id_mot}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (reponse.ok) {
                chargerMots();
                setMessageAction({ texte: "Mot supprimé avec succès", type: "succes" });
            }
        }
    }


    // CATÉGORIES : ouverture de la modale
    function ouvrirModaleModificationCateg(categorie) {
        setFormNomCateg(categorie.nom_categ);
        setFormCouleurCateg(categorie.couleur_categ);
        setCategorieEnEdition(categorie);
        setModaleOuverte(true);
    }

    function ouvrirModaleAjoutCateg() {
        setFormNomCateg("");
        setFormCouleurCateg("#B8801F"); // valeur de départ, input color n'accepte pas une valeur vide
        setCategorieEnEdition(null);
        setModaleOuverte(true);
    }

    // CATÉGORIES : enregistrement (POST ou PUT selon categorieEnEdition)
    async function enregistrerCateg() {
        const token = localStorage.getItem("token");
        const corps = {
            couleur_categ: formCouleurCateg,
            nom_categ: formNomCateg
        };

        let url = "http://192.168.1.65:3000/api/categories";
        let methode = "POST";
        const etaitEnEdition = !!categorieEnEdition;

        if (categorieEnEdition) {
            url = `http://192.168.1.65:3000/api/categories/${categorieEnEdition.id_categ}`;
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
            chargerCategories();
            setMessageAction({ texte: etaitEnEdition ? "Catégorie modifiée avec succès" : "Catégorie ajoutée avec succès", type: "succes" });
        }
    }

    // CATÉGORIES : suppression (bloquée si mots rattachés)
    async function supprimerCateg(id_categ) {
        const confirme = window.confirm("Es-tu sûr de vouloir supprimer cette catégorie ?");

        if (confirme) {
            const token = localStorage.getItem("token");

            const reponse = await fetch(`http://192.168.1.65:3000/api/categories/${id_categ}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const donnees = await reponse.json();

            if (reponse.ok) {
                chargerCategories();
                setMessageAction({ texte: "Catégorie supprimée avec succès", type: "succes" });
            } else {
                // Le back a refusé (ex: mots rattachés) : on affiche son message
                setMessageAction({ texte: donnees.message, type: "erreur" });
            }
        }
    }


    // TYPES GRAMMATICAUX : ouverture de la modale
    function ouvrirModaleModificationType(type) {
        setFormNomType(type.nom_type);
        setTypeEnEdition(type);
        setModaleOuverte(true);
    }

    function ouvrirModaleAjoutType() {
        setFormNomType("");
        setTypeEnEdition(null);
        setModaleOuverte(true);
    }

    // TYPES GRAMMATICAUX : enregistrement (POST ou PUT selon typeEnEdition)
    async function enregistrerType() {
        const token = localStorage.getItem("token");
        const corps = {
            nom_type: formNomType
        };

        let url = "http://192.168.1.65:3000/api/types-grammaticaux";
        let methode = "POST";
        const etaitEnEdition = !!typeEnEdition;

        if (typeEnEdition) {
            url = `http://192.168.1.65:3000/api/types-grammaticaux/${typeEnEdition.id_type}`;
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
            chargerTypes();
            setMessageAction({ texte: etaitEnEdition ? "Type grammatical modifié avec succès" : "Type grammatical ajouté avec succès", type: "succes" });
        }
    }

    // TYPES GRAMMATICAUX : suppression (bloquée si mots rattachés)
    async function supprimerType(id_type) {
        const confirme = window.confirm("Es-tu sûr de vouloir supprimer ce type grammatical ?");

        if (confirme) {
            const token = localStorage.getItem("token");

            const reponse = await fetch(`http://192.168.1.65:3000/api/types-grammaticaux/${id_type}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const donnees = await reponse.json();

            if (reponse.ok) {
                chargerTypes();
                setMessageAction({ texte: "Type grammatical supprimé avec succès", type: "succes" });
            } else {
                // Le back a refusé (ex: mots rattachés) : on affiche son message
                setMessageAction({ texte: donnees.message, type: "erreur" });
            }
        }
    }


    // AFFICHAGE
    return (
        <div>
            <Header />
            <div className="page-contenu">
                <h1>Gérer les données</h1>

                {/* Message de confirmation d'action, commun aux 3 onglets */}
                {messageAction.texte && (
                    <p className={`message-formulaire message-formulaire--${messageAction.type}`}>
                        {messageAction.texte}
                    </p>
                )}

                {/* ONGLETS */}
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

                {/* ONGLET : MOTS */}
                {ongletActif === "mots" && (
                    <div>
                        <button className="bouton-ajouter" onClick={ouvrirModaleAjout}>Ajouter un mot</button>
                        <input
                            className="barre-recherche"
                            type="text"
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }} //pour enlever le clavier téléphone quand on appuie sur "Entrer"
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

                {/* ONGLET : CATÉGORIES */}
                {ongletActif === "categories" && (
                    <div>
                        <button className="bouton-ajouter" onClick={ouvrirModaleAjoutCateg}>Ajouter une catégorie</button>
                        <input
                            className="barre-recherche"
                            type="text"
                            value={rechercheCateg}
                            onChange={(e) => setRechercheCateg(e.target.value)}
                            placeholder="Rechercher une catégorie..."
                        />

                        {categoriesFiltrees.map((categorie) => (
                            <Card key={categorie.id_categ} className="card-admin">
                                <div className="ligne-admin">
                                    <div className="info-ligne-admin">
                                        <p className="titre-ligne-admin" style={{ color: categorie.couleur_categ }}>{categorie.nom_categ}</p>
                                    </div>
                                    <div className="actions-ligne-admin">
                                        <button className="bouton-modifier" onClick={() => ouvrirModaleModificationCateg(categorie)}>✏️</button>
                                        <button className="bouton-supprimer" onClick={() => supprimerCateg(categorie.id_categ)}>🗑️</button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* ONGLET : TYPES GRAMMATICAUX */}
                {ongletActif === "types" && (
                    <div>
                        <button className="bouton-ajouter" onClick={ouvrirModaleAjoutType}>Ajouter un type grammatical</button>

                        {types
                            .slice()
                            .sort((a, b) => a.nom_type.localeCompare(b.nom_type))
                            .map((type) => (
                                <Card key={type.id_type} className="card-admin">
                                    <div className="ligne-admin">
                                        <div className="info-ligne-admin">
                                            <p className="titre-ligne-admin">{type.nom_type}</p>
                                        </div>
                                        <div className="actions-ligne-admin">
                                            <button className="bouton-modifier" onClick={() => ouvrirModaleModificationType(type)}>✏️</button>
                                            <button className="bouton-supprimer" onClick={() => supprimerType(type.id_type)}>🗑️</button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                    </div>
                )}

                {/* MODALE UNIQUE : contenu différent selon l'onglet actif */}
                {modaleOuverte && (
                    <div className="modal-overlay" onClick={() => setModaleOuverte(false)}>
                        <div className="modal-contenu" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-fermer" onClick={() => setModaleOuverte(false)}>✕</button>

                            {/* Formulaire Mots */}
                            {ongletActif === "mots" && (
                                <>
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
                                </>
                            )}

                            {/* Formulaire Catégories */}
                            {ongletActif === "categories" && (
                                <>
                                    <p className="modal-titre">{categorieEnEdition ? "Modifier une catégorie" : "Ajouter une catégorie"}</p>

                                    <Champ label="Nom de la catégorie" type="text" valeur={formNomCateg} onChange={(e) => setFormNomCateg(e.target.value)} placeholder="ex: Corps & Quotidien" />

                                    <div className="champ-select">
                                        <label>Couleur</label>
                                        <input type="color" value={formCouleurCateg} onChange={(e) => setFormCouleurCateg(e.target.value)} />
                                    </div>

                                    <Bouton variant="cta" onClick={enregistrerCateg}>Enregistrer</Bouton>
                                </>
                            )}

                            {/* Formulaire Types grammaticaux */}
                            {ongletActif === "types" && (
                                <>
                                    <p className="modal-titre">{typeEnEdition ? "Modifier un type grammatical" : "Ajouter un type grammatical"}</p>

                                    <Champ label="Nom du type grammatical" type="text" valeur={formNomType} onChange={(e) => setFormNomType(e.target.value)} placeholder="ex: Nom" />

                                    <Bouton variant="cta" onClick={enregistrerType}>Enregistrer</Bouton>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

export default Admin;