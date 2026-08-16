const mongoose = require('mongoose');

const resultatSchema = new mongoose.Schema({
    id_mot: {
        type: Number,
        required: true
    },
    est_reussi: {
        type: Boolean,
        required: true
    }
}, { _id: false });

const sessionSchema = new mongoose.Schema({
    id_utilisateur: {
        type: Number,
        required: true
    },
    date_heure: {
        type: Date,
        required: true,
        default: Date.now
    },
    resultats: [resultatSchema]
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
