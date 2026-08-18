const express = require('express');
const router = express.Router();
const { checkJWT } = require('../middlewares/checkAuth');

const sessionController = require('../controllers/sessionController');

router.post('/', checkJWT, sessionController.createSession);

module.exports = router;