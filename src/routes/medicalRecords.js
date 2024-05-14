const express = require("express");
const router = express.Router();
const medicalRecordController = require("../controllers/medicalRecords");

//Users
router.post(
  "/create/:patientId/:templateId",
  medicalRecordController.createMedicalRecord
); // /api/medicalRecords/create/:patientId/:templateId

router.get(
  "/get/:patientId/:templateId",
  medicalRecordController.getMedicalRecord
); // /api/medicalRecords/get/:patientId/:templateId

// router.patch(
//   "/editInformation/:specialistId",
//   specialistController.editSpecilistInfo
// ); // /api/specialists/editInformation/:specialistId

module.exports = router;
