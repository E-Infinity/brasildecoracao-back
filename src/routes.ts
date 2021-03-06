import express, { application, request } from "express";
require("dotenv").config();
import verifyJWT from './Auth'

const router = express.Router();

const Auth = require('./handlers/auth-handler')
const User = require('./handlers/user-handler')
const Client = require('./handlers/client-handler')
const Product = require('./handlers/product-handler')
const Branch = require('./handlers/branch-handler')
const Sale = require('./handlers/sale-handler')
const Movement = require('./handlers/movement-handler')
const Debts = require('./handlers/debts-handler')

router.get("/", function (req, res) {
  res.json({ API: "Brasil de Coração - 1.0.6 " + process.env.DB_HOST });
});

router.use('/auth', Auth)
router.use('/user', verifyJWT, User)
router.use('/client', verifyJWT, Client)
router.use('/product', verifyJWT, Product)
router.use('/branch', verifyJWT, Branch)
router.use('/sale', verifyJWT, Sale)
router.use('/movement', verifyJWT, Movement)
router.use('/debts', verifyJWT, Debts)

export default router;
