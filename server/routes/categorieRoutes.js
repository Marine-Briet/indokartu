// Fichier pour gérer les routes liées aux catégories
// Importer dans index.js

const express = require('express');
const router = express.Router();
const { checkJWT } = require('../middlewares/checkAuth');

const categorieController = require('../controllers/categorieController');

router.get('/', categorieController.getAllCategories);
router.get('/:id_categ', categorieController.getCategorieById);
router.post('/', checkJWT, categorieController.createCategorie);
router.put('/:id_categ', checkJWT, categorieController.updateCategorie);
router.delete('/:id_categ', checkJWT, categorieController.deleteCategorie);

module.exports = router;