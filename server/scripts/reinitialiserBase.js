require('dotenv').config();
const readline = require('readline');

const { Mot, Categorie, TypeGrammatical, sequelize } = require('../models/index');
const mongoose = require('../config/db_mongo');
const Session = require('../models/session');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('⚠️  Cette action va SUPPRIMER DÉFINITIVEMENT tous les mots, catégories et sessions. Taper "CONFIRMER" pour continuer : ', async (reponse) => {
    if (reponse !== "CONFIRMER") {
        console.log("Annulé, aucune donnée supprimée.");
        rl.close();
        process.exit();
    }

    try {
        await Mot.destroy({ where: {}, truncate: true });
        console.log("Table mots vidée");

        await Categorie.destroy({ where: {} });
        console.log("Table categories vidée");

        await TypeGrammatical.destroy({ where: {} });
        console.log("Table type grammatical vidée");


        await sequelize.query("ALTER TABLE mots AUTO_INCREMENT = 1;");
        await sequelize.query("ALTER TABLE categories AUTO_INCREMENT = 1;");
        await sequelize.query("ALTER TABLE types_grammaticaux AUTO_INCREMENT = 1;");
        console.log("Compteurs réinitialisés");

        await Session.deleteMany({});
        console.log("Collection Sessions vidée");

        console.log("Base réinitialisée avec succès !");
    } catch (error) {
        console.error("Erreur lors de la réinitialisation :", error);
    } finally {
        rl.close();
        process.exit();
    }
});