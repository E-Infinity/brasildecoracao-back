import express from 'express'
import routes from './routes'
require('dotenv').config()
import cors from 'cors'
var timeout = require('connect-timeout')

const app = express()
app.use(express.json({limit: '4096mb'}))
app.use(timeout('60000s'))
app.use(cors())

app.use(routes)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(process.env.PORT || 3333, () => {
    console.log('Server running on port: 3333')
})
