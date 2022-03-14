import express from "express";
const { Debts, TypeDocument,TypeDebts } = require("../usecases/Debts");

const router = express.Router()

router.post('/list/:idcontaspagar?', Debts.list)
router.post('',Debts.register)
router.delete('/:idcontaspagar', Debts.delete)

router.put('/parcel/:idcontaspagarparcela', Debts.update)
router.put('/parcelvalue/:idcontaspagar', Debts.updateValue)

router.get('/typedocument/:idtipodocumento?', TypeDocument.list)

router.get('/typedebts/:idtipoconta?', TypeDebts.list)
router.post('/typedebts', TypeDebts.register)
router.post('/typedebts/:idtipocontaspagar', TypeDebts.update)

module.exports = router