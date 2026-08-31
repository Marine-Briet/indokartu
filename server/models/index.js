// Fichier central pour gérer les modèles et leurs associations

const sequelize = require('../config/db_postgres.js');
const Utilisateur = require('./utilisateur');
const Mot = require('./mot');
const Categorie = require('./categorie');
const TypeGrammatical = require('./typeGrammatical');


// Associations Mot <-> Categorie
Mot.belongsTo(Categorie, { foreignKey: { name: 'id_categ', allowNull: false } });
Categorie.hasMany(Mot, { foreignKey: 'id_categ' });

//  Associations Mot <-> TypeGrammatical
Mot.belongsTo(TypeGrammatical, { foreignKey: { name: 'id_type', allowNull: false } });
TypeGrammatical.hasMany(Mot, {foreignKey: 'id_type'});


module.exports = { sequelize, Utilisateur, Mot, Categorie, TypeGrammatical };