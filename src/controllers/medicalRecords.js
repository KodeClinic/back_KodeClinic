//Los modelos se importan empezando con mayusculas
const MedicalRecord = require("../models/medicalRecords");
const jwt = require("../utils/jwt");
const transporter = require("../utils/mailer");

module.exports = {
  createMedicalRecord: async (req, res, next) => {
    try {
      let medicalRecord = await MedicalRecord.create({
        ...req.body,
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
