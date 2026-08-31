const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_postgres.js');

const Categorie = sequelize.define('Categorie', {
    id_categ: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_categ: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    couleur_categ: {
        type: DataTypes.STRING(150),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'categories'
});

module.exports = Categorie;