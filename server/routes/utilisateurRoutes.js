const express = require('express');
const router = express.Router();
const { checkJWT, bloquerCompteDemo } = require('../middlewares/checkAuth');

const utilisateurController = require('../controllers/utilisateurController');

router.get('/', checkJWT, utilisateurController.getMesInfos);
router.put('/', checkJWT, bloquerCompteDemo, utilisateurController.updateMesInfos);

module.exports = router;