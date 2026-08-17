// Fichier pour gérer les routes liées à l'authentification
// Importer dans index.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/inscription',authController.inscription);
router.post('/connexion',authController.connexion);

module.exports = router;

