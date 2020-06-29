const express = require('express');

const router = express.Router();
const queries = require('../db/queries');

router.get('/institutos', (req, res) => {
    try {
        let institutos = await queries.getAllInstitutos();
        res.status(200).send(institutos);
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Erro");
    }
});

router.get('/institutos/:instituto', (req, res) => {
    try {
        let atendente = await queries.getAtendInstit(req.params.instituto);
        if (atendente) {
            res.status(200).send(atendente);
        }
        else {
            res.status(404).send("Not found");
        }
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Erro");
    }
})

module.exports = router;