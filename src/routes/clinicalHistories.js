const express = require("express");
const router = express.Router();
const clinicalHistoryCotroller = require("../controllers/clinicHistories");

// Create

router.post(
  "/update/:patientId/:templateId/:appointmentId",
  clinicalHistoryCotroller.updateClinicalHistory
); //  api/clinicalHistories/update/:patientId/:teplateId

module.exports = router;
