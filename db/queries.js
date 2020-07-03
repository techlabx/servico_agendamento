const knex = require('./knex'); // Conexão

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
    createTokenInfo,
    getTokenInfo,
    updateTokenInfo,
    deleteTokenInfo
}
