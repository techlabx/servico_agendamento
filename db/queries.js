const knex = require('./knex'); // Conexão

module.exports = {

    // --------------------------------------------------------- Token
    async createTokenInfo(tokenInfo) {
        return await knex('token').insert(tokenInfo, '*');
    },

    async getTokenInfo(instituto) {
        return await knex('token').where('institutoToken', instituto); 
    },

    async updateTokenInfo(instituto, tokenInfo) {
        return await knex('token').where('instituto', instituto).update(tokenInfo, '*');
    },

    async deleteTokenInfo(instituto) {
        return await knex('token').where('instituto', instituto).del();
    }

}
