const bcrypt = require ('bcrypt');
const { Utilisateur } = require ('../models/index');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const inscription = async (req, res) => {
    const { email, mot_de_passe } = req.body;

    try {
        const utilisateur = await Utilisateur.findOne({where: {email}});
        if (utilisateur) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        } else {
            const hashMotDePasse = await bcrypt.hash(mot_de_passe, 10);
            const nouvelUtilisateur = await Utilisateur.create({email, mot_de_passe: hashMotDePasse});
            return res.status(201).json({ message: 'Inscription réussie', utilisateur: { email } });
        }

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Données invalides', error });
        }
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};

const connexion = async (req, res) => {
    const { email, mot_de_passe } = req.body;
    
    try {
        const utilisateur = await Utilisateur.findOne({where: {email}});
        if (utilisateur) {
            const comparaison = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
            if (comparaison) {
                const token = jwt.sign({id_utilisateur: utilisateur.id_utilisateur, est_admin: utilisateur.est_admin}, JWT_SECRET, {expiresIn:'24h'});
                return res.status(200).json({ message: 'Connexion autorisée', token });
            } else {
                return res.status(401).json({ message: 'Connexion non autorisée'});
            }
        } else {
         return res.status(401).json({ message: 'Connexion non autorisée'});
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Données invalides', error });
        }
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};

module.exports = { inscription, connexion };