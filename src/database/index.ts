import knex from 'knex'
require("dotenv").config();

const connection = knex({
    client: 'pg',
    connection: {
        host: process.env.HOST,
        user : process.env.USER,
        password : process.env.PASSWORD,
        database : process.env.DATABASE,
        port: parseInt(process.env.PORT ? process.env.PORT : '5432')
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