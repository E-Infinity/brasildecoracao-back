import express from "express";
const { Product, ColorFibra, Trama, ColorAluminio, ProductGrade, ProductPrice, Inventory, ProductionTrama } = require("../usecases/Product");

const router = express.Router()

//

// Product
router.get('/list/:idproduto?', Product.list)
router.post('/register', Product.register)
router.put('/update/:idproduto', Product.update)

// ColorFibra
router.get('/colorfibra/list/:idcorfibra?', ColorFibra.list)
router.post('/colorfibra/register', ColorFibra.register)
router.put('/colorfibra/update/:idcorfibra', ColorFibra.update)

// Trama
router.get('/trama/list/:idtrama?', Trama.list)
router.post('/trama/register', Trama.register)
router.put('/trama/update/:idtrama', Trama.update)

// ColorAluminio
router.get('/coloraluminio/list/:idcoraluminio?', ColorAluminio.list)
router.post('/coloraluminio/register', ColorAluminio.register)
router.put('/coloraluminio/update/:idcoraluminio', ColorAluminio.update)

// Produto Grade
router.get('/productgrade/list/:idproduto?', ProductGrade.list)
router.get('/productgrade/one/:idprodutograde', ProductGrade.listOne)
router.post('/productgrade/register', ProductGrade.register)
router.put('/productgrade/update/:idprodutograde', ProductGrade.update)

router.get('/productgrade/integrar/:_idprodutograde/:update?', ProductGrade.cadastroTiny)

// Inventory
router.get('/inventory/list/:idproduto?', Inventory.list)
router.get('/inventory/grade/:idprodutograde?', Inventory.listGrade)

// ProductPrice
router.get('/productprice/list/:idproduto?', ProductPrice.list)
router.get('/productprice/grade/:idproduto', ProductPrice.listGrade)
router.post('/productprice/register', ProductPrice.register)
router.put('/productprice/update/:idprodutovalor', ProductPrice.update)

// Production Trama
router.get('/producaotrama/:idproducaotrama?', ProductionTrama.list)
router.delete('/producaotrama/:idproducaotrama', ProductionTrama.delete)
router.post('/producaotrama/list', ProductionTrama.list)
router.post('/producaotrama', ProductionTrama.register)

module.exports = router