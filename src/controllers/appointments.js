const Appointment = require("../models/appointments");
const Specialist = require("../models/users");
const Patient = require("../models/users");
const ClinicalHistory = require("../models/clinicalHistories");
const Template = require("../models/templates");
const transporter = require("../utils/mailer");

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

  //Create appointment for New Patient
  createAppointmentNP: async (req, res, next) => {
    const { idSpecialist } = req.params;
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

    //Creacion Contraseña temporal
    let temporalyPassword = "";
    for (let index = 0; index <= 5; index++) {
      let character = Math.ceil(Math.random() * 9);
      temporalyPassword += character;
    }

    let verificationCode = "";
    for (let index = 0; index <= 3; index++) {
      let character = Math.ceil(Math.random() * 9);
      verificationCode += character;
    }

    let arrayDate = date.split("-");
    let dateObjet = {
      year: arrayDate[0],
      month: arrayDate[1],
      day: arrayDate[2],
    };

    try {
      // const hassedPassword = await encrypt(temporalyPassword); //Hashea la contraseña
      let newPatientInfo = {
        name: name,
        lastName: lastName,
        email: email,
        password: temporalyPassword,
        cellphone: cellphone,
        gender: gender,
        role: "patient",
        birthDate: birthDate,
        validatedAccount: false,
        informationComplete: false,
        verificationCode: verificationCode,
        patientInformation: { specialistId: idSpecialist },
      };
      const specialist = await Specialist.findById(idSpecialist);
      const template = Template.find({ templateID: 2 });

      //Creacion de Pciente
      const newPatient = await Patient.create(newPatientInfo);

      //Creacion de cita
      const appointment = await Appointment.create({
        date: dateObjet,
        consultType: consultType,
        paymentType: "pending",
        paymentStatus: "topay",
        status: "start",
        timeLapse: timeLapse,
        consultingAddress: consultingAddress,
        specialistId: idSpecialist,
        patientId: newPatient._id,
      });

      //Creacion de Historia Clinica
      const clinicalHistory = await ClinicalHistory.create({
        appointmentId: appointment._id,
        patientId: newPatient._id,
        templateId: template._id,
        status: "pending",
      });

      //Actualización de Specialista: adision del Paciente a su lista de pacientes
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
              patientBirthdate: birthDate,
            },
          ],
        }
      );

      //Actualizacion Paciente: adision de cita en lista de citas paciente
      newPatient.patientInformation.appointmentList.push({
        appointmentId: appointment._id,
      });
      await newPatient.save();

      //Actualización de Cita: adisión de id de historia clinica
      appointment.clinicalHistory = clinicalHistory._id;
      appointment.save();

      //Envio de Email con conrtaseña temporal
      await transporter.sendMail({
        from: '"KodeClinic" <contacto.kodeclinic@gmail.com>',
        to: email,
        subject: `Contraseña temporal para acceso a KodeClinic`,
        // text: "Hello world?", // plain text body
        html: `<b>Bienvenido a KodeClinc, tu contraseña temporal para ingresar a la Plataforma y completar la verificación de este correo es: ${temporalyPassword} </b>`, // html body
      });

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
  //Create appointment for Existing patient
  createAppointmentEP: async (req, res, next) => {
    const { idSpecialist } = req.params;
    const { patient, date, timeLapse, consultType, consultingAddress } =
      req.body;

    let arrayDate = date.split("-");
    let dateObjet = {
      year: arrayDate[0],
      month: arrayDate[1],
      day: arrayDate[2],
    };

    try {
      const specialist = await Specialist.findById(idSpecialist);
      const selectPatient = await Patient.findById(patient);
      const template = Template.find({ templateID: 2 });

      //Creacion de cita
      const appointment = await Appointment.create({
        date: dateObjet,
        consultType: consultType,
        paymentType: "pending",
        paymentStatus: "topay",
        status: "start",
        timeLapse: timeLapse,
        consultingAddress: consultingAddress,
        specialistId: idSpecialist,
        patientId: patient,
      });

      //Creación de Historia Clinica
      const clinicalHistory = await ClinicalHistory.create({
        appointmentId: appointment._id,
        patientId: selectPatient._id,
        templateId: template._id,
        status: "pending",
      });

      //Actualización de paciente: adision de cita
      selectPatient.patientInformation.appointmentList.push({
        appointmentId: appointment._id,
      });
      await selectPatient.save();

      //Actualización de Cita: adisión de id de historia clinica
      appointment.clinicalHistory = clinicalHistory._id;
      appointment.save();

      next({
        status: 201,
        send: {
          msg: "Cita creada con éxito",
          data: appointment,
        },
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Cita no creada", data: error } });
    }
  },

  getSpecialistAppointments: async (req, res, next) => {
    const { idSpecialist } = req.params;
    const { year } = req.params;
    const { month } = req.params;
    const { day } = req.params;

    try {
      const appointments = await Appointment.find({
        specialistId: idSpecialist,
        "date.year": year,
        "date.month": month,
        "date.day": day,
      }).populate("patientId");

      next({
        status: 201,
        send: {
          msg: "Citas encontradas con éxito",
          data: appointments,
        },
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Citas no encontradas", data: error } });
    }
  },

  getAppointmentsbyPatient: async (req, res, next) => {
    const { idPatient } = req.params;

    try {
      const appointments = await Appointment.find({
        patientId: idPatient,
      });

      next({
        status: 201,
        send: {
          msg: "Citas encontradas con éxito",
          data: appointments,
        },
      });
    } catch (error) {
      next({ status: 400, send: { msg: "Citas no encontradas", data: error } });
    }
  },

  getSpecialistAvailability: async (req, res, next) => {
    const { idSpecialist } = req.params;
    const { day, year, month } = req.body;

    try {
      const appointments = await Appointment.find({
        specialistId: idSpecialist,
        "date.year": year,
        "date.month": month,
        "date.day": day,
      });

      const optionSelectDuration = [];
      let interval = {};

      for (let i = 6; i < 22; i++) {
        let starthour = i;
        let endhour = i + 1;
        if (endhour < 12) {
          interval = {
            value: `${starthour}:00 - ${endhour}:00 am`,
            label: `${starthour}:00 - ${endhour}:00 am`,
          };
          optionSelectDuration.push(interval);
        } else if (endhour >= 12) {
          interval = {
            value: `${starthour}:00 - ${endhour}:00 pm`,
            label: `${starthour}:00 - ${endhour}:00 pm`,
          };
          optionSelectDuration.push(interval);
        }
      }

      const availability = optionSelectDuration.filter((interval) => {
        return !appointments.some(
          (appointment) => appointment.timeLapse === interval.value
        );
      });

      next({
        status: 201,
        send: {
          msg: "Disponibilidad calculada con éxito",
          data: availability,
        },
      });
    } catch (error) {
      console.log(error);
      next({
        status: 400,
        send: { msg: "Error al evaluar la disponibilidad", data: error },
      });
    }
  },
};
