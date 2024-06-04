const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointments");
const appointmentCases = require("../useCases/appointments");

// Create Appointment & new patient
/*router.post(
  "/createNP/:idSpecialist", // /specialists/:idSpecialist/newpatient
  appointmentController.createAppointmentNP
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

//Get single appointment (Patient side use)
router.get(
  "/findAppointment/:idAppointment", // /:idAppointment
  appointmentController.getSingleAppointment
);*/

router.post("/specialists/:idSpecialist/newpatient", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_px } = req.params;
    let appoint = await appointmentCases.createAppointment(id, id_px);
    res.json({
      msg: "Cita creada con exito",
      data: appoint,
    });
  } catch (error) {
    next({
      status: 400,
      send: { msg: "Cita no creada", err: error },
    });
  }
});

router.delete(":idAppointment", async (req, res, next) => {
  try {
    const { idAppointment } = req.params;
    let deleteAppointment = await appointmentCases.deleteAppointment(
      idAppointment
    );
    res.json({
      status: 201,
      msg: "Cita eliminada",
    });
  } catch (error) {
    next({
      status: 400,
      send: { msg: "Cita no eliminada", err: error },
    });
  }
});

router.post("/specialists/:idSpecialist/newpatient", async (req, res, next) => {
  try {
    const { idAppointment } = req.params;
    const {
      name,
      lastName,
      cellphone,
      email,
      gender,
      date,
      birthDate,
      timeLapse,
      consultType,
      consultingAddress,
    } = req.body;

    let newPatientInfo = {
      name: name,
      lastName: lastName,
      email: email,
      password: hassedPassword,
      cellphone: cellphone,
      gender: gender,
      role: "patient",
      birthDate: birthDate,
      validatedAccount: false,
      informationComplete: false,
      temporalyPassword: true,
      verificationCode: verificationCode,
      patientInformation: { specialistId: idSpecialist },
    };

    let createAppointmentNP = await appointmentCases.createAppointmentNP(
      idAppointment,
      newPatientInfo
    );
    res.json({
      status: 201,
      msg: "Cita y paciente creados con éxito",
      data: createAppointmentNP,
    });
  } catch (error) {
    next({
      status: 400,
      send: { msg: "Cita no creada", err: error },
    });
  }
});

module.exports = router;
