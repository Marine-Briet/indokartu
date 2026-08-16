// Fichier central pour gérer les routes de l'application 
// Importer dans app.js

const express = require('express');
const router = express.Router();
const motRoutes = require('./motRoutes');
const categorieRoutes = require('./categorieRoutes');
const typeGramRoutes = require('./typeGramRoutes');

router.use('/mots', motRoutes);
router.use('/categories', categorieRoutes);
router.use('/types-grammaticaux', typeGramRoutes);

module.exports = router;
