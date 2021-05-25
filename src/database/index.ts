import knex from 'knex'

const connection = knex({
    client: 'pg',
    connection: {
        host : 'brasildecoracao.cyyhe6g05cab.sa-east-1.rds.amazonaws.com',
        user : 'infinity',
        password : '!Infinity99',
        database : 'brasildecoracao',
        port: 5432
    }
})

export default connection