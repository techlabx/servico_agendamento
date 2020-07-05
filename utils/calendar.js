const fs = require('fs');
const {google} = require('googleapis');
const queries = require('../db/queries')

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CREDENCIAIS = leCredenciais('credentials.json');
const cache = {};

function leCredenciais(filePath) {
    try {
        let credentials = fs.readFileSync(filePath);
        return JSON.parse(credentials);
    }
    catch (err) {
        console.log(err);
        throw(err);
    }
}

// Isso aqui vai ser substituido por uma query ao bd
function leToken(instituto) {
    try {
        let token = fs.readFileSync(`token_${instituto}.json`);
        return JSON.parse(token);
    }
    catch (err) {
        console.log(err);
        throw(err);
    }
}

async function criaClienteAutenticado(instituto) {
    let {client_secret, client_id, redirect_uris} = CREDENCIAIS.installed;
    let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    let token = await queries.getTokenInfo(instituto);
    console.log(token);
    if (token.access_token === null) {
        throw new Error("Atendente nao autorizou acesso para agenda");
    }
    delete token["idtoken"];
    delete token["institutotoken"];
    delete token["linkagenda"];
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
}

async function solicitaCriacaoToken(instituto) {
    try {
        let {client_secret, client_id, redirect_uris} = CREDENCIAIS.installed;
        let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        let authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        cache[instituto] = oAuth2Client;
        return authUrl;
    }
    catch (err) {
        console.error(err);
    }
}

async function confirmaCriacaoToken(instituto, codigo) {
    try{
        oAuth2Client = cache[instituto];
        oAuth2Client.getToken(codigo, async (err, token) => {
            console.log(token)
            let tokenInfo = await queries.getTokenInfo(instituto);
            tokenInfo.access_token = token.access_token,
            tokenInfo.refresh_token = token.refresh_token,
            tokenInfo.scope = token.scope,
            tokenInfo.token_type = token.token_type,
            tokenInfo.expiry_date = token.expiry_date
            await queries.updateTokenInfo(instituto, tokenInfo);
        });
        let atendente = await queries.getAtendenteInst(instituto);
        atendente.statusatendente = "CONFIRMED"
        await queries.updateAtend(instituto, atendente);
    }
    catch (err) {
        console.error(err);
    }
}

async function listaEventosDisponiveis(instituto) {
    try {
        let oAuth2Client = await criaClienteAutenticado(instituto);
        let calendar = google.calendar({version: 'v3', auth: oAuth2Client});
        let calId = await queries.getTokenInfo(instituto);
        calId = calId.linkagenda;
        let res = await calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        });
        let eventosDisponiveis = [];
        let eventos = res.data.items;
        eventos.forEach(evento => {
            if (evento.summary == 'Livre') {
                eventosDisponiveis.push(evento);
            }
        });
        return eventosDisponiveis;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
}

async function atualizaEvento(instituto, evento, emailUsuario) {
    try {
        let oAuth2Client = await criaClienteAutenticado(instituto);
        // Seta convite para o usuario
        let newAttendees = []
        newAttendees.push({email: emailUsuario});
        let calendar = google.calendar({version: 'v3', auth: oAuth2Client});
        let calId = await queries.getTokenInfo(instituto).linkagenda;
        let response = await calendar.events.update({
            calendarId: 'primary',
            eventId: evento.id,
            sendUpdates: "all",
            requestBody: {
                "attendees": newAttendees,
                "end": evento.end,
                "start": evento.start,
                "summary": "Agendado",
            }
        });
        return response;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {
    criaClienteAutenticado,
    solicitaCriacaoToken,
    confirmaCriacaoToken,
    listaEventosDisponiveis,
    atualizaEvento
}