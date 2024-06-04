// const express = require("express");
// const router = express.Router();
// const userController = require("../../controllers/users");

// //Users

// router.post("/users/createAccount", userController.createAccount); //público: crear cuenta y enviar código de verificación por email
// router.post("/users/validateEmail", userController.validateEmail); //público: validar email con código de verificación
// router.post("/users/auth/login", userController.login); //publico
// router.post("/users/forgotPassword", userController.forgotPassword); //publico: envía correo para restablecer contraseña

// router.patch("/users/restorePassword", userController.restorePassword); //publico
// router.post("/users/sendEmailCode", userController.sendEmailCode); //publico

// module.exports = router;

const express = require("express");
const router = express.Router();
const usersUseCases = require("../../useCases/users");

//Users

//POST /users/createaccount
router.post("/users/createaccount", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const newUser = await usersUseCases.createAccount(email, password);

    res.json({
      msg: "Usuario creado esperando validación de Email",
      data: newUser.email,
    });
  } catch (error) {
    next({ status: 400, send: { msg: "Usuario no creado", err: error } });
  }
});

//POST /users/validemail
router.post("/users/validemail", async (req, res, next) => {
  try {
    const { email, securityCode } = req.body;

    const validEmail = await usersUseCases.validateEmail(email, securityCode);

    res.json({
      msg: "Acceso autorizado",
      data: validEmail,
    });
  } catch (error) {
    next({ status: 401, send: { msg: "Acceso no autorizado", err: error } });
  }
});

//POST /users/login
router.post("/users/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const dataUser = await usersUseCases.login(email, password);

    res.json({
      msg: "Acceso autorizado",
      data: dataUser,
    });
  } catch (error) {
    next({
      status: error.status,
      send: { msg: "Acceso no autorizado", err: error },
    });
  }
});

//POST /users/forgotpassword
router.post("/users/forgotpassword", async (req, res, next) => {
  try {
    const { email } = req.body;

    const loginInfo = await usersUseCases.forgotPassword(email);

    res.json({
      msg: "Correo de restablecimiento de contraseña enviado, en espera de actualización",
      data: loginInfo,
    });
  } catch (error) {
    next({ status: 401, send: { msg: "Acceso no autorizado", err: error } });
  }
});

//PATCH /users/restorepassword
router.patch("/users/restorepassword", async (req, res, next) => {
  try {
    const { email, newpassword } = req.body;

    const restoreInfo = await usersUseCases.restorePassword(email, newpassword);

    res.json({
      msg: restoreInfo,
    });
  } catch (error) {
    next({
      status: 401,
      send: { msg: "Error al restablecer la contraseña", err: error },
    });
  }
});

//POST /users/sendemailcode
router.post("/users/sendemailcode", async (req, res, next) => {
  try {
    const { email } = req.body;

    const validationInfo = usersUseCases.sendEmailCode(email);

    res.json({
      msg: "Código de validación de Email enviado",
      data: validationInfo,
    });
  } catch (error) {
    next({ status: 400, send: { msg: "Código no enviado", err: error } });
  }
});

module.exports = router;
