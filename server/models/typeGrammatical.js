const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_mysql.js');

const TypeGrammatical = sequelize.define('TypeGrammatical', {
    id_type: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_type: {
        type: DataTypes.STRING(150),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'types_grammaticaux'
});

module.exports = TypeGrammatical;