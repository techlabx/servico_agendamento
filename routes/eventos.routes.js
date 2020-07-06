const express = require('express');
const calendar = require('../utils/calendar');

const router = express.Router();

router.get('/eventos/:instituto', async (req, res) => {
    try {
        let listaDeEventos = await calendar.listaEventosDisponiveis(req.params.instituto);
        if (listaDeEventos) {
            res.status(200).send(listaDeEventos);
        }
        else {
            res.status(404).send("Nenhum evento encontrado");
        }
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Error");
    }
});

router.post('/eventos/:instituto', async (req, res) => {
    try {
        let nomeUsuario = req.body.userName;
        let emailUsuario = req.body.userEmail;
        let ini = req.body.dataHoraIni;
        let urgente = req.body.flagUrgente;

        calendar.sendMailAgend(nomeUsuario, emailUsuario, ini, urgente);

        let sucesso = true;
        // ------------------------------------------------

        if (sucesso) {
            res.status(200).send("Um email foi enviado para o Apoia/GAPsi solicitando atendimento.");
        }

    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Error");
    }
});

router.put('/eventos/:instituto/:idEvento', async (req, res) => {
    try {
        let evento = req.body.evento;
        let emailUsuario = req.body.userEmail;
        let resultado = calendar.atualizaEvento(req.params.instituto, evento, emailUsuario);
        if (resultado) {
            res.status(200).send("Sucesso");
        }
        else {
            res.status(500).send("Erro");
        }
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Error");
    }
});

module.exports = router;
