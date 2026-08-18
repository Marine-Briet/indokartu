// Fichier pour gérer les routes liées aux mots
// Importer dans index.js

const express = require('express');
const router = express.Router();
const { checkJWT, checkAdmin } = require('../middlewares/checkAuth');

const motController = require('../controllers/motController');

router.get('/', motController.getAllMots);
router.get('/:id_mot', motController.getMotbyId);
router.post('/', checkJWT, checkAdmin, motController.createMot);
router.put('/:id_mot', checkJWT, checkAdmin, motController.updateMot);
router.delete('/:id_mot', checkJWT, checkAdmin, motController.deleteMot);

module.exports = router;