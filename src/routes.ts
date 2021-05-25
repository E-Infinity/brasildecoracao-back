import express, { application, request } from "express";
require("dotenv").config();
import verifyJWT from './Auth'

const router = express.Router();

const Auth = require('./handlers/auth-handler')

// const ShippingHandler = require('./handlers/shipping-handler')
// const ClientHandler = require('./handlers/client-handler')

router.get("/", function (req, res) {
  res.json({ API: "Brasil de Coração - 1.0.0" });
});

router.use('/auth', Auth)

router.get('/cliente', verifyJWT, (req, res, next) => {
  res.json([{id: 1, nome: 'Cliente 1'}])
})

// router.use ('/shipping', ShippingHandler)
// router.use('/client', ClientHandler)

export default router;
