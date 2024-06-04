const Appointment = require("../models/appointments");
const Specialist = require("../models/users");
const Patient = require("../models/users");
const ClinicalHistory = require("../models/clinicalHistories");
const Template = require("../models/templates");
const transporter = require("../utils/mailer");
const { compare, encrypt } = require("../helpers/handleBcrypt");

//Delete Appointment & Clinical History refered
async function deleteAppointment(idAppointment) {
  const appointment = await Appointment.findById(idAppointment);

  const selectClinicalHistory = await ClinicalHistory.findByIdAndDelete(
    appointment.clinicalHistory
  );

  const selectAppointment = await Appointment.findByIdAndDelete(idAppointment);

  return "Cita eliminada";
}

//Create appointment for New Patient
async function createAppointmentNP(idSpecialist, body) {
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
  } = body;

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
        patientName: name,
        patientLastName: lastName,
        patientGender: gender,
        patientCellphone: cellphone,
        patientBirthdate: birthDate,
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
    html: `
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a KodeClinic</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            max-width: 600px; 
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Bienvenido a KodeClinic</h2>
        <p>Hola,</p>
        <p>¡Bienvenido a KodeClinic! Nos complace informarte que tu especialista te ha dado de alta como paciente en nuestra plataforma. Ahora puedes acceder a tu cuenta y comenzar a visualizar tus tratamientos.</p>
        <p>Para iniciar sesión, utiliza tu dirección de correo electrónico y la siguiente contraseña temporal:</p>
        <strong>Contraseña temporal:</strong> ${temporalyPassword}</p>
        <p>Una vez que hayas iniciado sesión, te recomendamos cambiar tu contraseña temporal por una que sea fácil de recordar pero segura.</p>
        <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
        <p>¡Gracias por unirte a KodeClinic!</p>
        <p>Atentamente,<br>
        El equipo de KodeClinic</p>
        <p><a href="kodeclinic.mx/LogIn" class="button">Iniciar sesión en KodeClinic</a></p>
    </div>
</body>
    `, // html body
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

  return newPatient;
}

//Create appointment for Existing patient
async function createAppointmentEP(idSpecialist, body) {
  const { patient, date, timeLapse, consultType, consultingAddress } = body;

  let arrayDate = date.split("-");
  let dateObjet = {
    year: arrayDate[0],
    month: arrayDate[1],
    day: arrayDate[2],
  };

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

    return appointment;
  } else if (appointmentValidation != 0) {
    throw new createError(404, "Cita no creada, horario no disponible");
  }
}

async function getSpecialistAppointments(idSpecialist, year, month, day) {
  const appointments = await Appointment.find({
    specialistId: idSpecialist,
    "date.year": year,
    "date.month": month,
    "date.day": day,
  }).populate("patientId");

  return appointments;
}

async function getAppointmentsbyPatient(idPatient) {
  const appointments = await Appointment.find({
    patientId: idPatient,
  });

  return appointments;
}

async function getSpecialistAvailability(idSpecialist, day, year, month) {
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

  return availability;
}

async function getSingleAppointment(idAppointment) {
  const selectAppoint = await Appointment.findById(idAppointment);

  const selectClinicalHistory = await ClinicalHistory.findById(
    selectAppoint.clinicalHistory
  );

  return [selectAppoint, selectClinicalHistory];
}

module.exports = {
  deleteAppointment,
  createAppointmentNP,
  createAppointmentEP,
  getSpecialistAppointments,
  getAppointmentsbyPatient,
  getSpecialistAvailability,
  getSingleAppointment,
  deleteAppointment,
};
