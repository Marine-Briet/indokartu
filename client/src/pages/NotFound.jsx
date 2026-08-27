import { useNavigate } from "react-router-dom";
import Bouton from "../components/Bouton";
import "./NotFound.scss";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="page-404">
            <p className="chiffre-404">404</p>
            <p className="texte-404">Cette page n'existe pas, ou plus.</p>
            <Bouton variant="cta" onClick={() => navigate("/")}>Retour à l'accueil</Bouton>
        </div>
    )
};

export default NotFound;