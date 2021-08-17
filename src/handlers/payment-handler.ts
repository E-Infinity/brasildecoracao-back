import express from "express";
const { ParcelSituation, PaymentType } = require("../usecases/Payment");

const router = express.Router()

router.get('/parcelsituation/list/:idsituacaoparcela?', ParcelSituation.list)
router.post('/parcelsituation/register', ParcelSituation.register)
router.put('/parcelsituation/update/:idsituacaoparcela', ParcelSituation.update)

router.get('/paymenttype/list/:idtipoparcela?', PaymentType.list)
router.post('/paymenttype/register', PaymentType.register)
router.put('/paymenttype/update/:idtipoparcela', PaymentType.update)

module.exports = router