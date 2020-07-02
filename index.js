'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const eventos = require('./routes/eventos.routes');
const token = require('./routes/token.routes');

var corsOptions = {
    origin: function (origin, callback) {
        callback(null, true)
    }
}

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use('/acolhimento', eventos);
app.use('/acolhimento', token);


const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
console.log(`Servico Agendamento running on http://localhost:${PORT}`);

