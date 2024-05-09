const express = require("express");
const router = express.Router();
const medicalRecordController = require("../controllers/medicalRecords");

//Users
router.get("/create", medicalRecordController.createMedicalRecord); // /api/medicalRecords/create

module.exports = router;
