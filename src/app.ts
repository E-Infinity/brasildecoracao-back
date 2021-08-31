import express from 'express'
import routes from './routes'
require('dotenv').config()
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json({limit: '4096mb'}))

app.use(routes)

app.listen(process.env.PORT || 3333, () => {
    console.log('Server running on port: 3333')
})