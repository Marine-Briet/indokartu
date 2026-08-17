// Fichier pour gérer les routes liées aux mots
// Importer dans index.js

const express = require('express');
const router = express.Router();
const { checkJWT } = require('../middlewares/checkAuth');

const motController = require('../controllers/motController');

router.get('/', motController.getAllMots);
router.get('/:id_mot', motController.getMotbyId);
router.post('/', checkJWT, motController.createMot);
router.put('/:id_mot', checkJWT, motController.updateMot);
router.delete('/:id_mot', checkJWT, motController.deleteMot);

module.exports = router;