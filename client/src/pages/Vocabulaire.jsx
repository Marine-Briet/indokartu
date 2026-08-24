import { useEffect, useState } from "react";
import Card from "../components/Card";
import './Vocabulaire.scss';
import TagCategorie from "../components/TagCategorie"
import Header from "../components/Header"

function Vocabulaire() {
    const [mots, setMots] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

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


    return (
        <div>
            <Header />
            <h1>Vocabulaire</h1>
            <div>
                {mots.map((mot) => {
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
    )
};

export default Vocabulaire;