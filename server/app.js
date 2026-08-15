const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send('API IndoKartu est fonctionnelle');
});


const sequelize = require('./config/db.mysql');
const mongoose = require('./config/db.mongo');

sequelize.authenticate()
.then(() => console.log('Connexion MySQL réussie !'))
.catch((error) => console.error('Erreur de connexion MySQL :', error));

module.exports = app;