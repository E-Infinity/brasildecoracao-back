import express from "express";
const { Branch, BranchType } = require("../usecases/Branch");

const router = express.Router()

router.get('/list/:idfilial?', Branch.list)
router.post('/register', Branch.register)
router.put('/update/:idfilial', Branch.update)
router.delete('/delete/:idfilial', Branch.delete)

router.get('/type/list/:idtipofilial?', BranchType.list)
router.post('/type/register', BranchType.register)
router.put('/type/update/:idtipofilial', BranchType.update)
router.delete('/type/delete/:idtipofilial', BranchType.delete)

module.exports = router