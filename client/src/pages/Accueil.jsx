import Card from "../components/Card";
import Bouton from "../components/Bouton";

function Accueil() {
    return(
    <Card>
        <h1>Accueil</h1>
        <Bouton>Se connecter</Bouton>
        <br />
        <br />
        <Bouton variant="filtre" actif={true}>Corps & Quotidien</Bouton>
        <br />
        <br />
        <Bouton variant="filtre" actif={false}>Adjectif</Bouton>
    </Card>
)};

export default Accueil;
