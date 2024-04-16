const express = require("express");
const router = express.Router();
const userController = require("../../controllers/users");

//Users
router.get("/users/:id", userController.getbyId); //publico
router.post("/users/createAccount", userController.createAccount); //público: crear cuenta y enviar código de verificación por email
router.post("/users/validateEmail/:email", userController.validateEmail); //público: validar email con código de verificación
router.post("/users/auth/login", userController.login); //publico

module.exports = router;
