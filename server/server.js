const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});