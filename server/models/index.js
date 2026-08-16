const sequelize = require('../config/db_mysql.js');
const Utilisateur = require('./utilisateur');
const Mot = require('./mot');
const Categorie = require('./categorie');
const TypeGrammatical = require('./typeGrammatical');

// Associations Mot <-> Categorie
Mot.belongsTo(Categorie, { foreignKey: 'id_categ' });
Categorie.hasMany(Mot, { foreignKey: 'id_categ' });

//  Associations Mot <-> TypeGrammatical
Mot.belongsTo(TypeGrammatical, { foreignKey: 'id_type' });
TypeGrammatical.hasMany(Mot, {foreignKey: 'id_type'});


module.exports = { sequelize, Utilisateur, Mot, Categorie, TypeGrammatical };