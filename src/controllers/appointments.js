const Appointment = require("../models/appointments.js");

module.exports = {
  createAppointment: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id_px } = req.params;
      let appoint = await Appointment.create({
        ...req.body,
        specialistId: { id },
        patientId: { id_px },
      });
      next({ status: 201, send: { msg: "Cita creada", data: appoint } });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Cita no creada", data: error },
      });
    }
  },
  detele: async (req, res, next) => {
    try {
      const { id } = req.params;
      let appoint = await Appointment.findByIdAndDelete(id);
      next({ status: 201, send: { msg: "Cita eliminada" } });
    } catch (error) {
      next({ status: 400, send: { msg: "Cita no eliminada", data: error } });
    }
  },
};
