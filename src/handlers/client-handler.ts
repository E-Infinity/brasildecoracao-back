import express from "express";
const { Client } = require("../usecases/Client");

const router = express.Router()

router.get('/list/:idcliente?', Client.list)
router.post('/register', Client.register)
router.put('/update/:idcliente', Client.update)


module.exports = router