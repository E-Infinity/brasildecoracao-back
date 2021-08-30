import express from "express";
const { SalesOrder, SalesOrderSituation, OrderOrigin, PaymentType, Trial } = require("../usecases/Sale");

const router = express.Router()

router.get('/list/:idpedidovenda?', SalesOrder.list)
router.post('/register', SalesOrder.register)
router.put('/update/:idpedidovenda', SalesOrder.update)
router.delete('/delete/:idpedidovenda', SalesOrder.delete)
router.get('/tiny/:idpedidovenda', SalesOrder.syncTiny)

router.get('/paymenttype/list/:idtipopagamento?', PaymentType.list)
router.post('/paymenttype/register', PaymentType.register)
router.put('/paymenttype/update/:idtipopagamento', PaymentType.update)

router.get('/trial/list/:trial', Trial.list)
router.post('/trial/register', Trial.register)

router.get('/orderorigin/list/:idorigempedido?', OrderOrigin.list)
router.post('/orderorigin/register', OrderOrigin.register)
router.put('/orderorigin/update/:idorigempedido', OrderOrigin.update)
// router.delete('/orderorigin/delete/:idorigempedido', OrderOrigin.delete)

router.get('/ordersituation/list/:idsituacaopedidovenda?', SalesOrderSituation.list)
router.post('/ordersituation/register', SalesOrderSituation.register)
router.put('/ordersituation/update/:idsituacaopedidovenda', SalesOrderSituation.update)
// router.delete('/ordersituation/delete/:idsituacaopedidovenda', SalesOrderSituation.delete)

module.exports = router