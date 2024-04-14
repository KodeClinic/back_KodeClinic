//Los modelos se importan empezando con mayusculas
const User = require("../models/users");
const jwt = require("../utils/jwt");

module.exports = {
  getbyId: async (req, res, next) => {
    const { id } = req.params;
    let selectuser = await User.findById(id);
    if (!selectuser)
      next({ status: 404, send: { msg: "Usuario no encontrado" } });
    next({ status: 201, send: { msg: "Usuario encotrado", data: selectuser } });
  },

  post: async (req, res, next) => {
    console.log(req.body);
    try {
      let user = await User.create(req.body);
      next({ status: 201, send: { msg: "Usuario creado", data: user } });
    } catch (error) {
      next({ status: 400, send: { msg: "Usuario no creado", err: error } });
    }
  },
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
          imgprofile: user.imgprofile,
          name: user.name,
        },
      });
    } catch (error) {
      console.log(error);
      next({ status: 401, send: { msg: "Acceso no autorizado", err: error } });
    }
  },
};
