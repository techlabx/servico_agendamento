'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', teste);
async function teste(req, res) {
    res.status(200).send("servico de agendamento UP");
}

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
console.log(`Servico Agendamento running on http://localhost:${PORT}`);

