const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send('API IndoKartu est fonctionnelle');
});

module.exports = app;