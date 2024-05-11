//Los modelos se importan empezando con mayusculas
const MedicalRecord = require("../models/medicalRecords");
const jwt = require("../utils/jwt");
const Template = require("../models/templates");
const Patient = require("../models/users");

module.exports = {
  createMedicalRecord: async (req, res, next) => {
    const { patientId, templateId } = req.params;
    const {} = req.body;
    const TemplateId = await Template.findOne({ templateID: templateId });
    const PatientId = await Patient.findById(patientId);

    try {
      let medicalRecord = await MedicalRecord.create({
        patientId: PatientId,
        templateId: TemplateId,
        values: req.body,
      });

      await Patient.findByIdAndUpdate(PatientId, {
        "patientInformation.medicalRecordId": medicalRecord,
      });

      next({
        status: 201,
        send: {
          msg: "Antecedentes médicos creados con éxito",
          data: medicalRecord,
        },
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Antecedentes no creados", err: error },
      });
    }
  },
};
