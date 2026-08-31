const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_postgres.js');

const Mot = sequelize.define('Mot', {
    id_mot: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    racine: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    forme: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    traduction: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'mots'
});

module.exports = Mot;