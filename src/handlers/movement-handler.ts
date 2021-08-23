import express from "express";
const { Movement, TypeMovement } = require("../usecases/Movement");

const router = express.Router()

router.get('/list/:idmovimentacao?', Movement.list)
router.post('/register', Movement.register)

router.get('/type/list/:idtipomovimentacao?', TypeMovement.list)

module.exports = router