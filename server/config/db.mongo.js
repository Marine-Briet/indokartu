const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connexion MongoDB réussie !'))
.catch((error) => console.error('Erreur de connexion MongoDB :', error));



