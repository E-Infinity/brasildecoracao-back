import express, { application, request } from "express";
require("dotenv").config();
import verifyJWT from './Auth'

const router = express.Router();

const Auth = require('./handlers/auth-handler')
const User = require('./handlers/user-handler')
const Client = require('./handlers/client-handler')

router.get("/", function (req, res) {
  res.json({ API: "Brasil de Coração - 1.0.3" });
});

router.use('/auth', Auth)
router.use('/user', verifyJWT, User)
router.use('/client', verifyJWT, Client)

router.get('/cliente', verifyJWT, (req, res, next) => {
  res.json([{id: 1, nome: 'Cliente 1'}])
})

export default router;
