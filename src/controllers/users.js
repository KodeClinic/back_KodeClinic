//Los modelos se importan empezando con mayusculas
const User = require("../models/users");
const jwt = require("../utils/jwt");
const transporter = require("../utils/mailer");
const { compare } = require("../helpers/handleBcrypt");

module.exports = {
  getbyId: async (req, res, next) => {
    const { id } = req.params;
    try {
      let selectuser = await User.findById(id);
      if (!selectuser) {
        next({ status: 404, send: { msg: "Usuario no encontrado" } });
      }

      selectuser.password = "xxxx";

      next({
        status: 201,
        send: { msg: "Usuario encotrado", data: selectuser },
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Usuario no encontrado", err: error } });
    }
  },

  createAccount: async (req, res, next) => {
    let securityCode = "";

    for (let index = 0; index <= 3; index++) {
      let character = Math.ceil(Math.random() * 9);
      securityCode += character;
    }

    try {
      const hassedPassword = await encrypt(req.body.password); //Hasea la contraseña

      let user = await User.create({
        ...req.body,
        password: hassedPassword,
        verificationCode: securityCode,
        validatedAccount: false,
        informationComplete: false,
      });
      await transporter.sendMail({
        from: '"KodeClinic" <contacto.kodeclinic@gmail.com>',
        to: req.body.email,
        subject: `Código de Verificación de Email: ${securityCode}`,
        // text: "Hello world?", // plain text body
        html: `<b>Bienvenido a KodeClinc, el código para completar la verificación de este correo es: ${securityCode} </b>`, // html body
      });
      next({
        status: 201,
        send: {
          msg: "Usuario creado esperando validación de Email",
          data: user.email,
        },
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Usuario no creado", err: error } });
    }
  },

  sendEmailCode: async (req, res, next) => {
    const { email } = req.body;
    let securityCode = "";

    for (let index = 0; index <= 3; index++) {
      let character = Math.ceil(Math.random() * 9);
      securityCode += character;
    }

    try {
      let user = await User.findOne({
        email: email,
      });

      user.verificationCode = securityCode;
      await user.save();

      await transporter.sendMail({
        from: '"KodeClinic" <contacto.kodeclinic@gmail.com>',
        to: req.body.email,
        subject: `Código de Verificación de Email: ${securityCode}`,
        html: `<b>El código para completar la verificación de este correo es: ${securityCode} </b>`, // html body
      });
      next({
        status: 201,
        send: {
          msg: "Código de validación de Email enviado",
          data: user.email,
        },
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Código no enviado", err: error } });
    }
  },

  validateEmail: async (req, res, next) => {
    const { email, securityCode } = req.body;

    try {
      let user = await User.findOne({
        email: email,
        verificationCode: securityCode,
      });
      if (!user) {
        next({ status: 401, send: { msg: "Código incorrecto" } });
      }
      user.validatedAccount = true;
      user.verificationCode = "";
      await user.save();

      let token = jwt.create(user);
      next({
        status: 200,
        send: {
          msg: "Acceso autorizado",
          token: token,
        },
      });
    } catch (error) {
      next({ status: 401, send: { msg: "Acceso no autorizado", err: error } });
    }
  },

  login: async (req, res, next) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      const checkPassword = await compare(req.body.password, user.password);
      if (!checkPassword) {  
        next({ status: 400, send: { msg: "Email o password incorrecto" } });
      } else if (user.validatedAccount === false) {
        next({ status: 401, send: { msg: "Email pendiente de validar" } });
      }

      let token = jwt.create(user);
      next({
        status: 200,
        send: {
          msg: "Acceso autorizado",
          data: {
            token: token,
            id: user._id,
            role: user.role,
            informationComplete: user.informationComplete,
          },
        },
      });
    } catch (error) {
      next({ status: 401, send: { msg: "Acceso no autorizado", err: error } });
    }
  },

  forgotPassword: async (req, res, next) => {
    const { email } = req.body;

    try {
      let user = await User.findOne({
        email: email,
      });
      if (!user) {
        next({ status: 401, send: { msg: "Email no registrado" } });
      }

      let securityCode = "";

      for (let index = 0; index <= 3; index++) {
        let character = Math.ceil(Math.random() * 9);
        securityCode += character;
      }

      user.verificationCode = securityCode;
      await user.save();

      await transporter.sendMail({
        from: '"KodeClinic" <contacto.kodeclinic@gmail.com>',
        to: req.body.email,
        subject: `Código de restablecimiento de contraseña: ${securityCode}`,
        // text: "Hello world?", // plain text body
        html: `<b>El código para poder restablecer su contraseña es: ${securityCode} </b>`, // html body
      });
      next({
        status: 201,
        send: {
          msg: "Correo de restablecimiento de contraseña enviado, en espera de actualización",
          data: user.email,
        },
      });
    } catch (error) {
      next({ status: 401, send: { msg: "Acceso no autorizado", err: error } });
    }
  },

  restorePassword: async (req, res, next) => {
    const { email, newpassword } = req.body;

    try {
      let user = await User.findOne({
        email: email,
      });

      user.password = newpassword;
      await user.save();

      next({
        status: 201,
        send: {
          msg: "Contraseña restablecida con éxito",
        },
      });
    } catch (error) {
      next({
        status: 401,
        send: { msg: "Error al restablecer la contraseña", err: error },
      });
    }
  },
};
