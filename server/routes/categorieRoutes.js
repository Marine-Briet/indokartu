// Fichier pour gérer les routes liées aux catégories
// Importer dans index.js

const express = require('express');
const router = express.Router();
const { checkJWT, checkAdmin } = require('../middlewares/checkAuth');

const categorieController = require('../controllers/categorieController');

router.get('/', categorieController.getAllCategories);
router.get('/:id_categ', categorieController.getCategorieById);
router.post('/', checkJWT, checkAdmin, categorieController.createCategorie);
router.put('/:id_categ', checkJWT, checkAdmin, categorieController.updateCategorie);
router.delete('/:id_categ', checkJWT, checkAdmin, categorieController.deleteCategorie);

module.exports = router;