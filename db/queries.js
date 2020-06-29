const knex = require('./knex'); // Conexão

module.exports = {

    // --------------------------------------------------------- Institutos

    // SELECT * FROM instituto;
    getAllInstit(){
        return knex('instituto');
    },


    // --------------------------------------------------------- Atendentes

    // Seleciona o atendente responsável pelo instituto cuja sigla foi passada
    //na rota
    getAtendInstit(instituto){
        return knex('instituto').join('atendente', 'instituto.atendenteresp',
                    'atendente.emailatendente').select('atendente.nomeatendente',
                    'atendente.emailatendente', 'atendente.linkagenda')
                    .where('instituto.siglainstituto', instituto);
    }

}
