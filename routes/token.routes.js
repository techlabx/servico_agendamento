const express = require('express');
const queries = require('../db/queries');
const calendar = require('../utils/calendar');
const { response } = require('express');

const router = express.Router();

cache.on("error", function (error) {
    console.error(error);
});

router.post('/token/:instituto', async (req, res) => {
    try {
        let authUrl = await calendar.solicitaCriacaoToken(req.params.instituto);
        res.status(200).send({"authUrl": authUrl});
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Erro");
    }    
});

router.put('/token/:instituto', async (req, res) => {
    try {
        await calendar.confirmaCriacaoToken(req.params.instituto, req.body.code);
        res.status(200).send("OK");
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Erro");
    }
});

module.exports = router;