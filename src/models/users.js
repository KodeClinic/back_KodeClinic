const mongoose = require("mongoose");

const personalInformationSchema = new mongoose.Schema({
  name: { type: String, required: false }, //Patient & Specialist
  lastName: { type: String, required: false }, //Patient & Specialist
  birthDate: { type: String, required: false }, //Patient & Specialist
  gender: { type: String, required: false }, //Patient & Specialist
  cellphone: { type: String, required: false }, //Patient & Specialist
  adress: { type: String, required: false }, //Patient & Specialist
  colony: { type: String, required: false }, //Patient & Specialist
  state: { type: String, required: false }, //Patient & Specialist
  medicalLicense: { type: String, required: false, unique: true }, //Specialist
  occupation: { type: String, required: false }, //Patient
  bloodType: { type: String, required: false }, //Patient
  religion: { type: String, required: false }, //Patient
  education: {
    universityName: { type: String, required: false },
    carrer: { type: String, required: false },
    title: { type: String, required: false },
  }, //Specialist
  certifications: {
    institutionName: { type: String, required: false },
    certificationDate: { type: String, required: false },
    certificationName: { type: String, required: false },
  }, //Specialist
  emergencyContact: [
    {
      number: { type: String, required: false },
      relationship: { type: String, required: false },
    },
  ], //Patient
  patientList: [
    {
      patientID: { type: String, required: false, unique: true },
      patientName: { type: String, required: false },
      patientLastName: { type: String, required: false },
      patientGender: { type: String, required: false },
      patientCellphone: { type: String, required: false },
    },
  ], //Specialist
  availability: [
    {
      day: { type: String, required: false },
      start: { type: String, required: false },
      end: { type: String, required: false },
    },
  ], //Specialist
});

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
  role: {
    type: String,
    required: true,
  },
  personalInformation: personalInformationSchema,
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
