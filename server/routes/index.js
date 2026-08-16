const express = require('express');
const router = express.Router();
const motRoutes = require('./motRoutes');

router.use('/mots', motRoutes);


module.exports = router;
