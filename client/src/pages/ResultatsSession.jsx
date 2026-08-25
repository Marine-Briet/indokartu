import { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import { useNavigate } from 'react-router-dom';
import Bouton from "../components/Bouton"
import Header from "../components/Header"
import Card from "../components/Card"
import "./ResultatsSession.scss"


function ResultatsSession() {
    const { resultatsSession, setResultatsSession } = useSession();
    const navigate = useNavigate();
    const [detailsOuvert, setDetailsOuvert] = useState(false);


    useEffect(() => {
        if (!resultatsSession || resultatsSession.length === 0) {
            navigate("/cartes-filtres");
        }
    }, []);

    if (!resultatsSession || resultatsSession.length === 0) {
        return null;
    }

    const nombreReussis = resultatsSession.filter((r) => r.reussi).length;
    const nombreTotal = resultatsSession.length;
    
    function recommencer() {
        setResultatsSession([]);
        navigate("/cartes-session");
    }

    function changerDeMots(){
        navigate("/cartes-filtres");
    }


    return (
    <div>
        <Header />
        <div className="page-flashcard">
            <Card className="carte-resultat">
                <p className="score-session">{nombreReussis}/{nombreTotal}</p>
            </Card>
            <div className="boutons-resultat">
                <Bouton variant="cta" onClick={recommencer}>Recommencer</Bouton>
                <Bouton variant="cta" onClick={changerDeMots}>Changer les mots</Bouton>
                <Bouton variant="cta" className={detailsOuvert ? "bouton-details-actif" : ""} onClick={() => setDetailsOuvert(!detailsOuvert)}>Détails du résultat</Bouton>
            </div>
            {detailsOuvert && (
                <div className="details-liste">
                    {resultatsSession.map((resultat) => (
                        <div key={resultat.id_mot} className="details-item">
                            <span>{resultat.racine}</span>
                            <span className={resultat.reussi ? "icone-reussi" : "icone-rate"}>
                                {resultat.reussi ? " ✓" : " ✕"}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
    )
};

export default ResultatsSession;