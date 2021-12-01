import express from 'express'
import routes from './routes'
require('dotenv').config()
//import cors from 'cors'
var timeout = require('connect-timeout')

const app = express()
//app.use(cors())
app.use(express.json({limit: '4096mb'}))
app.use(timeout('6000s'))

app.use(routes)

app.listen(process.env.PORT || 3333, () => {
    console.log('Server running on port: 3333')
})
