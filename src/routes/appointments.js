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
  "/getAppointments/:idSpecialist/:year/:month/:day",
  appointmentController.getSpecialistAppointments
);

//Get appointments for patient by Id
router.get(
  "/getAppointmentsbyPatient/:idPatient",
  appointmentController.getAppointmentsbyPatient
);

// Get the availability of the Specialist based on the day
router.post(
  "/getAvailability/:idSpecialist",
  appointmentController.getSpecialistAvailability
);

module.exports = router;
