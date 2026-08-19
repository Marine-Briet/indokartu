const express = require('express');
const router = express.Router();
const { checkJWT } = require('../middlewares/checkAuth');

const statsController = require('../controllers/statsController');

router.get('/', checkJWT, statsController.getStatistiques);

module.exports = router;