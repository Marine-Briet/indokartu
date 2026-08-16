const express = require('express');
const router = express.Router();

const motController = require('../controllers/motController');

router.get('/', motController.getAllMots);
router.post('/', motController.createMot);

module.exports = router;