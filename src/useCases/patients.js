const PxAdditionalInfo = require("../models/patients");
const PxNewPatient = require("../models/users");
const createError = require("http-errors");

async function create(id) {
  const newPatient = await PxNewPatient.create({
    ...req.body,
    patientInformation: { specialistId: id },
  });

  if (!newPatient) {
    throw new createError(404, "Paciente no creado");
  }

  return newPatient;
}

async function getById(id) {
  const patient = await PxAdditionalInfo.findById(id);

  if (!patient) {
    throw new createError(404, "Paciente no encontrado");
  }

  return patient;
}

async function all() {
  const allPatients = await PxAdditionalInfo.find();

  if (!allPatients) {
    throw new createError(404, "Pacientes no encontrados");
  }

  return allPatients;
}

module.exports = { create, all, getById };
