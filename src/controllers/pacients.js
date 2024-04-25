const PxInfo = require("../models/pacients");

module.exports = {
  post: async (req, res, next) => {
    try {
      let pxinfo = await PxInfo.create(req.body);
      next({
        status: 201,
        send: { msg: "Paciente creado", data: { pxinfo } },
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Paciente no creado: ", err: error } });
    }
  },
  getById: async (req, res, next) => {
    const { pxId } = req.params;
    try {
      let pxinfo = await PxInfo.findById(pxId);
      next({
        status: 200,
        send: { msg: "Paciente encontrado", data: pxinfo },
      });
    } catch (error) {
      next({ status: 404, send: { msg: "Paciente no encontrado" } });
    }
  },
};
