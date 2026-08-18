const Session = require('../models/session');

// Création d'une session

const createSession = async (req, res) => {
    const { id_utilisateur } = req.decoded;
    

    try {
        const { resultats } = req.body;

        if (resultats) {
            const nouvelleSession = await Session.create({id_utilisateur, resultats});
            return res.status(201).json({message: 'La session est créée avec succès'});
        } else {
            return res.status(400).json({ message: 'Résultats manquants' });
        }

    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};

module.exports = { createSession };