import { useEffect, useState } from "react";
import Header from "../components/Header"
import Card from "../components/Card";
import Champ from "../components/Champ";
import "./MesInfos.scss"
import Bouton from "../components/Bouton";

function MesInfos() {
    //  États des champs du formulaire 
    const [email, setEmail] = useState("");
    const [emailOrigine, setEmailOrigine] = useState(""); // valeur de départ, pour détecter un vrai changement
    const [motDePasse, setMotDePasse] = useState("********"); // texte factice, jamais la vraie valeur venant de l'API

    //  États d'interface 
    const [modificationActive, setModificationActive] = useState(false); // champs grisés ou modifiables
    const [message, setMessage] = useState({ texte: "", type: "" });

    //  Règle de validation du mot de passe (identique à Inscription) 
    const regexMotDePasse = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    //  CHARGEMENT INITIAL : récupère l'email actuel via l'API (route protégée par JWT) 
    useEffect(() => {
        async function chargerInfos() {
            const token = localStorage.getItem("token");
            const reponse = await fetch("http://localhost:3000/api/mes-infos", {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            const donnees = await reponse.json();
            setEmail(donnees.email);
            setEmailOrigine(donnees.email); // on garde une copie de référence pour comparer plus tard
        }
        chargerInfos();
    }, []);

    //  Appelée au clic sur "Confirmer" 
    async function enregistrerModifications() {
        // On détermine ce qui a réellement changé par rapport aux valeurs de départ
        const motDePasseModifie = motDePasse !== "********";
        const emailModifie = email !== emailOrigine;

        // 1. Rien n'a changé : pas d'appel API
        if (!motDePasseModifie && !emailModifie) {
            setMessage({ texte: "Aucune modification n'a été apportée", type: "erreur" });
            return;
        }

        // 2. Le mot de passe a changé mais ne respecte pas les règles
        if (motDePasseModifie && !regexMotDePasse.test(motDePasse)) {
            setMessage({ texte: "Le mot de passe ne respecte pas les règles demandées", type: "erreur" });
            return;
        }

        // 3. Tout est valide : on construit le corps de la requête
        // (on n'envoie mot_de_passe QUE s'il a vraiment été modifié)
        const corps = { email };
        if (motDePasseModifie) {
            corps.mot_de_passe = motDePasse;
        }

        const token = localStorage.getItem("token");

        const reponse = await fetch("http://localhost:3000/api/mes-infos", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(corps)
        });

        const donnees = await reponse.json();

        if (reponse.ok) {
            setMessage({ texte: "Modifications enregistrées !", type: "succes" });
            setModificationActive(false);
        } else {
            setMessage({ texte: donnees.message, type: "erreur" });
        }
    }

    return (
        <div>
            <Header />
            <div className="page-contenu">
                <h1>Mes infos</h1>

                <Card className="carte-mes-infos">
                    {/* Champs : modifiables uniquement si modificationActive est true */}
                    <Champ
                        label="Votre adresse mail"
                        type="email"
                        valeur={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={email}
                        disabled={!modificationActive}
                    />
                    <Champ
                        label="Votre mot de passe"
                        type="password"
                        valeur={motDePasse}
                        onChange={(e) => setMotDePasse(e.target.value)}
                        placeholder="********"
                        disabled={!modificationActive}
                    />

                    {/* Texte d'aide affiché uniquement pendant la modification */}
                    {modificationActive && (
                        <p className="mdp-aide">Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (ex: !@#$%^&*)</p>
                    )}

                    {/* Bascule entre le lien "Je souhaite modifier..." et le bouton "Confirmer" */}
                    {!modificationActive ? (
                        <button type="button" className="modifier-infos" onClick={() => setModificationActive(true)}>
                            Je souhaite modifier mes informations personnelles
                        </button>
                    ) : (
                        <Bouton type="submit" variant="cta" onClick={enregistrerModifications} className="bouton-confirmer-info">
                            Confirmer
                        </Bouton>
                    )}

                    {/* Message de succès ou d'erreur */}
                    {message.texte && (
                        <p className={`message-formulaire message-formulaire--${message.type}`}>
                            {message.texte}
                        </p>
                    )}

                </Card>
            </div>
        </div>
    )
};

export default MesInfos;