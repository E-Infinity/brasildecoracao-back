import express, { application, request } from "express";
require("dotenv").config();
import verifyJWT from './Auth'

const router = express.Router();

const Auth = require('./handlers/auth-handler')
const User = require('./handlers/user-handler')
const Client = require('./handlers/client-handler')
const Product = require('./handlers/product-handler')

router.get("/", function (req, res) {
  res.json({ API: "Brasil de Coração - 1.0.4" });
});

router.use('/auth', Auth)
router.use('/user', verifyJWT, User)
router.use('/client', verifyJWT, Client)
router.use('/product', verifyJWT, Client)

export default router;
