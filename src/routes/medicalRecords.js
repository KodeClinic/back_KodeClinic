const express = require("express");
const router = express.Router();
const medicalRecord = require("../useCases/medicalRecords");
const checkRoleAuth = require("../midlewares/roleAuth");

//Medical Records
router.get(
  "/:templateId/patients/:patientId",
  checkRoleAuth(["specialist"]),
  async (request, response) => {
    try {
      const { patientId } = request.params;
      const medicalRecorById = await medicalRecord.getById(patientId);

      response.status(201);
      response.json({
        message: "Antes Medicos encontrados con exito",
        data: medicalRecorById,
      });
    } catch (error) {
      response.status(500);
      response.json({
        message: "Antecedentes medicos no encontrados",
        error: error.message,
      });
    }
  }
);

router.post(
  "/:templateId/patients/:patientId",
  checkRoleAuth(["specialist"]),
  async (request, response) => {
    try {
      const { patientId, templateId } = request.params;
      const { body } = request;
      const newMedicalRecord = await medicalRecord.create(
        patientId,
        templateId,
        body
      );

      response.status(201);
      response.json({
        message: "New Medical Record Created",
        data: newMedicalRecord,
      });
    } catch (error) {
      const status = error.name === "ValidationError" ? 400 : 500;
      response.status(status);
      // const message = Object.entries(error.errors).map((key) => `${key}`);
      response.json({
        message: "Antecedentes no creados",
        error: error.message,
      });
    }
  }
);

router.patch(
  "/patients/:patientId",
  checkRoleAuth(["specialist"]),
  async (request, response) => {
    try {
      const { patientId } = request.params;
      const data = request.body;

      const updatedMedicalRecord = await medicalRecord.updateByPatientId(
        patientId,
        data
      );

      response.status(201);
      response.json({
        message: "Medical Record Updated",
        data: updatedMedicalRecord,
      });
    } catch (error) {
      const status = error.name === "ValidationError" ? 400 : 500;
      response.status(status);
      response.json({
        message: "Antecedentes no actualizados",
        error: error.message,
      });
    }
  }
);

module.exports = router;
