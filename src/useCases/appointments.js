const Appointment = require("../models/appointments");
const Specialist = require("../models/users");
const Patient = require("../models/users");
const ClinicalHistory = require("../models/clinicalHistories");
const Template = require("../models/templates");
const transporter = require("../utils/mailer");
const { compare, encrypt } = require("../helpers/handleBcrypt");

async function createAppointment(id, id_px) {
  let appoint = await Appointment.create(id, id_px);
  return appoint;
}

async function deleteAppointment(idAppointment) {
  const appointment = await Appointment.findById(idAppointment);
  const selectClinicalHistory = await ClinicalHistory.findByIdAndDelete(
    appointment.ClinicalHistory
  );
  const selectAppointment = await Appointment.findByIdAndDelete(idAppointment);
}

async function createAppointmentNP(idSpecialist, newPatientInfo) {
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
  const hassedPassword = await encrypt(temporalyPassword); //Hashea la contraseña
  let newPatientInfo = {
    name: newPatientInfo.name,
    lastName: newPatientInfo.lastName,
    email: newPatientInfo.email,
    password: newPatientInfo.hassedPassword,
    cellphone: newPatientInfo.cellphone,
    gender: newPatientInfo.gender,
    role: "patient",
    birthDate: newPatientInfo.birthDate,
    validatedAccount: false,
    informationComplete: false,
    temporalyPassword: true,
    verificationCode: newPatientInfo.verificationCode,
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
  const specialistUpdate = await Specialist.findByIdAndUpdate(idSpecialist, {
    "specialistInformation.patientList": [
      ...specialist.specialistInformation.patientList,
      {
        patientID: newPatient._id,
        patientName: newPatientInfo.name,
        patientLastName: newPatientInfo.lastName,
        patientGender: newPatientInfo.gender,
        patientCellphone: newPatientInfo.cellphone,
        patientBirthdate: newPatientInfo.birthDate,
      },
    ],
  });

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

  //Envio de Email con Información de la Cita Agendada
  await transporter.sendMail({
    from: '"KodeClinic" <contacto.kodeclinic@gmail.com>',
    to: email,
    subject: `KodeClinic: Información de Nueva Agendada`,
    // text: "Hello world?", // plain text body
    html: ` <h2>Información de cita</h2>
        <p>${gender == "male" ? "Estimado" : "Estimada"} ${name}</p>
        <p>Le informamos que su Especialista: ${specialist.name} ${
      specialist.lastName
    } ha agendado una cita con usted, a continuación le compartimos la información:</p>
        <table border="1" cellspacing="0" cellpadding="10">
            <tr>
                <th style="background-color: #f2f2f2;">Día de la cita</th>
                <td>${dateObjet.day}/${dateObjet.month}/${dateObjet.year}</td>
            </tr>
            <tr>
                <th style="background-color: #f2f2f2;">Horario de la cita</th>
                <td>${timeLapse}</td>
            </tr>
            <tr>
                <th style="background-color: #f2f2f2;">Tipo de cita</th>
                <td>${
                  consultType == "valoration" ? "Valoración" : "Terápia"
                }</td>
            </tr>
            <tr>
                <th style="background-color: #f2f2f2;">Dirección de la cita</th>
                <td>${consultingAddress}</td>
            </tr>
        </table>

        <p>Por favor, asegúrese de llegar a tiempo. Si necesita reprogramar la cita o tiene alguna pregunta, no dude en ponerse en contacto con su Especialista al teléfono ${
          specialist.cellphone
        }.</p>
        <p>¡Esperamos verle pronto!</p>
        <p>Atentamente,</p>
        <p>KodeClinic</p>`, // html body
  });
}

module.exports = {
  createAppointment,
  deleteAppointment,
  createAppointmentNP,

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

      const appointmentValidation = await Appointment.find({
        specialistId: idSpecialist,
        timeLapse: timeLapse,
        "date.year": dateObjet.year,
        "date.month": dateObjet.month,
        "date.day": dateObjet.day,
      });

      //Candado contra repetición de Citas en un mismo horario
      if (appointmentValidation == 0) {
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

        //Envio de Email con Información de la Cita Agendada
        await transporter.sendMail({
          from: '"KodeClinic" <contacto.kodeclinic@gmail.com>',
          to: selectPatient.email,
          subject: `KodeClinic: Información de Nueva Agendada`,
          // text: "Hello world?", // plain text body
          html: ` <h2>Información de cita</h2>
        <p>${selectPatient.gender == "male" ? "Estimado" : "Estimada"} ${
            selectPatient.name
          }</p>
        <p>Le informamos que su Especialista: ${specialist.name} ${
            specialist.lastName
          } ha agendado una cita con usted, a continuación le compartimos la información:</p>
        <table border="1" cellspacing="0" cellpadding="10">
            <tr>
                <th style="background-color: #f2f2f2;">Día de la cita</th>
                <td>${dateObjet.day}/${dateObjet.month}/${dateObjet.year}</td>
            </tr>
            <tr>
                <th style="background-color: #f2f2f2;">Horario de la cita</th>
                <td>${timeLapse}</td>
            </tr>
            <tr>
                <th style="background-color: #f2f2f2;">Tipo de cita</th>
                <td>${
                  consultType == "valoration" ? "Valoración" : "Terápia"
                }</td>
            </tr>
            <tr>
                <th style="background-color: #f2f2f2;">Dirección de la cita</th>
                <td>${consultingAddress}</td>
            </tr>
        </table>
        <p>Por favor, asegúrese de llegar a tiempo. Si necesita reprogramar la cita o tiene alguna pregunta, no dude en ponerse en contacto con su Especialista al teléfono ${
          specialist.cellphone
        }.</p>
        <p>¡Esperamos verle pronto!</p>
        <p>Atentamente,</p>
        <p>KodeClinic</p>`, // html body
        });

        next({
          status: 201,
          send: {
            msg: "Cita creada con éxito",
            data: appointment,
          },
        });
      } else if (appointmentValidation != 0) {
        next({
          status: 404,
          send: {
            msg: "Cita no creada, horario no disponible",
          },
        });
      }
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
      next({
        status: 400,
        send: { msg: "Error al evaluar la disponibilidad", data: error },
      });
    }
  },

  getSingleAppointment: async (req, res, next) => {
    const { idAppointment } = req.params;

    try {
      const selectAppoint = await Appointment.findById(idAppointment);

      const selectClinicalHistory = await ClinicalHistory.findById(
        selectAppoint.clinicalHistory
      );

      next({
        status: 201,
        send: {
          msg: "Cita encontrada con éxito",
          data: [selectAppoint, selectClinicalHistory],
        },
      });
    } catch (error) {
      next({
        status: 400,
        send: { msg: "Cita no encontrada", data: error },
      });
    }
  },
};
