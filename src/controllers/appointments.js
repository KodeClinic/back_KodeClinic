const Appointment = require("../models/appointments");
const Specialist = require("../models/users");
const Patient = require("../models/users");

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

  createAppointmentNP: async (req, res, next) => {
    const { idSpecialist } = req.params;
    const {
      name,
      lastName,
      cellphone,
      email,
      gender,
      date,
      startTime,
      endTime,
      consultType,
      consultingAddress,
    } = req.body;

    let temporalyPassword = "";

    for (let index = 0; index <= 5; index++) {
      let character = Math.ceil(Math.random() * 9);
      temporalyPassword += character;
    }

    let timeLapse = `${startTime} - ${endTime}`;
    let arrayDate = date.split("-");
    let dateObjet = {
      year: arrayDate[0],
      month: arrayDate[1],
      day: arrayDate[2],
    };

    try {
      let newPatientInfo = {
        name: name,
        lastName: lastName,
        email: email,
        password: temporalyPassword,
        cellphone: cellphone,
        gender: gender,
        role: "patient",
        validatedAccount: false,
        informationComplete: false,
        patientInformation: { specialistId: idSpecialist },
      };
      const specialist = await Specialist.findById(idSpecialist);
      const newPatient = await Patient.create(newPatientInfo);

      const appointment = await Appointment.create({
        date: dateObjet,
        consultType: consultType,
        paymentType: "pending",
        paymentStatus: "topay",
        status: "schedule",
        timeLapse: timeLapse,
        consultingAdress: consultingAddress,
        specialistId: idSpecialist,
        patientId: newPatient._id,
      });

      const specialistUpdate = await Specialist.findByIdAndUpdate(
        idSpecialist,
        {
          "specialistInformation.patientList": [
            ...specialist.specialistInformation.patientList,
            {
              patientID: newPatient._id,
              patientName: name,
              patientLastName: lastName,
              patientGender: gender,
              patientCellphone: cellphone,
            },
          ],
        }
      );

      (newPatient.patientInformation.appointmentList = {
        appointmentId: appointment._id,
      }),
        await newPatient.save();

      next({
        status: 201,
        send: {
          msg: "Cita y Paciente creados con éxito",
          data: newPatient,
        },
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Cita no creada", data: error } });
    }
  },
};
