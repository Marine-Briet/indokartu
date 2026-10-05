// Crée (ou remet à zéro) le compte démo public, toujours en rôle APPRENANT.
// Usage : node scripts/createDemo.js
// Variables requises dans .env : DEMO_EMAIL, DEMO_PASSWORD

const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const sequelize = require('../config/db_postgres');
const { Utilisateur } = require('../models/index');

const DEMO_EMAIL = process.env.DEMO_EMAIL;
const DEMO_PASSWORD = process.env.DEMO_PASSWORD;

const createDemo = async () => {
    if (!DEMO_EMAIL || !DEMO_PASSWORD) {
        console.log('DEMO_EMAIL et DEMO_PASSWORD doivent être définis dans le fichier .env');
        return;
    }

    try {
        const hashMotDePasse = await bcrypt.hash(DEMO_PASSWORD, 10);
        const compteExistant = await Utilisateur.findOne({ where: { email: DEMO_EMAIL } });

        if (compteExistant) {
            // Le compte existe déjà : on remet le mot de passe et on force le rôle apprenant
            await compteExistant.update({ mot_de_passe: hashMotDePasse, est_admin: false });
            console.log('Compte démo réinitialisé :', DEMO_EMAIL);
        } else {
            await Utilisateur.create({ email: DEMO_EMAIL, mot_de_passe: hashMotDePasse, est_admin: false });
            console.log('Compte démo créé avec succès :', DEMO_EMAIL);
        }
    } catch (error) {
        console.log('Erreur lors de la création du compte démo :', error);
    } finally {
        await sequelize.close();
    }
};

createDemo();