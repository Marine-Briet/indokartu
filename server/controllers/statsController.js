// Fichier regroupant les statistiques globales de résultats
const Session = require('../models/session');


const getStatistiques = async (req, res) => {
    const { id_utilisateur } = req.decoded;


    try {
        // Nombre total de sessions effectuées par utilisateur

        const sessions = await Session.find({id_utilisateur});
        const nombreTotalSession = sessions.length;
    
        // Moyenne générale sur 20 (toutes sessions confondues)
        // Cas "zéro session"
        
        if (nombreTotalSession === 0) {
            return res.status(200).json({ nombreTotalSession, moyenne: null });
        }
        
        // Donne un tableau de notes individuelles (calcul des notes par session)
        const notesSur20 = sessions.map(session => {
            const resultats = session.resultats;
            const nombreReussis = resultats.filter(r => r.est_reussi === true).length;
            const total = resultats.length;
            const noteDeCetteSession = (nombreReussis / total)*20;
            return noteDeCetteSession;
        });

        // Calcul moyenne
        let sommeDesNotes = 0;
        for (let i = 0; i < notesSur20.length; i++) {
            sommeDesNotes += notesSur20[i];
        }
        const moyenne = sommeDesNotes / notesSur20.length;

        return res.status(200).json({nombreTotalSession, moyenne});
    
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};


module.exports = { getStatistiques };

// % de vocabulaire maîtrisé (ex: "X / n mots")

// Top 10 des mots redoutés