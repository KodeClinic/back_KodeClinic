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
    const { id } = req.params;
    const pxId = id;
    console.log(pxId);
    try {
      //let pxinfo = await PxInfo.findById(id);
      let pxinfo = await PxInfo.findOne({ pxId: pxId });
      next({
        status: 200,
        send: { msg: "Paciente encontrado", data: pxinfo },
      });
    } catch (error) {
      next({ status: 404, send: { msg: "Paciente no encontrado" } });
    }
  },
  getAll: async (req, res, next) => {
    try {
      let PxAll = await PxInfo.find();
      next({
        status: 200,
        send: { msg: "Pacientes encontrados", data: PxAll },
      });
    } catch (error) {
      next({ status: 404, send: { msg: "Pacientes no encontrados" } });
    }
  },
};
