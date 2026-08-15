const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_mysql.js');

const Utilisateur = sequelize.define('Utilisateur', {
    id_utilisateur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    mot_de_passe: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    est_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    timestamps: false,
    tableName: 'utilisateurs'
});

module.exports = Utilisateur;