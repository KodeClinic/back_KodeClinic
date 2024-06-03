const express = require("express");
const router = express.Router();
//const medicalRecordController = require("../controllers/medicalRecords");
const medicalRecord = require("../usecases/medicalRecords/create");
//Medical Records

// router.post(
//   "/create/:patientId/:templateId",
//   medicalRecordController.createMedicalRecord
// ); // /api/medicalRecords/create/:patientId/:templateId

// router.get(
//   "/get/:patientId/:templateId",
//   medicalRecordController.getMedicalRecord
// ); // /api/medicalRecords/get/:patientId/:templateId

// router.patch(
//   "/update/:patientId/:templateId",
//   medicalRecordController.updateMedicalRecord
// ); // /api/medicalRecords/update/:patientId/:templateId


router.get("/get/:patientId/:templateId", async (request, response) => {
  try {
    const { patientId } = request.params;
    const medicalRecorById = await medicalRecord.getById(patientId);

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
});

router.post("/create/:patientId/:templateId", async (request, response) => {
  try {
    const { patientId, templateId } = request.params;
    const { values } = request.body;
    const newMedicalRecord = await medicalRecord.create(patientId, templateId,values);

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
});

router.patch("/update/:patientId", async (request, response) => {
  try {
    const { patientId } = request.params;
    const data = request.body;

    const updatedMedicalRecord = await medicalRecord.updateByPatientId(patientId, data);

    response.status(200);
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

});

module.exports = router;


