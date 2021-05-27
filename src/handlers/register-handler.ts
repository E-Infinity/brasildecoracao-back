import express from "express";
const { User } = require("../usecases/Register");

const router = express.Router()

router.post('/user', User.register)

module.exports = router