import express from "express";
const { User } = require("../usecases/User");

const router = express.Router()

router.get('/list/:idusuario?', User.list)
router.post('/register', User.register)
router.put('/update/:idusuario', User.update)

module.exports = router