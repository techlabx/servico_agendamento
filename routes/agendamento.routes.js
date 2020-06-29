const express = require('express');
const calendar = require('../utils/calendar');

const router = express.Router();

router.get('/atendimento/:idAgenda', (req, res) => {
    try {
        console.log("Get agenda");
        res.status(200).send({
            "agenda": req.params.idAgenda
        });
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Error");
    }
});

router.put('/atendimento/:idAgenda/:idEvento', (req, res) => {
    try {
        console.log(`Trying to modify event ${req.params.idEvento} from agenda ${req.params.idAgenda}`);
        res.status(200).send({
            "agenda": req.params.idAgenda,
            "evento": req.params.idEvento
        });
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Error");
    }
}) 