const ClinicalHistory = require("../models/clinicalHistories");
const Patient = require("../models/users");
const Template = require("../models/templates");
const Appointment = require("../models/appointments");

module.exports = {
  updateClinicalHistory: async (req, res, next) => {
    const { patientId, templateId, appointmentId } = req.params;

    try {
      const template = await Template.findOne({ templateID: templateId });
      const appointment = await Appointment.findById(appointmentId);
      const clinicalHistory = await ClinicalHistory.findByIdAndUpdate(
        appointment.clinicalHistory,
        {
          templateId: template._id,
          values: req.body,
          status: "complete",
        }
      );

      next({
        status: 201,
        send: {
          msg: "Historia Clinica creada con éxito",
          data: clinicalHistory,
        },
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Historia Clinica no creada", err: error },
      });
    }
  },
};
