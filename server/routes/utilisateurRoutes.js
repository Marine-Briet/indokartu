const express = require('express');
const router = express.Router();
const { checkJWT } = require('../middlewares/checkAuth');

const utilisateurController = require('../controllers/utilisateurController');

router.get('/', checkJWT, utilisateurController.getMesInfos);
router.put('/', checkJWT, utilisateurController.updateMesInfos);

module.exports = router;