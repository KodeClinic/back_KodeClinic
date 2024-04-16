//Los modelos se importan empezando con mayusculas
const User = require("../models/users");
const jwt = require("../utils/jwt");
const transporter = require("../utils/mailer");

module.exports = {
  getbyId: async (req, res, next) => {
    const { id } = req.params;
    let selectuser = await User.findById(id);
    if (!selectuser)
      next({ status: 404, send: { msg: "Usuario no encontrado" } });
    next({ status: 201, send: { msg: "Usuario encotrado", data: selectuser } });
  },

  // post: async (req, res, next) => {
  //   console.log(req.body);
  //   try {
  //     let user = await User.create(req.body);
  //     next({ status: 201, send: { msg: "Usuario creado", data: user } });
  //   } catch (error) {
  //     next({ status: 400, send: { msg: "Usuario no creado", err: error } });
  //   }

  //   try {
  //     await transporter.sendMail({
  //       from: '"Verificación de Email" <contacto.kodeclinic@gmail.com>', // sender address
  //       to: req.body.email,
  //       subject: "Verificación de Email", // Subject line
  //       // text: "Hello world?", // plain text body
  //       html: "<b>Código de verificación es: 2345</b>", // html body
  //     });
  //   } catch (error) {
  //     next({ status: 400, send: { msg: "Usuario no creado", err: error } });
  //   }
  // },

  createAccount: async (req, res, next) => {
    let securityCode = "";

    for (let index = 0; index <= 5; index++) {
      let character = Math.ceil(Math.random() * 9);
      securityCode += character;
    }

    try {
      let user = await User.create({
        ...req.body,
        verificationCode: securityCode,
        validatedAccount: false,
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
          data: user,
        },
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Usuario no creado", err: error } });
    }
  },

  // validateEmail: async (req, res, next) => {

  // },

  login: async (req, res, next) => {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user.password != req.body.password) {
        next({ status: 401, send: { msg: "Email o password incorrecto" } });
      }
      //delete user.password
      let token = jwt.create(user);
      next({
        status: 200,
        send: {
          msg: "Acceso autorizado",
          token: token,
          // imgprofile: user.imgprofile,
          // name: user.name,
        },
      });
    } catch (error) {
      console.log(error);
      next({ status: 401, send: { msg: "Acceso no autorizado", err: error } });
    }
  },
};
