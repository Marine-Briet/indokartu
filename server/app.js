// Import des modules nécessaires
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

// Import les routes
const indexRoutes = require('./routes/index');

// Import une instance de l'app
const app = express();

// Cors
app.use(cors());

// Middleware pour passer le corps des requêtes en JSON
app.use(express.json());

// Import BDD Postgres et MongoDB
const {sequelize} = require('./models/index');
const mongoose = require('./config/db_mongo');


// Test de connexion à la base de données Postgres et synchronisation des modèles
sequelize.authenticate()
.then(() => console.log('Connexion Postgres réussie !'))
.catch((error) => console.error('Erreur de connexion Postgres :', error));

sequelize.sync({ alter: true })
.then(() => console.log('Modèles synchronisés avec la base de données Postgres'))
.catch((error) => console.error('Erreur de synchronisation des modèles Postgres :', error));

// Route de test juste pour vérifier que l'API fonctionne
app.get('/', (req, res) => {
    res.send('API IndoKartu est fonctionnelle');
});

// Route de l'API
app.use('/api', indexRoutes);

module.exports = app;