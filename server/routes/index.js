// Fichier central pour gérer les routes de l'application 
// Importer dans app.js

const express = require('express');
const router = express.Router();
const motRoutes = require('./motRoutes');
const categorieRoutes = require('./categorieRoutes');
const typeGramRoutes = require('./typeGramRoutes');
const authRoutes = require('./authRoutes');

router.use('/mots', motRoutes);
router.use('/categories', categorieRoutes);
router.use('/types-grammaticaux', typeGramRoutes);
router.use('/auth', authRoutes);

module.exports = router;
