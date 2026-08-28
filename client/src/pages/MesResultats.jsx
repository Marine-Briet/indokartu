import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"
import Card from "../components/Card";
import Bouton from "../components/Bouton";
import "./MesResultats.scss"


function MesResultats() {
    const [stats, setStats] = useState(null);
    const [aideMoyenneOuvert, setAideMoyenneOuvert] = useState(false);
    const [aideMaitriseOuvert, setAideMaitriseOuvert] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        async function chargerStats() {
            const token = localStorage.getItem("token");
            const reponse = await fetch("http://192.168.1.65:3000/api/mes-resultats", {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            const donnees = await reponse.json();
            setStats(donnees);
        }

        chargerStats();
    }, []);

    // Ne rien afficher si aucune session réalisée
    if (!stats) {
        return null;
    }

    if (!stats.moyenne) {
    return (
        <div>
            <Header />
            <div className="page-contenu">
                <h1>Mes résultats</h1>
                <Card className="carte-aucune-session">
                    <p className="texte-aucune-session">Tu n'as pas encore fait de session, commence à réviser !</p>
                    <Bouton variant="cta" onClick={() => navigate("/cartes-filtres")}>Commencer une session</Bouton>
                </Card>
            </div>
        </div>
    )
}

    return (
        <div>
            <Header />
            <div className = "page-contenu">
                <h1>Mes résultats</h1>

                <div className = "cartes-stats-duo">
                    <Card className="carte-stat">
                        <p className="stat-label">Nombre de sessions total : </p>
                        <p className="stat-valeur">{stats.nombreTotalSession}</p>
                    </Card>
                    <Card className="carte-stat">
                        <p className="stat-label">Moyenne générale : </p>
                        <p className="stat-valeur">{stats.moyenne}/20</p>
                        <button type="button" className="bouton-aide-rond" onClick={() => setAideMoyenneOuvert(!aideMoyenneOuvert)}>
                            ?
                        </button>
                        {aideMoyenneOuvert  && (
                            <div className="modal-overlay" onClick={() => setAideMoyenneOuvert(false)}>
                                <div className="modal-contenu" onClick={(e) => e.stopPropagation()}>
                                <button type="button" className="modal-fermer" onClick={() => setAideMoyenneOuvert(false)}>✕</button>
                                <p className="modal-text">C'est la moyenne de toutes les sessions terminées. Chaque note obtenu a été convertie sur /20 pour donner cette moyenne générale.</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                <Card className="carte-maitrise">
                    <p className="titre-matrise">{Math.round((stats.nombreMotsMaitrises / stats.nombreTotalMotsBase) * 100)}% du vocabulaire maîtrisé !</p>
                    <p className="sous-titre-maitrise">Tu as donc appris {stats.nombreMotsMaitrises} mots sur un total de {stats.nombreTotalMotsBase} mots</p>
                    <button type="button" className="bouton-aide-rond" onClick={() => setAideMaitriseOuvert(!aideMaitriseOuvert)}>
                        ?
                    </button>
                    {aideMaitriseOuvert && (
                        <div className="modal-overlay" onClick={() => setAideMaitriseOuvert(false)}>
                            <div className="modal-contenu" onClick={(e) => e.stopPropagation()}>
                            <button type="button" className="modal-fermer" onClick={() => setAideMaitriseOuvert(false)}>✕</button>
                            <p className="modal-text">Un mot est considéré comme maîtrisé quand il a été réussi au moins 10 fois au total. <br /> Actuellement, la base de donnée "Vocabulaire" est constituée de {stats.nombreTotalMotsBase} mots.</p>
                            </div>
                        </div>
                    )}
                </Card>

                <Card className="carte-top10">
                    <p className="titre-top10">TOP 10 des mots que tu redoutes ...</p>
                    <div className="liste-top10">
                        {stats.top10MotsRedoutesDetailles.map((item) => (
                            <p key={item.racine}>{item.racine}</p>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )



};

export default MesResultats;