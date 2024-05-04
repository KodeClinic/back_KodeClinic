const mongoose = require("mongoose");
const SpecialistInformationSchema = require("../models/submodels/specialists");
const PatientInformationSchema = require("../models/submodels/patients");

const userSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Debe ingresar un correo valido",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  verificationCode: {
    type: String,
    required: false,
  },
  validatedAccount: {
    type: Boolean,
    required: false,
  },
  role: {
    type: String,
    required: true,
    enum: ["patient", "specialist"],
  },
  name: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  birthDate: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
    enum: ["male", "female"],
  },
  cellphone: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  colony: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  patientInformation: PatientInformationSchema,
  specialistInformation: SpecialistInformationSchema,
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
