const knex = require('./knex'); // Conexão

async function getAtendenteInst(instituto){
    return await knex('atendente').where('institutoatendente', instituto).first();
}

async function updateAtend(instituto, usuario){
    return await knex('atendente').where('institutoatendente', instituto).update(usuario, '*');
}

async function createTokenInfo(tokenInfo) {
    return await knex('token').insert(tokenInfo, '*');
}

async function getTokenInfo(instituto) {
    return await knex('token').where('institutotoken', instituto).first(); 
}

async function updateTokenInfo(instituto, tokenInfo) {
    return await knex('token').where('institutotoken', instituto).update(tokenInfo, '*');
}

async function deleteTokenInfo(instituto) {
    return await knex('token').where('institutotoken', instituto).del();
}

module.exports = {
    getAtendenteInst,
    updateAtend,
    createTokenInfo,
    getTokenInfo,
    updateTokenInfo,
    deleteTokenInfo
}
