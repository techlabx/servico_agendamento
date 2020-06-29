const {google} = require('googleapis');
const fs = require('fs');
const queries = require('../db/queries');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const CREDENCIAIS = leCredenciais('credentials.json');

function leCredenciais(filePath) {
    try {
        let content = fs.readFile(filePath);
        return JSON.parse(content);
    }
    catch (err) {
        console.log(err);
        throw(err);
    }
}

// Isso aqui vai ser substituido por uma query ao bd
function leToken(instituto) {
    try {
        let content = fs.readFile(`token_${instituto}.json`);
        return JSON.parse(content);
    }
    catch (err) {
        console.log(err);
        throw(err);
    }
}

async function criaClienteAutenticado(instituto) {
    let {client_secret, client_id, redirect_uris} = CREDENCIAIS.installed;
    let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    // As duas linhas abaixo devem substituir a linha seguinte quando a alteracao no BD acontecer
    // let infoAtendente = await queries.getAtendInstit(instituto);
    // let tokenAtendente = infoAtendente.token;
    let tokenAtendente = leToken(instituto);
    if (Object.entries(tokenAtendente).length == 0) {
        throw new Error("Atendente nao autorizou acesso para agenda");
    }
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
}

async function solicitaCriacaoToken(oAuth2Client, instituto) {
    let authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    return {
        instituto: instituto,
        link: authUrl
    };
}

async function confirmaCriacaoToken(oAuth2Client, instituto, codigo) {
    oAuth2Client.getToken(codigo, (err, token) => {
        // o conteudo desse callback deve ser substituido por uma insercao no bd
        let tokenPath = `token_${instituto}.json`;
        fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log("Token armazenado em", tokenPath);
        });
    });
}

async function listaEventosDisponiveis(oAuth2Client) {
    try {
        let calendar = google.calendar({version: 'v3', oAuth2Client});
        let eventos = await calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date()).toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        });
        let eventosDisponiveis = [];
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

async function atualizaEvento(oAuth2Client, evento, emailUsuario) {
    try {
        // Seta convite para o usuario
        let newAttendees = evento.attendees;
        newAttendees.push({email: emailUsuario});
        let calendar = google.calendar({version: 'v3', oAuth2Client});
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
        console.log(response);
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}