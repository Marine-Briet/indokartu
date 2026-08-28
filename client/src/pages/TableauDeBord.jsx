import Header from "../components/Header";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./TableauDeBord.scss"

function TableauDeBord() {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Salutation indonésienne, différente selon l'heure de la journée
    function obtenirSalutation() {
        const heure = new Date().getHours();

        if (heure >= 5 && heure < 11) {
            return "Selamat pagi !";
        } else if (heure >= 11 && heure < 15) {
            return "Selamat siang !";
        } else if (heure >= 15 && heure < 18) {
            return "Selamat sore !";
        } else {
            return "Selamat malam !";
        }
    }

    return (
        <div>
            <Header />
            <h1 className="salutation">{obtenirSalutation()}</h1>
            <div className="page-contenu">
                <p className="sous-titre-tdb">Prêt pour une nouvelle session ?</p>

                {/* --- Cartes de navigation rapide vers les fonctionnalités principales --- */}
                <Card className="carte-navigation" onClick={() => navigate("/cartes-filtres")}>
                    <div className="icone-carte-nav icone-cartes">🎴</div>
                    <div>
                        <p className="titre-carte-nav">Cartes</p>
                        <p className="sous-titre-carte-nav">Réviser avec des flashcards</p>
                    </div>
                </Card>
                <Card className="carte-navigation" onClick={() => navigate("/vocabulaire")}>
                    <div className="icone-carte-nav icone-cartes">📖</div>
                    <div>
                        <p className="titre-carte-nav">Vocabulaire</p>
                        <p className="sous-titre-carte-nav">Parcourir tous les mots</p>
                    </div>
                </Card>
                <Card className="carte-navigation" onClick={() => navigate("/mes-resultats")}>
                    <div className="icone-carte-nav icone-cartes">📊</div>
                    <div>
                        <p className="titre-carte-nav">Mes résultats</p>
                        <p className="sous-titre-carte-nav">Suivre ta progression</p>
                    </div>
                </Card>

                {/* Carte visible uniquement pour l'admin */}
                {user?.est_admin && (
                    <Card className="carte-navigation" onClick={() => navigate("/admin")}>
                        <div className="icone-carte-nav icone-admin">⚙️</div>
                        <div>
                            <p className="titre-carte-nav">Gérer les données</p>
                            <p className="sous-titre-carte-nav">Mots, catégories, types</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
};

export default TableauDeBord;