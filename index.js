'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const eventos = require('./routes/eventos.routes');
const token = require('./routes/token.routes');

const app = express();
app.use(bodyParser.json());

app.use('/', eventos);
app.use('/', token)


const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
console.log(`Servico Agendamento running on http://localhost:${PORT}`);

