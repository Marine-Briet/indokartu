const { TypeGrammatical, Mot } = require('../models/index');

// READ : GET tous les types grammaticaux

const getAllTypesGrammaticaux = async (req, res) => {
    try {
        const typesGrammaticaux = await TypeGrammatical.findAll();
        return res.status(200).json(typesGrammaticaux);
    } catch (error) {
        res.status(500).json({ message: 'Erreur', error });
    }
};

// READ : GET un type grammatical par son ID

const getTypeGrammaticalById = async (req, res) => {
    const { id_type } = req.params;

    try {
        const typeGrammatical = await TypeGrammatical.findByPk(id_type);

        if (typeGrammatical) {
            return res.status(200).json(typeGrammatical);
        } else {
            return res.status(404).json({ message: 'Type grammatical non trouvé' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erreur', error });
    }
};

// CREATE : POST créer un type grammatical

const createTypeGrammatical = async (req, res) => {
    try {
        const typeGrammatical = await TypeGrammatical.create(req.body);
        return res.status(201).json(typeGrammatical);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Données invalides', error });
        }
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// UPDATE : PUT mettre à jour un type grammatical

const updateTypeGrammatical = async (req, res) => {
    const { id_type } = req.params;

    try {
        const typeGrammatical = await TypeGrammatical.findByPk(id_type);

        if (typeGrammatical) {
            await typeGrammatical.update(req.body);
            return res.status(200).json({ message: 'Type grammatical mis à jour avec succès', typeGrammatical });
        } else {
            return res.status(404).json({ message: 'Type grammatical non trouvé' });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Données invalides', error });
    }
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// DELETE : DELETE supprimer un type grammatical

const deleteTypeGrammatical = async (req, res) => {
    const { id_type } = req.params;

    try {
        const typeGrammatical = await TypeGrammatical.findByPk(id_type);

        if (typeGrammatical){
            const nombreDeMots = await Mot.count({where: { id_type: id_type }});

            if (nombreDeMots > 0) {
                return res.status(400).json({ message: 'Impossible de supprimer le type grammatical car il est associé à des mots' });
            }

            await typeGrammatical.destroy();
            return res.status(200).json({ message: 'Type grammatical supprimé avec succès' });
        }
        else {
            return res.status(404).json({ message: 'Type grammatical non trouvé' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};


module.exports = { getAllTypesGrammaticaux, getTypeGrammaticalById, createTypeGrammatical, updateTypeGrammatical, deleteTypeGrammatical };