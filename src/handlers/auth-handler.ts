import express from "express";
const { Auth } = require("../usecases/Auth");

const router = express.Router();

router.post("/login", Auth.login);

module.exports = router;
