const express = require('express');
const router = express.Router();

const categorieController = require('../controllers/categorieController');

router.get('/', categorieController.getAllCategories);
router.get('/:id_categ', categorieController.getCategorieById);
router.post('/', categorieController.createCategorie);
router.put('/:id_categ', categorieController.updateCategorie);
router.delete('/:id_categ', categorieController.deleteCategorie);

module.exports = router;