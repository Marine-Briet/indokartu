const express = require('express');
const router = express.Router();
const motRoutes = require('./motRoutes');
const categorieRoutes = require('./categorieRoutes');

router.use('/mots', motRoutes);
router.use('/categories', categorieRoutes);


module.exports = router;
