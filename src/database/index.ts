import knex from 'knex'
require("dotenv").config();

console.log(process.env.HOST, process.env.USER, process.env.PASSWORD, process.env.DATABASE, process.env.DBPORT)

const connection = knex({
    client: 'pg',
    connection: {
        host: 'ec2-54-197-100-79.compute-1.amazonaws.com',
        user : 'pguoxpkunbojve',
        password : '5308d927b4357d7464eda6d89b5f76e2383cb9ccb6adfdf08cb24df62f694c87',
        database : 'd6kgri96p21uvn',
        port: 5432
    }, 
    pool: {
      afterCreate: function (conn: any, done: any) {
        // in this example we use pg driver's connection API
        conn.query('SELECT 1; ', function (err: any) {
          if (err) {
            // first query failed, return error and don't try to make next query
            done(err, conn);
          } else {
            // do the second query...
            conn.query('SELECT 1;', function (err:any) {
              // if err is not falsy, connection is discarded from pool
              // if connection aquire was triggered by a query the error is passed to query promise
              done(err, conn);
            });
          }
        });
      }
    }
})



export default connection