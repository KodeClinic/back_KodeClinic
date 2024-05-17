const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointments");

// Create Appointment & new patient
router.post(
  "/createNP/:idSpecialist",
  appointmentController.createAppointmentNP
);

module.exports = router;
