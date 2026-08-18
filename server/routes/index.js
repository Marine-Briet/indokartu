// Fichier central pour gérer les routes de l'application 
// Importer dans app.js

const express = require('express');
const router = express.Router();
const motRoutes = require('./motRoutes');
const categorieRoutes = require('./categorieRoutes');
const typeGramRoutes = require('./typeGramRoutes');
const authRoutes = require('./authRoutes');
const utilisateurRoutes = require('./utilisateurRoutes');

router.use('/mots', motRoutes);
router.use('/categories', categorieRoutes);
router.use('/types-grammaticaux', typeGramRoutes);
router.use('/auth', authRoutes);
router.use('/mes-infos', utilisateurRoutes);

module.exports = router;
