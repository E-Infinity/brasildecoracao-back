import express from 'express'

const router = express.Router()

// const ShippingHandler = require('./handlers/shipping-handler')
// const ClientHandler = require('./handlers/client-handler')

router.get('/', function(req, res) {
    res.json({API: 'Brasil de Coração - 1.0.0'})
})

// router.use ('/shipping', ShippingHandler)
// router.use('/client', ClientHandler)

export default router