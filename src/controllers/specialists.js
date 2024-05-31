const User = require("../models/users");

module.exports = {
  completeInformation: async (req, res, next) => {
    const { idSpecialist } = req.params;
    const values = req.body;

    const update = {
      name: values.name,
      lastName: values.lastName,
      birthDate: values.birthDate,
      gender: values.gender,
      cellphone: values.cellphone,
      address: values.address,
      colony: values.colony,
      state: values.state,
      informationComplete: true,
      "specialistInformation.medicalLicense": values.medicalLicense,
      "specialistInformation.medicalSpeciality": values.medicalSpeciality.value,
    };

    try {
      let Specialist = await User.findById(idSpecialist);
      if (!Specialist) {
        next({ status: 404, send: { msg: "Usuario no encontrado" } });
      }
      await User.findByIdAndUpdate(idSpecialist, update);

      next({
        status: 201,
        send: { msg: "Inforación del Especialista actualizada", data: update },
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Información no actualizada", err: error },
      });
    }
  },
  getPatients: async (req, res, next) => {
    const { idSpecialist } = req.params;

    try {
      const specialist = await User.findById(idSpecialist);
      const patientList = specialist.specialistInformation.patientList;

      next({
        status: 201,
        send: {
          msg: "Inforación del Especialista actualizada",
          data: patientList,
        },
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Pacientes no encontrados", err: error },
      });
    }
  },
};
