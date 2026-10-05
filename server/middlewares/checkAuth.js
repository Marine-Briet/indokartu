const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../models/index');

const checkJWT = async (req, res, next) => {
    
    try {
        let token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ message: 'Token requis' });
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.decoded = decoded;
        next();
    } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
};

const checkAdmin = (req, res, next) => {

    if (req.decoded.est_admin === true) {
        next ();
    } else {
        return res.status(403).json({ message: 'Non autorisé' });
    }
};

// Bloque les actions sensibles (email, mot de passe) pour le compte démo public.
// L'email démo vient de la variable d'environnement DEMO_EMAIL.
// Le JWT ne contient que id_utilisateur et est_admin : on relit donc l'email en base.
const bloquerCompteDemo = async (req, res, next) => {
    const emailDemo = process.env.DEMO_EMAIL;

    // Si la variable n'est pas définie, aucun compte n'est considéré comme démo
    if (!emailDemo) {
        return next();
    }

    try {
        const utilisateur = await Utilisateur.findByPk(req.decoded.id_utilisateur, {
            attributes: ['email']
        });

        if (utilisateur && utilisateur.email.toLowerCase() === emailDemo.toLowerCase()) {
            return res.status(403).json({
                message: "Le compte démo ne peut pas modifier son email ni son mot de passe. Créez votre propre compte pour accéder à cette fonctionnalité."
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};


module.exports = { checkJWT, checkAdmin, bloquerCompteDemo };