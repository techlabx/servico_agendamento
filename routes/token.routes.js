const express = require('express');
const calendar = require('../utils/calendar');

const router = express.Router();

function validCode(code) {
    const hasCode = typeof code == 'string' && code.trim() != '';

    return hasCode;
}

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
        if(validCode(req.body.code)){
            await calendar.confirmaCriacaoToken(req.params.instituto, req.body.code);
            res.status(200).send("OK");
        }
        else res.status(500).send("Erro: url vazia.");
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Erro");
    }
});

// precisa de delete

module.exports = router;
