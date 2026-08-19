const { Mot } = require('../models/index');
const { sequelize } = require('../models/index');
const { Op } = require('sequelize');

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
};

// READ : GET mots aléatoires 

const getMotsAleatoires = async (req, res) => {
    try {
        const { nombre, categories, types } = req.query;
        
        // Transformer chaine de caractère en nombre (paramètre catégories)
        
        let categoriesArray = [];
        if (categories) {
            categoriesArray = categories.split(',').map(Number);
        }
        
        // Ajouter la condition
        const conditionsWhere = {};

        if (categoriesArray.length > 0) {
            conditionsWhere.id_categ = { [Op.in]: categoriesArray };
        }

        // Transformer chaine de caractère en nombre (paramètre types)
        
        let typesArray = [];
        if (types) {
            typesArray = types.split(',').map(Number);
        }

        // Ajouter la condition

        if (typesArray.length > 0) {
            conditionsWhere.id_type = { [Op.in]: typesArray };
        }

        // Pour avoir un tirage aléatoire
        const mots = await Mot.findAll ({
            where: conditionsWhere, // Pour appliquer filtre catégories et types
            order: sequelize.random(), // trier aléatoirement à chaque exécution de la requête
            limit: Number (nombre) // Pour limiter au nombre de cartes choisies (converti en nomrbe)
        });

        return res.status(200).json(mots);
    } catch (error) {
        return res.status(500).json({message: 'Erreur server', error});
    }

};

 
// CREATE : POST créer un mot
const createMot = async (req, res) => {
    try {
        const mot = await Mot.create(req.body);
        return res.status(201).json(mot);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Données invalides', error });
        }
        return res.status(500).json({ message: 'Erreur serveur', error });
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
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Données invalides', error });
        }
        return res.status(500).json({ message: 'Erreur serveur', error });
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

module.exports = { getAllMots, getMotbyId, getMotsAleatoires, createMot, updateMot, deleteMot };