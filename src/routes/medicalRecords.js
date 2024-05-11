const express = require("express");
const router = express.Router();
const medicalRecordController = require("../controllers/medicalRecords");

//Users
router.post(
  "/create/:patientId/:templateId",
  medicalRecordController.createMedicalRecord
); // /api/medicalRecords/create/:patientId/:templateId

module.exports = router;
