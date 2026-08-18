// Pour la page "Mes infos" : acccéder à son email et mdp hashé + possibilité de les modifier

const { Utilisateur } = require ('../models/index');
const bcrypt = require('bcrypt');


// READ : GET mes infos par ID

const getMesInfos = async (req, res) => {
    const { id_utilisateur } = req.decoded;

    try {
        const utilisateur = await Utilisateur.findByPk(id_utilisateur, {
            attributes: { exclude: ['mot_de_passe'] }
        });

        if (utilisateur) {
            return res.status(200).json(utilisateur);
        } else {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};


// UPDATE : PUT mes infos

const updateMesInfos = async (req, res) => {
    const { id_utilisateur } = req.decoded;
    const { email, mot_de_passe } = req.body;

    try {
        const utilisateur = await Utilisateur.findByPk(id_utilisateur, {
            attributes: { exclude: ['mot_de_passe'] }
        });
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé'});
        }

        const donneesAMaj = {};
            
        if (email) {
            donneesAMaj.email = email;
        }

        if (mot_de_passe) {
            donneesAMaj.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);
        }

        await utilisateur.update(donneesAMaj);
        return res.status(200).json({message: 'Modification réalisée avec succés'});
        
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};

module.exports = { getMesInfos, updateMesInfos }