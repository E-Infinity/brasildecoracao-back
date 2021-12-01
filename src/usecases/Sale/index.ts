const SalesOrder = require('./salesorder')
const SalesOrderItem = require('./salesorderitem')
const SalesOrderSituation = require('./salesordersituation')
const OrderOrigin = require('./orderorigin')
const PaymentType = require('./paymenttype')
const Trial = require('./trial')
const FileOrder = require('./fileorder')
const SaleComment = require('./salecomment')

module.exports = {
  SalesOrder,
  SalesOrderSituation,
  OrderOrigin,
  PaymentType,
  Trial,
  FileOrder,
  SaleComment,
  SalesOrderItem
}