const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('../config/db_postgres');
const bcrypt = require ('bcrypt');
const { Utilisateur } = require('../models/index');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const createAdmin = async () => {
    try {
        const hashMotDePasse = await bcrypt.hash(ADMIN_PASSWORD, 10);
        const uniqueAdmin = await Utilisateur.create({email: 'admin@indokartu.fr', mot_de_passe: hashMotDePasse, est_admin:true});
        console.log('Compte Admin créé avec succès !', uniqueAdmin.email);
    } catch (error) {
        console.log('Erreur lors de la création du compte Admin :', error);
    }
};

createAdmin();