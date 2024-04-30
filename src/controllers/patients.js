const PxAdditionalInfo = require("../models/submodels/patients");

module.exports = {
  createPxAdditionalInfo: async (req, res, next) => {
    try {
      let pxadditionalinfo = await PxAdditionalInfo.create(req.body);
      next({
        status: 201,
        send: { msg: "Paciente creado", data: { pxadditionalinfo } },
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Paciente no creado: ", err: error } });
    }
  },
  getPatientById: async (req, res, next) => {
    const { id } = req.params;
    try {
      let pxadditionalinfo = await PxAdditionalInfo.findById(id);
      next({
        status: 200,
        send: { msg: "Paciente encontrado", data: pxadditionalinfo },
      });
    } catch (error) {
      next({ status: 404, send: { msg: "Paciente no encontrado" } });
    }
  },
  getAllPatients: async (req, res, next) => {
    try {
      let AllPatients = await PxAdditionalInfo.find();
      next({
        status: 200,
        send: { msg: "Pacientes encontrados", data: AllPatients },
      });
    } catch (error) {
      next({ status: 404, send: { msg: "Pacientes no encontrados" } });
    }
  },
};
