const { Mot } = require('../models/index');

// READ : GET tous les mots

const getAllMots = async (req, res) => {
    try {
        const mots = await Mot.findAll();
        return res.status(200).json(mots);
    } catch (error) {
        res.status(500).json({ message: 'Erreur', error });
    }
};

// READ : GET un mot par son ID

const getMotbyId = async (req, res) => {
    const { id_mot } = req.params;

    try {
        const mot = await Mot.findByPk(id_mot);
        
        if (mot) {
            return res.status(200).json(mot);
        } else {
            return res.status(404).json({ message: 'Mot non trouvé' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erreur', error });
    }
}


// CREATE : POST créer un mot
const createMot = async (req, res) => {
    try {
        const mot = await Mot.create(req.body);
        return res.status(201).json(mot);
    } catch (error) {
        return res.status(500).json({ message: 'Erreur', error });
    }
};

// UPDATE : PUT mettre à jour un mot
const updateMot = async (req, res) => {
    const { id_mot } = req.params;
    
    try {
        const mot = await Mot.findByPk(id_mot);

        if (mot) {
            await mot.update(req.body);
            return res.status(200).json({ message: 'Mot mis à jour avec succès', mot });
        } else {
            return res.status(404).json({ message: 'Mot non trouvé' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erreur', error });
    }
};

// DELETE : DELETE supprimer un mot
const deleteMot = async (req, res) => {
    const { id_mot } = req.params;

    try {
        const mot = await Mot.findByPk(id_mot);
        
        if (mot) {
            await mot.destroy();
            return res.status(200).json({ message: 'Mot supprimé avec succès' });
        } else {
            return res.status(404).json({ message: 'Mot non trouvé' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erreur', error });
    }
};

module.exports = { getAllMots, getMotbyId, createMot, updateMot, deleteMot };