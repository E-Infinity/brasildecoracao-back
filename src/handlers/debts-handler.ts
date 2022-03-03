import express from "express";
const { Debts, TypeDocument } = require("../usecases/Debts");

const router = express.Router()

router.post('/list/:idcontaspagar?', Debts.list)
router.post('',Debts.register)
router.delete('/:idcontaspagar', Debts.delete)

router.put('/parcel/:idcontaspagarparcela', Debts.update)

router.get('/typedocument/:idtipodocumento?', TypeDocument.list)

router.get('/typedebts/:idtipoconta?', TypeDocument.list)

module.exports = router