import express from "express";
const { User, TypeUser } = require("../usecases/User");

const router = express.Router()

router.get('/list/:idusuario?', User.list)
router.post('/register', User.register)
router.put('/update/:idusuario', User.update)

router.get('/type/list/:idtipousuario?', TypeUser.list)
router.post('/type/register', TypeUser.register)
router.put('/type/update/:idtipousuario', TypeUser.update)

module.exports = router