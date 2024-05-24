const express = require("express");
const router = express.Router();
const medicalRecordController = require("../controllers/medicalRecords");

//Medical Records

router.post(
  "/create/:patientId/:templateId",
  medicalRecordController.createMedicalRecord
); // /api/medicalRecords/create/:patientId/:templateId

router.get(
  "/get/:patientId/:templateId",
  medicalRecordController.getMedicalRecord
); // /api/medicalRecords/get/:patientId/:templateId

router.patch(
  "/update/:patientId/:templateId",
  medicalRecordController.updateMedicalRecord
); // /api/medicalRecords/update/:patientId/:templateId

module.exports = router;
