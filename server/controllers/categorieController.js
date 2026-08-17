const { Categorie, Mot } = require('../models/index');

// READ : GET toutes les catégories

const getAllCategories = async (req, res) => {
    try {
        const categories = await Categorie.findAll();
        return res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Erreur', error });
    }
};

// READ : GET une catégorie par son ID

const getCategorieById = async (req, res) => {
    const { id_categ } = req.params;

    try {
        const categorie = await Categorie.findByPk(id_categ);

        if (categorie) {
            return res.status(200).json(categorie);
        } else {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erreur', error });
    }
};

// CREATE : POST créer une catégorie

const createCategorie  = async (req, res) => {
    try {
        const categorie = await Categorie.create(req.body);
        return res.status(201).json(categorie);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Données invalides', error });
        }
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// UPDATE : PUT mettre à jour une catégorie

const updateCategorie = async (req, res) => {
    const { id_categ } = req.params;

    try {
        const categorie = await Categorie.findByPk(id_categ);

        if (categorie) {
            await categorie.update(req.body);
            return res.status(200).json({ message: 'Catégorie mise à jour avec succès', categorie });
        } else {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Données invalides', error });
        }
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// DELETE : DELETE supprimer une catégorie

const deleteCategorie = async (req, res) => {
    const { id_categ } = req.params;

    try {
        const categorie = await Categorie.findByPk(id_categ);

        if (categorie){
            const nombreDeMots = await Mot.count({where: { id_categ: id_categ }});

            if (nombreDeMots > 0) {
                return res.status(400).json({ message: 'Impossible de supprimer la catégorie car elle est associée à des mots' });
            }

            await categorie.destroy();
            return res.status(200).json({ message: 'Catégorie supprimée avec succès' });
        }
        else {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Erreur serveur', error });
    }
};


module.exports = { getAllCategories, getCategorieById, createCategorie, updateCategorie, deleteCategorie };