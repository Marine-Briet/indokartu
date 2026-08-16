const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send('API IndoKartu est fonctionnelle');
});

const {sequelize} = require('./models/index');

sequelize.authenticate()
.then(() => console.log('Connexion MySQL réussie !'))
.catch((error) => console.error('Erreur de connexion MySQL :', error));

sequelize.sync()
.then(() => console.log('Modèles synchronisés avec la base de données MySQL'))
.catch((error) => console.error('Erreur de synchronisation des modèles MySQL :', error));

const mongoose = require('./config/db_mongo');

module.exports = app;