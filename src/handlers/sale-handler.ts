import express from "express";
const { SalesOrder, SalesOrderSituation, OrderOrigin } = require("../usecases/Sale");

const router = express.Router()

// router.get('/list/:idpedidovenda?', SalesOrder.list)
// router.post('/register', SalesOrder.register)
// router.put('/update/:idpedidovenda', SalesOrder.update)
// router.delete('/delete/:idpedidovenda', SalesOrder.delete)

router.get('/orderorigin/list/:idorigempedido?', OrderOrigin.list)
router.post('/orderorigin/register', OrderOrigin.register)
router.put('/orderorigin/update/:idorigempedido', OrderOrigin.update)
router.delete('/orderorigin/delete/:idorigempedido', OrderOrigin.delete)

router.get('/ordersituation/list/:idsituacaopedidovenda?', SalesOrderSituation.list)
router.post('/ordersituation/register', SalesOrderSituation.register)
router.put('/ordersituation/update/:idsituacaopedidovenda', SalesOrderSituation.update)
router.delete('/ordersituation/delete/:idsituacaopedidovenda', SalesOrderSituation.delete)

module.exports = router