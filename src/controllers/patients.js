const PxAdditionalInfo = require("../models/submodels/patients");
const SpecialistInformationSchema = require("../models/submodels/specialists");
const PxNewPatient = require("../models/users");
const PxUsers = require("../models/users");

module.exports = {
  createNewPx: async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);
      let NewPx = await PxNewPatient.create({
        ...req.body,
        patientInformation: { specialistId: id },
      });
      next({
        status: 201,
        send: { msg: "Paciente creado", data: { NewPx } },
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Paciente no creado: ", err: error } });
    }
  },
  getPatientById: async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    try {
      let pxadditionalinfo = await PxUsers.findById(id);
      next({
        status: 200,
        send: { msg: "Paciente encontrado", data: pxadditionalinfo },
      });
    } catch (error) {
      next({ status: 404, send: { msg: "Paciente no encontrado" } });
    }
  },
  getAllPatients: async (req, res, next) => {
    const { id } = req.params;

    try {
      let AllPatients = await PxUsers.findOne({
        ...req.body,
        specialistInformation: patientList,
      });
      next({
        status: 200,
        send: { msg: "Pacientes encontrados", data: AllPatients },
      });
    } catch (error) {
      next({ status: 404, send: { msg: "Pacientes no encontrados" } });
    }
  },
};
