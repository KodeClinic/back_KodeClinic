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
      startTime,
      endTime,
      consultType,
      consultingAddress,
    } = req.body;

    //Creacion Contraseña temporal
    let temporalyPassword = "";
    for (let index = 0; index <= 5; index++) {
      let character = Math.ceil(Math.random() * 9);
      temporalyPassword += character;
    }

    // let fullName = `${name} ${lastName}`;
    let timeLapse = `${startTime} - ${endTime}`;
    let arrayDate = date.split("-");
    let dateObjet = {
      year: arrayDate[0],
      month: arrayDate[1],
      day: arrayDate[2],
    };

    try {
      const hassedPassword = await encrypt(temporalyPassword); //Hashea la contraseña
      let newPatientInfo = {
        name: name,
        lastName: lastName,
        email: email,
        password: hassedPassword,
        cellphone: cellphone,
        gender: gender,
        role: "patient",
        validatedAccount: false,
        informationComplete: false,
        verificationCode: temporalyPassword,
        patientInformation: { specialistId: idSpecialist },
      };
      const specialist = await Specialist.findById(idSpecialist);
      const template = Template.find({ templateID: 2 });

      //Creacion de Pciente
      const newPatient = await Patient.create(newPatientInfo);

      //Creacion de cita
      const appointment = await Appointment.create({
        date: dateObjet,
        // fullName: fullName,
        // gender: gender,
        consultType: consultType,
        paymentType: "pending",
        paymentStatus: "topay",
        status: "schedule",
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
    const {
      patient,
      date,
      startTime,
      endTime,
      consultType,
      consultingAddress,
    } = req.body;

    let timeLapse = `${startTime} - ${endTime}`;
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

      // let fullName = `${selectPatient.name} ${selectPatient.lastName}`;

      //Creacion de cita
      const appointment = await Appointment.create({
        date: dateObjet,
        // fullName: fullName,
        // gender: selectPatient.gender,
        consultType: consultType,
        paymentType: "pending",
        paymentStatus: "topay",
        status: "schedule",
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
      console.log(error);
      next({ status: 400, send: { msg: "Cita no creada", data: error } });
    }
  },

  getSpecialistAppointments: async (req, res, next) => {
    const { idSpecialist } = req.params;
    const { year } = req.params;
    const { month } = req.params;
    const { day } = req.params;

    console.log("IDESPECIALISTA:", idSpecialist);
    console.log("FECHA DE CITAS:", year, month);

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
};
