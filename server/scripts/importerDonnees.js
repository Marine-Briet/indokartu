require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { Mot, Categorie, TypeGrammatical } = require('../models/index');

async function importerDonnees() {
    try {
        // --- ÉTAPE 1 : importer les Types grammaticaux ---
        const cheminTypes = path.join(__dirname, '../data/types.csv');
        const contenuTypes = fs.readFileSync(cheminTypes, 'utf-8');
        const lignesTypes = parse(contenuTypes, { columns: true, trim: true });

        for (const ligne of lignesTypes) {
            await TypeGrammatical.create({ nom_type: ligne.nom_type });
        }
        console.log(`${lignesTypes.length} types grammaticaux importés`);

        // --- ÉTAPE 2 : importer les Catégories ---
        const cheminCategories = path.join(__dirname, '../data/categories.csv');
        const contenuCategories = fs.readFileSync(cheminCategories, 'utf-8');
        const lignesCategories = parse(contenuCategories, { columns: true, trim: true });

        for (const ligne of lignesCategories) {
            await Categorie.create({ nom_categ: ligne.nom_categ, couleur_categ: ligne.couleur_categ });
        }
        console.log(`${lignesCategories.length} catégories importées`);

        // --- ÉTAPE 3 : recharger Catégories/Types depuis la base, pour connaître leurs vrais ID ---
        const toutesCategories = await Categorie.findAll();
        const tousTypes = await TypeGrammatical.findAll();

        // --- ÉTAPE 4 : importer les Mots, en convertissant nom_categ/nom_type en id_categ/id_type ---
        const cheminMots = path.join(__dirname, '../data/mots.csv');
        const contenuMots = fs.readFileSync(cheminMots, 'utf-8');
        const lignesMots = parse(contenuMots, { columns: true, trim: true });

        let nombreImportes = 0;
        let nombreEchecs = 0;

        for (const ligne of lignesMots) {
            const categorieTrouvee = toutesCategories.find((cat) => cat.nom_categ === ligne.nom_categ);
            const typeTrouve = tousTypes.find((t) => t.nom_type === ligne.nom_type);

            if (!categorieTrouvee || !typeTrouve) {
                console.log(`Ignoré : "${ligne.racine}" — catégorie ou type introuvable (${ligne.nom_categ} / ${ligne.nom_type})`);
                nombreEchecs++;
                continue;
            }

            await Mot.create({
                racine: ligne.racine,
                forme: ligne.forme || null,
                traduction: ligne.traduction,
                id_categ: categorieTrouvee.id_categ,
                id_type: typeTrouve.id_type
            });
            nombreImportes++;
        }

        console.log(`${nombreImportes} mots importés avec succès`);
        if (nombreEchecs > 0) {
            console.log(`${nombreEchecs} mots ignorés (catégorie/type introuvable)`);
        }

    } catch (error) {
        console.error("Erreur lors de l'import :", error);
    } finally {
        process.exit();
    }
}

importerDonnees();