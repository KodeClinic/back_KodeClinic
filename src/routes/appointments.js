const express = require("express");
const router = express.Router();
// const appointmentController = require("../controllers/appointments");
const appointmentsUseCases = require("../useCases/appointments");

// Create Appointment & new patient
router.post(
  "/specialists/:idSpecialist/newpatient", // /specialists/:idSpecialist/newpatient
  async (req, res, next) => {
    try {
      const { idSpecialist } = req.params;
      const { body } = req;

      const newPatient = await appointmentsUseCases.createAppointmentNP(
        idSpecialist,
        body
      );
      res.status(201);
      res.json({
        msg: "Cita y Paciente creados con éxito",
        data: newPatient,
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Cita no creada", data: error } });
    }
  }
);

// Create Appointment for existing patient
router.post(
  "/specialists/:idSpecialist/existingpatient", // /specialists/:idSpecialist/existingpatient
  async (req, res, next) => {
    try {
      const { idSpecialist } = req.params;
      const { body } = req;

      const appointment = await appointmentsUseCases.createAppointmentEP(
        idSpecialist,
        body
      );

      res.status(201);
      res.json({
        msg: "Cita creada con éxito",
        data: appointment,
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Cita no creada", data: error } });
    }
  }
);

//Get the appointments of the Specialist
router.get(
  "/specialists/:idSpecialist/year/:year/month/:month/day/:day", // /specialists/:idSpecialist/year/:year/month/:month/day/:day
  async (req, res, next) => {
    try {
      const { idSpecialist } = req.params;
      const { year } = req.params;
      const { month } = req.params;
      const { day } = req.params;

      const appointments = await appointmentsUseCases.getSpecialistAppointments(
        idSpecialist,
        year,
        month,
        day
      );

      res.status(201);
      res.json({
        msg: "Citas encontradas con éxito",
        data: appointments,
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Citas no encontradas", data: error } });
    }
  }
);

//Get appointments for patient by Id
router.get(
  "/patients/:idPatient", // /patients/:idPatient
  async (req, res, next) => {
    try {
      const { idPatient } = req.params;

      const appointments = await appointmentsUseCases.getAppointmentsbyPatient(
        idPatient
      );

      res.status(201);
      res.json({
        msg: "Citas encontradas con éxito",
        data: appointments,
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Citas no encontradas", data: error } });
    }
  }
);

// Get the availability of the Specialist based on the day
router.get(
  //Cambiar a get
  "/availability/specialists/:idSpecialist/year/:year/month/:month/day/:day", // /availability/specialists/:idSpecialist/year/:year/month/:month/day/:day
  async (req, res, next) => {
    try {
      const { idSpecialist } = req.params;
      const { day, year, month } = req.body;

      const availability = await appointmentsUseCases.getSpecialistAvailability(
        idSpecialist,
        day,
        year,
        month
      );

      res.status(201);
      res.json({
        msg: "Disponibilidad calculada con éxito",
        data: availability,
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Error al evaluar la disponibilidad", data: error },
      });
    }
  }
);

//Delete Appointment & Clinical History
router.delete(
  "/:idAppointment", // /:idAppointment
  async (req, res, next) => {
    try {
      const { idAppointment } = req.params;

      const confirmation = await appointmentsUseCases.deleteAppointment(
        idAppointment
      );

      res.status(201);
      res.json({
        msg: confirmation,
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Cita no eliminada", data: error } });
    }
  }
);

//Get single appointment (Patient side use)
router.get(
  "/:idAppointment", // /:idAppointment
  async (req, res, next) => {
    try {
      const { idAppointment } = req.params;

      const data = await appointmentsUseCases.getSingleAppointment(
        idAppointment
      );

      res.status(201);
      res.json({
        msg: "Cita encontrada con éxito",
        data: data,
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Cita no encontrada", data: error },
      });
    }
  }
);

module.exports = router;
