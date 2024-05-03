const mongoose = require("mongoose");

const SpecialistInformationSchema = new mongoose.Schema({
  medicalLicense: { type: String, required: false },
  education: {
    universityName: { type: String, required: false },
    carrer: { type: String, required: false },
    title: { type: String, required: false },
  },
  certifications: {
    institutionName: { type: String, required: false },
    certificationDate: { type: String, required: false },
    certificationName: { type: String, required: false },
  },
  patientList: [
    {
      patientID: { type: String, required: false },
      patientName: { type: String, required: false },
      patientLastName: { type: String, required: false },
      patientGender: { type: String, required: false },
      patientCellphone: { type: String, required: false },
    },
  ],
  availability: [
    {
      day: { type: String, required: false },
      start: { type: String, required: false },
      end: { type: String, required: false },
    },
  ],
});

module.exports = SpecialistInformationSchema;
