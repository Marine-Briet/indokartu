// Fichier pour gérer les routes liées aux types grammaticaux
// Importer dans index.js

const express = require('express');
const router = express.Router();

const typeGramController = require('../controllers/typeGramController');

router.get('/', typeGramController.getAllTypesGrammaticaux);
router.get('/:id_type', typeGramController.getTypeGrammaticalById);
router.post('/', typeGramController.createTypeGrammatical);
router.put('/:id_type', typeGramController.updateTypeGrammatical);
router.delete('/:id_type', typeGramController.deleteTypeGrammatical);

module.exports = router;