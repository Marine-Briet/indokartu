// Fichier regroupant les statistiques globales de résultats
const Session = require('../models/session');
const { Mot } = require('../models/index');


const getStatistiques = async (req, res) => {
    const { id_utilisateur } = req.decoded;


    try {
        //1. Nombre total de sessions effectuées par utilisateur

        const sessions = await Session.find({id_utilisateur});
        const nombreTotalSession = sessions.length;
    
        // 2. Moyenne générale sur 20 (toutes sessions confondues)
        // 2.1 Cas "zéro session"
        
        if (nombreTotalSession === 0) {
            return res.status(200).json({ nombreTotalSession, moyenne: null });
        }
        
        // 2.2 Donne un tableau de notes individuelles (calcul des notes par session)
        const notesSur20 = sessions.map(session => {
            const resultats = session.resultats;
            const nombreReussis = resultats.filter(r => r.est_reussi === true).length;
            const total = resultats.length;
            const noteDeCetteSession = (nombreReussis / total)*20;
            return noteDeCetteSession;
        });

        // 2.3 Calcul moyenne
        let sommeDesNotes = 0;
        for (let i = 0; i < notesSur20.length; i++) {
            sommeDesNotes += notesSur20[i];
        }
        const moyenne = Math.round(sommeDesNotes / notesSur20.length);

        // 3. % de vocabulaire maîtrisé (ex: "X / n mots")

        // 3.1 Mettre tous les résultats dans un même tableau
        const tousLesResultats = sessions.flatMap(session => session.resultats);
        
        // 3.2 Compter le nb de réussite pour chaque id_mot
        const compteurReussites = {};

        tousLesResultats.forEach(resultat => {
            if (resultat.est_reussi === true) {
                compteurReussites[resultat.id_mot] = (compteurReussites[resultat.id_mot] || 0) + 1;
            }
        });

        // 3.3 Compter combien de mots ont atteint le seuil de 10 (si >=10 --> mot maitrisé)
        const nombreMotsMaitrises = Object.values(compteurReussites).filter(r => r >=10).length;

        // 3.4 Récupérer nb total de mot (via MySQL)
        const nombreTotalMotsBase = await Mot.count();
        
        // 4. Top 10 des mots redoutés
        // 4.1 Compter le nb d'échecs par id_mot
        const compteurEchecs = {};

        tousLesResultats.forEach(resultat => {
            if (resultat.est_reussi === false) {
                compteurEchecs[resultat.id_mot] = (compteurEchecs[resultat.id_mot] || 0) + 1;
            }
        });

        // 4.2 Transformer object en tableau, trier ordre décroissant et garder top 10
        const top10MotsRedoutes = Object.entries(compteurEchecs)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

        // 4.3 Convertir l'id_mot en mot
        const top10MotsRedoutesDetailles = await Promise.all(
            top10MotsRedoutes.map(async ([id_mot, nombreEchecs]) => {
                const mot = await Mot.findByPk(id_mot);
                return { racine: mot.racine, traduction: mot.traduction, nombreEchecs };
            })
        );

        return res.status(200).json({nombreTotalSession, moyenne, nombreTotalMotsBase, nombreMotsMaitrises, top10MotsRedoutesDetailles });

    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};


module.exports = { getStatistiques };

