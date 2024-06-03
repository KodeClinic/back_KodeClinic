const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointments");

// Create Appointment & new patient
router.post(
  "/createNP/:idSpecialist", // /specialists/:idSpecialist/newpatient
  appointmentController.createAppointmentNP
);

// Create Appointment for existing patient
router.post(
  "/createEP/:idSpecialist", // /specialists/:idSpecialist/existingpatient
  appointmentController.createAppointmentEP
);

//Get the appointments of the Specialist
router.get(
  "/getAppointments/:idSpecialist/:year/:month/:day", // /specialists/:idSpecialist/year/:year/month/:month/day/:day
  appointmentController.getSpecialistAppointments
);

//Get appointments for patient by Id
router.get(
  "/getAppointmentsbyPatient/:idPatient", // /patients/:idPatient
  appointmentController.getAppointmentsbyPatient
);

// Get the availability of the Specialist based on the day
router.post(
  //Cambiar a get
  "/getAvailability/:idSpecialist", // /availability/specialists/:idSpecialist/year/:year/month/:month/day/:day
  appointmentController.getSpecialistAvailability
);

//Delete Appointment & Clinical History
router.delete(
  "/deleteAppointment/:idAppointment", // /:idAppointment
  appointmentController.deleteAppointment
);

//Get single appointment (Patient side use)
router.get(
  "/findAppointment/:idAppointment", // /:idAppointment
  appointmentController.getSingleAppointment
);

module.exports = router;
