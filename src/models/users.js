const mongoose = require("mongoose");
const SpecialistInformationSchema = require("./specialists");
const PatientInformationSchema = require("./patients");

const userSchema = new mongoose.Schema({
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
  temporalyPassword: {
    type: Boolean,
    required: false,
  },
  role: {
    type: String,
    required: true,
    enum: ["patient", "specialist", "admin"],
  },
  informationComplete: { type: Boolean, required: false },
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
