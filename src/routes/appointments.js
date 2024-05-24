const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointments");

// Create Appointment & new patient
router.post(
  "/createNP/:idSpecialist",
  appointmentController.createAppointmentNP
);

// Create Appointment for existing patient
router.post(
  "/createEP/:idSpecialist",
  appointmentController.createAppointmentEP
);

//Get the appointments of the Specialist
router.get(
  "/getAppointments/:idSpecialist",
  appointmentController.getSpecialistAppointments
);

//Get appointments for patient by Id
router.get(
  "/getAppointmentsbyPatient/:idPatient",
  appointmentController.getAppointmentsbyPatient
);

module.exports = router;
