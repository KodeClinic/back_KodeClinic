const express = require("express");
const router = express.Router();
const userController = require("../../controllers/users");

//Users

router.post("/users/createAccount", userController.createAccount); //público: crear cuenta y enviar código de verificación por email
router.post("/users/validateEmail", userController.validateEmail); //público: validar email con código de verificación
router.post("/users/auth/login", userController.login); //publico
router.post("/users/forgotPassword", userController.forgotPassword); //publico: envía correo para restablecer contraseña

router.patch("/users/restorePassword", userController.restorePassword); //publico
router.post("/users/sendEmailCode", userController.sendEmailCode); //publico

module.exports = router;
